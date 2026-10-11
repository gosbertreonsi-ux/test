import { CustomEndpointConfig, LiveDispatchLog } from '../types';

export class LiveAppDispatcher {
  private config: CustomEndpointConfig;
  private abortController: AbortController | null = null;
  private isRunning: boolean = false;
  private logs: LiveDispatchLog[] = [];
  private onLogCallback: ((logs: LiveDispatchLog[]) => void) | null = null;
  private onStatsCallback: ((stats: LiveDispatcherStats) => void) | null = null;

  constructor(config: CustomEndpointConfig) {
    this.config = config;
  }

  public setCallbacks(
    onLog: (logs: LiveDispatchLog[]) => void,
    onStats: (stats: LiveDispatcherStats) => void
  ) {
    this.onLogCallback = onLog;
    this.onStatsCallback = onStats;
  }

  public updateConfig(config: CustomEndpointConfig) {
    this.config = config;
  }

  // Single probe request to test endpoint connectivity & CORS
  public async probeSingle(actionOverride?: 'like' | 'comment'): Promise<LiveDispatchLog> {
    const action = actionOverride || (this.config.interactionType === 'comments' ? 'comment' : 'like');
    const actorId = `probe_user_${Math.floor(1000 + Math.random() * 9000)}`;
    const comment = this.getRandomComment();

    return this.sendRequest(1, action, actorId, comment);
  }

  // Batch runner for controlled live testing on user's own app
  public async startBatch(
    onProgress?: (current: number, total: number) => void
  ): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;
    this.abortController = new AbortController();
    this.logs = [];

    const total = this.config.totalRequestsCap;
    const intervalMs = Math.max(20, Math.floor(1000 / Math.max(1, this.config.requestsPerSecond)));
    const duplicatePool = ['user_pinned_dup_1', 'user_pinned_dup_2', 'user_pinned_dup_3'];

    let dispatched = 0;

    while (dispatched < total && this.isRunning) {
      if (this.abortController.signal.aborted) break;

      dispatched++;
      const action =
        this.config.interactionType === 'mixed'
          ? Math.random() > 0.4 ? 'like' : 'comment'
          : this.config.interactionType === 'comments'
          ? 'comment'
          : 'like';

      // If duplicate simulation is enabled, 50% reuse a fixed user to test the app's UNIQUE constraint
      const isDuplicate = this.config.duplicateUserSimulation && Math.random() < 0.5;
      const actorId = isDuplicate
        ? duplicatePool[Math.floor(Math.random() * duplicatePool.length)]
        : `live_tester_${10000 + dispatched}`;

      const comment = this.getRandomComment();

      // Dispatch request
      this.sendRequest(dispatched, action, actorId, comment).then((log) => {
        this.logs = [log, ...this.logs.slice(0, 199)];
        if (this.onLogCallback) this.onLogCallback(this.logs);
        this.emitStats();
      });

      if (onProgress) {
        onProgress(dispatched, total);
      }

      // Delay according to requestsPerSecond rate limit
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    this.isRunning = false;
    this.emitStats();
  }

