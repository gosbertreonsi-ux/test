export type UserRole = 'sec_admin' | 'sec_engineer' | 'backend_engineer' | 'observer';

export type EnvironmentType = 'local_sim' | 'mock_api' | 'auth_staging';

export interface TestEnvironment {
  id: string;
  name: string;
  type: EnvironmentType;
  approvedTarget: string;
  authorizationExpiresAt: string;
  maxDurationSeconds: number;
  maxDispatchRate: number; // req/sec hard limit
  maxDispatchCount: number; // total hard cap
  enabled: boolean;
  killSwitchActive: boolean;
}

export type ScenarioType =
  | 'burst'            // Scenario A: High-volume burst
  | 'distributed'      // Scenario B: Distributed synthetic identities
  | 'replay'           // Scenario C: Duplicate interaction replay
  | 'invalid_auth'     // Scenario D: Invalid authentication
  | 'invalid_sequence' // Scenario E: Invalid event sequence
  | 'signature_fail'   // Scenario F: Request-signature validation
  | 'coordinated'      // Scenario G: Coordinated campaign (1,000,000 attempts)
  | 'recovery';        // Scenario H: Recovery and resilience

export interface ScenarioPreset {
  id: ScenarioType;
  code: string;
  name: string;
  shortDescription: string;
  testedControls: string[];
  defaultAttempts: number;
  defaultDuplicatePct: number;
  defaultInvalidAuthPct: number;
  defaultInvalidSeqPct: number;
  defaultInvalidSigPct: number;
  defaultConcurrency: number;
  durationSeconds: number;
  arrivalPattern: 'spike' | 'wave' | 'linear' | 'drip';
}

export interface SyntheticPost {
  id: string;
  title: string;
  author: string;
  authorHandle: string;
  contestContext?: {
    contestantA: string;
    contestantB: string;
    votingRules: string;
  };
  description: string;
  publishedDate: string;
  authoritativeLikes: number; // authoritative distinct active likes in database
  publicCachedLikes: number;   // cached public counter that attackers target
  commentsCount: number;
  repostsCount: number;
  imageUrl?: string;
}

export interface DefensePolicy {
  id: string;
  name: string;
  // Rate limiting
  accountRateLimitPerMin: number;
  sessionRateLimitPerMin: number;
  ipRateLimitPerMin: number;
  postSurgeVelocityCapSec: number;
  // Auth & Signatures
  enforceBearerAuth: boolean;
  verifyHmacSignatures: boolean;
  validateSessionImpression: boolean;
  // Idempotency & DB integrity
  enforceDbUniqueConstraint: boolean; // UNIQUE(user_id, post_id)
  enableRedisIdempotencyCache: boolean;
  // Risk & Trust scoring
  minAccountAgeHours: number;
  minTrustScore: number;
  clusterAnomalyDetection: boolean;
  // Resilience
  queueSaturationThreshold: number;
  circuitBreakerLatencyMs: number;
}

export interface SyntheticActor {
  id: string;
  username: string;
  accountAgeHours: number;
  trustScore: number; // 0 - 100
  deviceCategory: 'mobile_android' | 'mobile_ios' | 'desktop_chrome' | 'headless_bot';
  ipAddress: string;
  isKnownBotCluster: boolean;
  clusterTag?: string;
  hasValidCredentials: boolean;
}

export interface SimulatedEvent {
  id: string;
  index: number;
  timestamp: number;
  actorId: string;
  actorUsername: string;
  targetPostId: string;
  eventType: 'like' | 'repost' | 'comment';
  idempotencyKey: string;
  isDuplicate: boolean;
  hasValidAuth: boolean;
  hasValidSignature: boolean;
  hasSessionImpression: boolean;
  actorTrustScore: number;
  clientIp: string;
  userAgent: string;
  
  // Evaluation outcomes
  decision: 'ACCEPTED' | 'REJECTED' | 'THROTTLED' | 'DUPLICATE_IDEMPOTENT' | 'FLAGGED';
  ruleCode: string;
  ruleTriggered?: string;
  reasonCode: string;
  latencyMs: number;
  counterIncremented: boolean;
}

export interface ExperimentMetrics {
  logicalAttempts: number;
  dispatchedRequests: number;
  acceptedUniqueLikes: number;
  rejectedAuth: number;
  rejectedSignature: number;
  rejectedSequence: number;
  throttledRateLimit: number;
  duplicateBlocked: number;
  flaggedQuarantined: number;
  queueDepth: number;
  averageLatencyMs: number;
  p95LatencyMs: number;
  errorRatePct: number;
  discrepancyCount: number; // Authoritative DB vs Public Counter difference
  throughputPerSec: number;
  startTime: number | null;
  endTime: number | null;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'stopped';
  stopReason?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operator: string;
  role: UserRole;
  action: string;
  details: string;
  severity: 'info' | 'warn' | 'critical' | 'success';
}

export interface SecurityScorecard {
  score: number; // 0-100
  rating: 'A+' | 'A' | 'B' | 'C' | 'FAIL';
  duplicateActiveLikes: number;
  unauthorizedCommittedLikes: number;
  counterPollutionRate: number;
  rateLimitEfficacyPct: number;
  idempotencyCompliancePct: number;
  stopControlLatencyMs: number;
  findings: Array<{
    title: string;
    severity: 'low' | 'medium' | 'high' | 'info';
    status: 'pass' | 'fail';
    description: string;
  }>;
}

export interface CustomEndpointConfig {
  endpointUrl: string;
  postOrVideoLink: string;
  extractedPostId: string;
  interactionType: 'likes' | 'comments' | 'mixed';
  httpMethod: 'POST' | 'PUT';
  authHeaderType: 'bearer' | 'api_key' | 'custom' | 'none';
  authToken: string;
  customHeadersJson: string;
  customPayloadTemplate: string;
  commentTemplates: string[];
  requestsPerSecond: number;
  totalRequestsCap: number;
  concurrencyLimit: number;
  certifiedAppOwnership: boolean;
  duplicateUserSimulation: boolean;
}

export interface LiveDispatchLog {
  id: string;
  index: number;
  timestamp: number;
  url: string;
  action: 'like' | 'comment';
  status: number; // HTTP status code e.g. 200, 201, 401, 409, 429, 500, or 0 for network failure
  statusText: string;
  latencyMs: number;
  payloadSummary: string;
  responseSnippet: string;
  error?: string;
  actorId: string;
}

