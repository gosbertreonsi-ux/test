import { DemoPost, CustomerApp } from '../types/mizizi';

export const INITIAL_CUSTOMER_APPS: CustomerApp[] = [
  {
    id: 'app_mizizi_social',
    name: 'Mizizi Social',
    clientOrg: 'Mizizi Media Group',
    apiBaseUrl: 'http://localhost:5050',
    likesEndpoint: '/api/engagement/generate',
    commentsEndpoint: '/api/engagement/generate',
    resharesEndpoint: '/api/engagement/generate',
    authType: 'api_key',
    authHeaderName: 'x-admin-token',
    authToken: 'mizizi-dev-admin-secret-token-2026-xyz',
    httpMethod: 'POST',
    customHeadersJson: '{\n  "X-Client": "Mizizi-Engagement-Generator"\n}',
    payloadTemplate: '{\n  "postId": "${postId}",\n  "likes": ${likes},\n  "comments": ${comments},\n  "reshares": ${reshares}\n}',
    active: true,
    createdAt: '2026-09-01T00:00:00Z',
  },
  {
    id: 'app_bibo_live',
    name: 'Bibo',
    clientOrg: 'Bibo Interactive Ltd',
    apiBaseUrl: 'https://staging-api.biboapp.io',
    likesEndpoint: '/api/v1/posts/${postId}/likes',
    commentsEndpoint: '/api/v1/posts/${postId}/comments',
    resharesEndpoint: '/api/v1/posts/${postId}/shares',
    authType: 'bearer',
    authHeaderName: 'Authorization',
    authToken: 'bibo_test_jwt_bearer_token',
    httpMethod: 'POST',
    customHeadersJson: '{\n  "X-Bibo-Client-Version": "3.1.0"\n}',
    payloadTemplate: '{\n  "postId": "${postId}",\n  "userId": "${userId}",\n  "action": "${action}",\n  "content": "${comment}"\n}',
    active: true,
    createdAt: '2026-09-15T00:00:00Z',
  },
  {
    id: 'app_pulse_community',
    name: 'Pulse Community App',
    clientOrg: 'Pulse Media Inc',
    apiBaseUrl: 'https://api.pulsecommunity.dev',
    likesEndpoint: '/v2/interactions/likes',
    commentsEndpoint: '/v2/interactions/comments',
    resharesEndpoint: '/v2/interactions/reshares',
    authType: 'api_key',
    authHeaderName: 'X-API-Key',
    authToken: 'pulse_dev_key_sec_9941',
    httpMethod: 'POST',
    customHeadersJson: '{\n  "X-App-Id": "pulse-web-client"\n}',
    payloadTemplate: '{\n  "entityId": "${postId}",\n  "actorId": "${userId}",\n  "type": "${action}",\n  "commentText": "${comment}"\n}',
    active: true,
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'app_generic_customer',
    name: 'Custom Customer App',
    clientOrg: 'External Client Platform',
    apiBaseUrl: 'http://localhost:3000/api',
    likesEndpoint: '/posts/${postId}/like',
    commentsEndpoint: '/posts/${postId}/comments',
    resharesEndpoint: '/posts/${postId}/share',
    authType: 'none',
    authHeaderName: '',
    authToken: '',
    httpMethod: 'POST',
    customHeadersJson: '{}',
    payloadTemplate: '{\n  "postId": "${postId}",\n  "userId": "${userId}",\n  "comment": "${comment}"\n}',
    active: true,
    createdAt: '2026-10-05T00:00:00Z',
  },
];

