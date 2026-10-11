export type SupportedApp = string;

export interface CustomerApp {
  id: string;
  name: string;
  clientOrg: string;
  apiBaseUrl: string;
  likesEndpoint: string;
  commentsEndpoint: string;
  resharesEndpoint: string;
  authType: 'bearer' | 'api_key' | 'custom' | 'none';
  authHeaderName: string;
  authToken: string;
  httpMethod: 'POST' | 'PUT';
  customHeadersJson: string;
  payloadTemplate: string;
  active: boolean;
  createdAt: string;
}

export interface DemoPost {
  id: string;
  appName: string;
  title: string;
  body: string;
  author: string;
  authorHandle: string;
  createdAt: string;
  // Genuine engagement (real users, untouched)
  genuineLikes: number;
  genuineComments: number;
  genuineReshares: number;
  // Simulated engagement counts (generated)
  simulatedLikes: number;
  simulatedComments: number;
  simulatedReshares: number;
  batchesCount: number;
}

export interface SimulatedCommentRecord {
  id: string;
  batchId: string;
  postId: string;
  appName: string;
  authorName: string;
  content: string;
  createdAt: string;
  label: 'SIMULATED';
}

export interface EngagementBatch {
  id: string;
  postId: string;
  postTitle: string;
  appName: string;
  adminName: string;
  timestamp: string;
  likes: number;
  comments: number;
  reshares: number;
  totalRecords: number;
  deliveryMode: 'instant' | '10s' | '30s' | '60s';
  status: 'active' | 'cleared';
  label: 'SIMULATED — DEVELOPMENT ONLY';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  admin: string;
  action: 'GENERATE_BATCH' | 'DELETE_BATCH' | 'PURGE_ALL_SIMULATED' | 'CREATE_SAMPLE_POST' | 'REGISTER_APP' | 'UPDATE_APP';
  postId: string;
  appName: string;
  details: string;
  batchId?: string;
}
