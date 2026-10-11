export interface HealthResponse {
  ok: boolean;
  mode: string;
  generatedActivityIsSimulated: boolean;
}

export interface GenerateEngagementPayload {
  postId: string;
  likes: number;
  comments: number;
  reshares: number;
}

export class MiziziApiClient {
  private baseUrl: string;
  private adminToken: string;

  constructor(baseUrl: string = 'http://localhost:5050', adminToken: string = '') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.adminToken = adminToken;
  }

  public updateCredentials(baseUrl: string, adminToken: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.adminToken = adminToken;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.adminToken) {
      headers['x-admin-token'] = this.adminToken;
    }
    return headers;
  }

  public async checkHealth(): Promise<{ ok: boolean; data?: HealthResponse; error?: string; latencyMs: number }> {
    const start = performance.now();
    try {
      const res = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const latencyMs = Math.round(performance.now() - start);
      if (!res.ok) {
        return { ok: false, error: `Health check returned HTTP ${res.status}`, latencyMs };
      }
      const data = await res.json();
      return { ok: true, data, latencyMs };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return {
        ok: false,
        error: err?.message?.includes('Failed to fetch')
          ? `Cannot connect to ${this.baseUrl}. Verify that "npm run dev" is running on port 5050 and CORS is allowed.`
          : err?.message || 'Connection failed',
        latencyMs,
      };
    }
  }

  public async getPosts(): Promise<{ ok: boolean; data?: any[]; error?: string; latencyMs: number }> {
    const start = performance.now();
    try {
      const res = await fetch(`${this.baseUrl}/api/posts`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const latencyMs = Math.round(performance.now() - start);
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.error || `HTTP ${res.status}`, latencyMs };
      }
      return { ok: true, data, latencyMs };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return { ok: false, error: err?.message || 'Network error', latencyMs };
    }
  }

  public async createSamplePost(): Promise<{ ok: boolean; post?: any; error?: string; latencyMs: number }> {
    const start = performance.now();
    try {
      const res = await fetch(`${this.baseUrl}/api/posts/sample`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({}),
      });
      const latencyMs = Math.round(performance.now() - start);
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.error || `HTTP ${res.status}`, latencyMs };
      }
      return { ok: true, post: data?.post, latencyMs };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return { ok: false, error: err?.message || 'Network error', latencyMs };
    }
  }

  public async generateEngagement(payload: GenerateEngagementPayload): Promise<{ ok: boolean; data?: any; error?: string; latencyMs: number }> {
    const start = performance.now();
    try {
      const res = await fetch(`${this.baseUrl}/api/engagement/generate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });
      const latencyMs = Math.round(performance.now() - start);
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.error || `HTTP ${res.status}`, latencyMs };
      }
      return { ok: true, data, latencyMs };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return { ok: false, error: err?.message || 'Network error', latencyMs };
    }
  }

  public async getPostEngagement(postId: string): Promise<{ ok: boolean; counts?: any; error?: string; latencyMs: number }> {
    const start = performance.now();
    try {
      const res = await fetch(`${this.baseUrl}/api/posts/${encodeURIComponent(postId)}/engagement`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const latencyMs = Math.round(performance.now() - start);
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.error || `HTTP ${res.status}`, latencyMs };
      }
      return { ok: true, counts: data?.counts, latencyMs };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return { ok: false, error: err?.message || 'Network error', latencyMs };
    }
  }

  public async deleteBatch(batchId: string): Promise<{ ok: boolean; count?: number; error?: string; latencyMs: number }> {
    const start = performance.now();
    try {
      const res = await fetch(`${this.baseUrl}/api/engagement/batches/${encodeURIComponent(batchId)}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      const latencyMs = Math.round(performance.now() - start);
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.error || `HTTP ${res.status}`, latencyMs };
      }
      return { ok: true, count: data?.deletedTestRecords, latencyMs };
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - start);
      return { ok: false, error: err?.message || 'Network error', latencyMs };
    }
  }
}