export const INITIAL_DEMO_POSTS: DemoPost[] = [
  {
    id: 'post_mizizi_dev_01',
    appName: 'Mizizi Social',
    title: 'Mizizi Social — Development Test Post',
    body: 'This is a sample post for testing the Mizizi Engagement Generator. All generated engagement is simulated test data and is not genuine user activity.',
    author: 'Mizizi Core Team',
    authorHandle: '@mizizi_official',
    createdAt: '2026-10-10T08:00:00Z',
    genuineLikes: 42,
    genuineComments: 6,
    genuineReshares: 4,
    simulatedLikes: 500,
    simulatedComments: 50,
    simulatedReshares: 100,
    batchesCount: 1,
  },
  {
    id: 'post_mizizi_feature_02',
    appName: 'Mizizi Social',
    title: 'New Audio Spaces & Live Threads on Mizizi',
    body: 'We are rolling out live audio rooms and threaded discussions across East Africa. Test how high comment density performs on mobile feeds.',
    author: 'Sarah K. (Product)',
    authorHandle: '@sarah_mizizi',
    createdAt: '2026-10-09T14:30:00Z',
    genuineLikes: 118,
    genuineComments: 19,
    genuineReshares: 12,
    simulatedLikes: 0,
    simulatedComments: 0,
    simulatedReshares: 0,
    batchesCount: 0,
  },
  {
    id: 'post_bibo_spotlight_03',
    appName: 'Bibo',
    title: 'Bibo Creator Spotlight: Weekend Acoustic Sessions',
    body: 'Catch the top acoustic live stream this Saturday! Tap like to bookmark and leave your song requests in the comments.',
    author: 'Bibo Editorial',
    authorHandle: '@bibo_app',
    createdAt: '2026-10-08T11:15:00Z',
    genuineLikes: 85,
    genuineComments: 14,
    genuineReshares: 9,
    simulatedLikes: 0,
    simulatedComments: 0,
    simulatedReshares: 0,
    batchesCount: 0,
  },
  {
    id: 'post_creators_milestone_04',
    appName: 'Mizizi Creators',
    title: 'Creator Economy 2026: Fast Monetization & Tipping',
    body: 'Direct fan contributions are now enabled in beta for verified content partners. Test sample comments and engagement volume.',
    author: 'DevRel Team',
    authorHandle: '@mizizi_devs',
    createdAt: '2026-10-07T09:45:00Z',
    genuineLikes: 210,
    genuineComments: 28,
    genuineReshares: 35,
    simulatedLikes: 0,
    simulatedComments: 0,
    simulatedReshares: 0,
    batchesCount: 0,
  },
];

export const COMMENT_SAMPLES = [
  'SIMULATED COMMENT: Great demo post!',
  'SIMULATED COMMENT: Testing the comment display.',
  'SIMULATED COMMENT: Sample feedback for the UI.',
  'SIMULATED COMMENT: This is placeholder test content.',
  'SIMULATED COMMENT: Checking the engagement layout.',
  'SIMULATED COMMENT: Test comment generated in development.',
  'SIMULATED COMMENT: The preview is looking good.',
  'SIMULATED COMMENT: Sample comment for QA.',
  'SIMULATED COMMENT: Checking responsive behavior.',
  'SIMULATED COMMENT: Demo-only engagement data.',
  'SIMULATED COMMENT: Verifying high comment thread density.',
  'SIMULATED COMMENT: Load testing with isolated synthetic record.',
];

