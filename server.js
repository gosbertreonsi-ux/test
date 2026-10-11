import express from 'express';
import dotenv from 'dotenv';
import crypto from 'node:crypto';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5050);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'mizizi-dev-admin-secret-token-2026-xyz';

// CORS middleware so the React dashboard on port 3000 can communicate with port 5050
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-admin-token, Authorization, X-API-Key');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '32kb' }));

// In-memory data store for standalone testing (isolated from genuine tables)
let demoPosts = [
  {
    id: 'post_mizizi_dev_01',
    appName: 'Mizizi Social',
    title: 'Mizizi Social — Development Test Post',
    body: 'Sample post for local testing. All engagement shown here is simulated and separate from genuine activity.',
    createdAt: new Date().toISOString(),
    engagements: [],
  },
  {
    id: 'post_bibo_live_02',
    appName: 'Bibo',
    title: 'Bibo Creator Spotlight: Weekend Acoustic Sessions',
    body: 'Catch the top acoustic live stream this Saturday! Tap like to bookmark and leave your song requests.',
    createdAt: new Date().toISOString(),
    engagements: [],
  },
];

let simulatedEngagements = [];

function requireAdmin(req, res, next) {
  const provided = req.get('x-admin-token') || req.get('authorization')?.replace('Bearer ', '') || '';
  if (ADMIN_TOKEN && provided !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Admin authentication required. Invalid x-admin-token.' });
  }
  next();
}

// 1. Health check
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mode: 'development-only',
    generatedActivityIsSimulated: true,
    serverTime: new Date().toISOString(),
    port: PORT,
  });
});

// 2. List test posts
app.get('/api/posts', requireAdmin, (_req, res) => {
  const result = demoPosts.map((post) => {
    const postEngagements = simulatedEngagements.filter((e) => e.postId === post.id);
    return {
      id: post.id,
      appName: post.appName,
      title: post.title,
      body: post.body,
      createdAt: post.createdAt,
      simulated: {
        likes: postEngagements.filter((e) => e.type === 'LIKE').length,
        comments: postEngagements.filter((e) => e.type === 'COMMENT').length,
        reshares: postEngagements.filter((e) => e.type === 'RESHARE').length,
      },
      label: 'SIMULATED — DEVELOPMENT ONLY',
    };
  });
  res.json(result);
});

// 3. Create sample test post
app.post('/api/posts/sample', requireAdmin, (req, res) => {
  const post = {
    id: `post_${Date.now()}`,
    appName: req.body?.appName || 'Mizizi Social',
    title: req.body?.title || `Mizizi Social — Test Post #${demoPosts.length + 1}`,
    body: req.body?.body || 'Sample post for testing engagement pipelines. All engagement is isolated.',
    createdAt: new Date().toISOString(),
    engagements: [],
  };
  demoPosts.unshift(post);
  res.status(201).json({ post, label: 'SIMULATED — DEVELOPMENT ONLY' });
});

// 4. Generate simulated engagement batch
const commentSamples = [
  'SIMULATED COMMENT: Great demo post!',
  'SIMULATED COMMENT: Testing the comment display.',
  'SIMULATED COMMENT: Sample feedback for the UI.',
  'SIMULATED COMMENT: This is placeholder test content.',
  'SIMULATED COMMENT: Checking the engagement layout.',
  'SIMULATED COMMENT: Test comment generated in development.',
  'SIMULATED COMMENT: The preview is looking good.',
  'SIMULATED COMMENT: Sample comment for QA.',
];

app.post('/api/engagement/generate', requireAdmin, (req, res) => {
  const { postId, likes = 500, comments = 50, reshares = 100 } = req.body;

  // Extract ID if a full URL was provided
  let cleanId = postId;
  const urlMatch = postId.match(/\/(?:p|videos|reel|posts?)\/([a-zA-Z0-9_-]+)/);
  if (urlMatch && urlMatch[1]) {
    cleanId = urlMatch[1];
  }

  let post = demoPosts.find((p) => p.id === postId || p.id === cleanId);
  if (!post) {
    // Auto-register external post reference on the fly
    post = {
      id: cleanId,
      appName: req.body?.appName || 'Custom Application',
      title: `Post Reference: ${cleanId}`,
      body: `Target post reference from URL: ${postId}`,
      createdAt: new Date().toISOString(),
      engagements: [],
    };
    demoPosts.unshift(post);
  }

  const batchId = crypto.randomUUID();
  const rows = [];

  for (let i = 0; i < likes; i++) {
    rows.push({
      id: `sim_like_${batchId}_${i}`,
      postId,
      type: 'LIKE',
      batchId,
      label: 'SIMULATED',
      createdAt: new Date().toISOString(),
    });
  }

  for (let i = 0; i < comments; i++) {
    rows.push({
      id: `sim_comment_${batchId}_${i}`,
      postId,
      type: 'COMMENT',
      batchId,
      label: 'SIMULATED',
      content: commentSamples[i % commentSamples.length],
      createdAt: new Date().toISOString(),
    });
  }

  for (let i = 0; i < reshares; i++) {
    rows.push({
      id: `sim_reshare_${batchId}_${i}`,
      postId,
      type: 'RESHARE',
      batchId,
      label: 'SIMULATED',
      createdAt: new Date().toISOString(),
    });
  }

  simulatedEngagements.push(...rows);

  res.status(201).json({
    ok: true,
    batchId,
    postId,
    appName: post.appName,
    label: 'SIMULATED — DEVELOPMENT ONLY',
    generated: { likes, comments, reshares, total: rows.length },
    message: 'Created isolated test records. Genuine engagement was not modified.',
  });
});

// 5. Delete specific batch
app.delete('/api/engagement/batches/:batchId', requireAdmin, (req, res) => {
  const { batchId } = req.params;
  const initialLength = simulatedEngagements.length;
  simulatedEngagements = simulatedEngagements.filter((e) => e.batchId !== batchId);
  const deletedCount = initialLength - simulatedEngagements.length;

  res.json({
    ok: true,
    deletedTestRecords: deletedCount,
    message: `Batch ${batchId} deleted. ${deletedCount} simulated rows removed.`,
  });
});

// 6. Get post engagement counts
app.get('/api/posts/:postId/engagement', requireAdmin, (req, res) => {
  const { postId } = req.params;
  const postEngagements = simulatedEngagements.filter((e) => e.postId === postId);

  res.json({
    postId,
    label: 'SIMULATED — DEVELOPMENT ONLY',
    counts: {
      likes: postEngagements.filter((e) => e.type === 'LIKE').length,
      comments: postEngagements.filter((e) => e.type === 'COMMENT').length,
      reshares: postEngagements.filter((e) => e.type === 'RESHARE').length,
    },
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Mizizi Engagement Generator Backend API running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔐 Admin Token: ${ADMIN_TOKEN}`);
  console.log(`✅ Development Mode — All records isolated as SIMULATED.`);
  console.log(`======================================================\n`);
});