  public stop() {
    this.isRunning = false;
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  private getRandomComment(): string {
    const list = this.config.commentTemplates.length > 0
      ? this.config.commentTemplates
      : ['Great post! 🔥', 'Voted! 🇹🇿❤️', 'Amazing contest', 'Supported! 👏', '100% deserved'];
    return list[Math.floor(Math.random() * list.length)];
  }

  private async sendRequest(
    index: number,
    action: 'like' | 'comment',
    actorId: string,
    commentText: string
  ): Promise<LiveDispatchLog> {
    const startTime = performance.now();
    const url = this.config.endpointUrl.trim();

    // Headers assembly
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Simulator-Agent': 'AttackerMode-Auditor/1.0',
    };

    if (this.config.authHeaderType === 'bearer' && this.config.authToken) {
      headers['Authorization'] = `Bearer ${this.config.authToken.trim()}`;
    } else if (this.config.authHeaderType === 'api_key' && this.config.authToken) {
      headers['X-API-Key'] = this.config.authToken.trim();
    } else if (this.config.authHeaderType === 'custom' && this.config.authToken) {
      headers['Authorization'] = this.config.authToken.trim();
    }

    // Parse any additional custom headers
    if (this.config.customHeadersJson) {
      try {
        const parsed = JSON.parse(this.config.customHeadersJson);
        Object.assign(headers, parsed);
      } catch {
        // ignore JSON header parse error
      }
    }

    // Build Payload
    const postId = this.config.extractedPostId || 'sample_post_1';
    let payloadObj: any = {
      postId,
      userId: actorId,
      action,
      timestamp: Date.now(),
    };

    if (action === 'comment') {
      payloadObj.comment = commentText;
    }

    // Optional custom JSON payload template replace
    let bodyString = JSON.stringify(payloadObj);
    if (this.config.customPayloadTemplate && this.config.customPayloadTemplate.trim()) {
      try {
        let template = this.config.customPayloadTemplate
          .replace(/\${postId}/g, postId)
          .replace(/\${userId}/g, actorId)
          .replace(/\${action}/g, action)
          .replace(/\${comment}/g, commentText)
          .replace(/\${timestamp}/g, String(Date.now()));
        bodyString = template;
      } catch {
        // fallback to default body
      }
    }

    try {
      const res = await fetch(url, {
        method: this.config.httpMethod,
        headers,
        body: bodyString,
        signal: this.abortController?.signal,
      });

      const latencyMs = Math.round(performance.now() - startTime);
      let snippet = '';
      try {
        const text = await res.text();
        snippet = text.slice(0, 150);
      } catch {
        snippet = '(binary or unreadable body)';
      }

      return {
        id: `net_${Date.now()}_${index}`,
        index,
        timestamp: Date.now(),
        url,
        action,
        status: res.status,
        statusText: res.statusText || String(res.status),
        latencyMs,
        payloadSummary: `${action.toUpperCase()} by ${actorId}${action === 'comment' ? `: "${commentText}"` : ''}`,
        responseSnippet: snippet,
        actorId,
      };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startTime);
      const isAbort = err?.name === 'AbortError';
      const isCorsOrNet = err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError');

      return {
        id: `net_err_${Date.now()}_${index}`,
        index,
        timestamp: Date.now(),
        url,
        action,
        status: 0,
        statusText: isAbort ? 'ABORTED' : isCorsOrNet ? 'NETWORK_OR_CORS_ERROR' : 'ERROR',
        latencyMs,
        payloadSummary: `${action.toUpperCase()} by ${actorId}`,
        responseSnippet: '',
        error: isCorsOrNet
          ? 'Network / CORS blocked: ensure your server sends Access-Control-Allow-Origin headers or allows test requests.'
          : err?.message || 'Request failed',
        actorId,
      };
    }
  }

  private emitStats() {
    if (!this.onStatsCallback) return;

    let accepted = 0;
    let duplicate = 0;
    let throttled = 0;
    let unauth = 0;
    let serverErrors = 0;
    let networkErrors = 0;
    let totalLatency = 0;

    for (const log of this.logs) {
      if (log.status >= 200 && log.status < 300) accepted++;
      else if (log.status === 409) duplicate++;
      else if (log.status === 429) throttled++;
      else if (log.status === 401 || log.status === 403) unauth++;
      else if (log.status >= 500) serverErrors++;
      else if (log.status === 0) networkErrors++;

      totalLatency += log.latencyMs;
    }

    const avgLatency = this.logs.length > 0 ? Math.round(totalLatency / this.logs.length) : 0;

    this.onStatsCallback({
      totalDispatched: this.logs.length,
      accepted2xx: accepted,
      duplicate409: duplicate,
      throttled429: throttled,
      unauthorized401_403: unauth,
      serverError5xx: serverErrors,
      networkErrors,
      avgLatencyMs: avgLatency,
      isRunning: this.isRunning,
    });
  }
}

export interface LiveDispatcherStats {
  totalDispatched: number;
  accepted2xx: number;
  duplicate409: number;
  throttled429: number;
  unauthorized401_403: number;
  serverError5xx: number;
  networkErrors: number;
  avgLatencyMs: number;
  isRunning: boolean;
}