export const BACKEND_STARTER_FILES: Record<string, string> = {
  '.env.example': `NODE_ENV=development
PORT=5050
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/mizizi_engagement_dev?schema=public"
# Use a long random value. Required for all admin endpoints.
ADMIN_TOKEN="replace-with-a-long-random-development-token"`,

  'package.json': `{
  "name": "mizizi-engagement-generator",
  "version": "1.0.0",
  "private": true,
  "description": "Development-only simulated engagement generator for Mizizi Social",
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:seed": "node prisma/seed.js"
  },
  "dependencies": {
    "@prisma/client": "^6.16.2",
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "helmet": "^8.1.0",
    "zod": "^4.1.5"
  },
  "devDependencies": {
    "prisma": "^6.16.2"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}`,

  'prisma/schema.prisma': `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum SimulatedEngagementType {
  LIKE
  COMMENT
  RESHARE
}

model DemoPost {
  id          String                 @id @default(uuid())
  appName     String                 @default("Mizizi Social")
  title       String
  body        String
  createdAt   DateTime               @default(now())
  engagements SimulatedEngagement[]
}

model SimulatedEngagement {
  id        String                  @id @default(uuid())
  postId    String
  post      DemoPost                @relation(fields: [postId], references: [id], onDelete: Cascade)
  type      SimulatedEngagementType
  batchId   String
  label     String                  @default("SIMULATED")
  content   String?
  createdAt DateTime                @default(now())

  @@index([postId, type])
  @@index([batchId])
}`,

  'src/server.js': `require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const crypto = require("node:crypto");
const { PrismaClient, SimulatedEngagementType } = require("@prisma/client");
const { z } = require("zod");

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT || 5050);
const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

if (!IS_DEVELOPMENT) {
  console.error("Refusing to start: this generator must run only with NODE_ENV=development.");
  process.exit(1);
}
if (!ADMIN_TOKEN || ADMIN_TOKEN.length < 24) {
  console.error("Set ADMIN_TOKEN in .env to a random value at least 24 characters long.");
  process.exit(1);
}

app.use(helmet());
app.use(express.json({ limit: "32kb" }));

function requireAdmin(req, res, next) {
  const provided = req.get("x-admin-token") || "";
  const a = Buffer.from(provided);
  const b = Buffer.from(ADMIN_TOKEN);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(401).json({ error: "Admin authentication required." });
  }
  next();
}

const generateSchema = z.object({
  postId: z.string().min(1),
  likes: z.number().int().min(0).max(10000).default(500),
  comments: z.number().int().min(0).max(500).default(50),
  reshares: z.number().int().min(0).max(2000).default(100)
}).strict();

const commentSamples = [
  "SIMULATED COMMENT: Great demo post!",
  "SIMULATED COMMENT: Testing the comment display.",
  "SIMULATED COMMENT: Sample feedback for the UI.",
  "SIMULATED COMMENT: This is placeholder test content.",
  "SIMULATED COMMENT: Checking the engagement layout.",
  "SIMULATED COMMENT: Test comment generated in development.",
  "SIMULATED COMMENT: The preview is looking good.",
  "SIMULATED COMMENT: Sample comment for QA.",
  "SIMULATED COMMENT: Checking responsive behavior.",
  "SIMULATED COMMENT: Demo-only engagement data."
];

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: "development-only", generatedActivityIsSimulated: true });
});

app.get("/api/posts", requireAdmin, async (_req, res, next) => {
  try {
    const posts = await prisma.demoPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { engagements: { select: { type: true } } }
    });
    res.json(posts.map((post) => ({
      id: post.id,
      appName: post.appName,
      title: post.title,
      body: post.body,
      createdAt: post.createdAt,
      simulated: {
        likes: post.engagements.filter(e => e.type === "LIKE").length,
        comments: post.engagements.filter(e => e.type === "COMMENT").length,
        reshares: post.engagements.filter(e => e.type === "RESHARE").length
      },
      label: "SIMULATED — DEVELOPMENT ONLY"
    })));
  } catch (error) { next(error); }
});

app.post("/api/posts/sample", requireAdmin, async (_req, res, next) => {
  try {
    const post = await prisma.demoPost.create({
      data: {
        appName: "Mizizi Social",
        title: "Mizizi Social — Development Test Post",
        body: "Sample post for local testing. All engagement shown here is simulated and separate from genuine activity."
      }
    });
    res.status(201).json({ post, label: "SIMULATED — DEVELOPMENT ONLY" });
  } catch (error) { next(error); }
});

app.post("/api/engagement/generate", requireAdmin, async (req, res, next) => {
  const parsed = generateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request.", details: parsed.error.flatten() });
  }

  const { postId, likes, comments, reshares } = parsed.data;
  try {
    const post = await prisma.demoPost.findUnique({ where: { id: postId } });
    if (!post) return res.status(404).json({ error: "Demo post not found." });

    const batchId = crypto.randomUUID();
    const rows = [];
    for (let i = 0; i < likes; i++) {
      rows.push({ postId, type: SimulatedEngagementType.LIKE, batchId, label: "SIMULATED" });
    }
    for (let i = 0; i < comments; i++) {
      rows.push({
        postId,
        type: SimulatedEngagementType.COMMENT,
        batchId,
        label: "SIMULATED",
        content: commentSamples[i % commentSamples.length]
      });
    }
    for (let i = 0; i < reshares; i++) {
      rows.push({ postId, type: SimulatedEngagementType.RESHARE, batchId, label: "SIMULATED" });
    }

    // Only writes to SimulatedEngagement. Genuine engagement tables are never touched.
    await prisma.simulatedEngagement.createMany({ data: rows });

    res.status(201).json({
      ok: true,
      batchId,
      postId,
      appName: post.appName,
      label: "SIMULATED — DEVELOPMENT ONLY",
      generated: { likes, comments, reshares, total: rows.length },
      message: "Created isolated test records. Genuine engagement was not modified."
    });
  } catch (error) { next(error); }
});

app.delete("/api/engagement/batches/:batchId", requireAdmin, async (req, res, next) => {
  try {
    const result = await prisma.simulatedEngagement.deleteMany({
      where: { batchId: req.params.batchId }
    });
    res.json({
      ok: true,
      deletedTestRecords: result.count,
      message: "Only records in the specified simulated batch were deleted."
    });
  } catch (error) { next(error); }
});

app.listen(PORT, () => {
  console.log(\`Mizizi Engagement Generator running on port \${PORT}\`);
});`,

  'README.md': `# Mizizi Engagement Generator (Development Only)
A starter module for generating isolated simulated test engagement for Mizizi Social.
It creates a sample post and configurable test records for likes, comments, and reshares.
It does not write to any live engagement tables.

## Quick Setup
1. npm install
2. cp .env.example .env
3. npm run db:generate && npm run db:push && npm run db:seed
4. npm run dev
Visit http://localhost:5050 with your ADMIN_TOKEN.`
};
