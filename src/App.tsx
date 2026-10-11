import React, { useState, useMemo } from 'react';
import {
  AuditLog,
  DemoPost,
  EngagementBatch,
  SimulatedCommentRecord,
  SupportedApp,
  CustomerApp,
} from './types/mizizi';
import { INITIAL_DEMO_POSTS, INITIAL_CUSTOMER_APPS, COMMENT_SAMPLES } from './data/miziziData';
import { MiziziApiClient } from './services/miziziApiClient';
import { MiziziHeader } from './components/MiziziHeader';
import { LiveServerPanel } from './components/LiveServerPanel';
import { EngagementGeneratorForm } from './components/EngagementGeneratorForm';
import { PostEngagementViewer } from './components/PostEngagementViewer';
import { BatchesAndAudit } from './components/BatchesAndAudit';
import { BackendStarterModal } from './components/BackendStarterModal';
import { CustomerAppRegistry } from './components/CustomerAppRegistry';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'generator' | 'posts' | 'batches' | 'backend' | 'registry'>('generator');
  const [registeredApps, setRegisteredApps] = useState<CustomerApp[]>(INITIAL_CUSTOMER_APPS);
  const [selectedApp, setSelectedApp] = useState<SupportedApp>('Mizizi Social');
  const [adminToken, setAdminToken] = useState<string>('mizizi-dev-admin-secret-token-2026-xyz');
  const [serverUrl, setServerUrl] = useState<string>('http://localhost:5050');
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);

  const apiClient = useMemo(
    () => new MiziziApiClient(serverUrl, adminToken),
    [serverUrl, adminToken]
  );

  // Posts State
  const [posts, setPosts] = useState<DemoPost[]>(INITIAL_DEMO_POSTS);
  const [selectedPostId, setSelectedPostId] = useState<string>('post_mizizi_dev_01');

  // Simulated Comments State
  const [comments, setComments] = useState<SimulatedCommentRecord[]>([
    {
      id: 'comm_init_01',
      batchId: 'batch_seed_001',
      postId: 'post_mizizi_dev_01',
      appName: 'Mizizi Social',
      authorName: 'Mizizi QA Bot #01',
      content: 'SIMULATED COMMENT: Great demo post!',
      createdAt: '2026-10-10T08:02:00Z',
      label: 'SIMULATED',
    },
    {
      id: 'comm_init_02',
      batchId: 'batch_seed_001',
      postId: 'post_mizizi_dev_01',
      appName: 'Mizizi Social',
      authorName: 'Mizizi QA Bot #02',
      content: 'SIMULATED COMMENT: Testing the comment display.',
      createdAt: '2026-10-10T08:03:00Z',
      label: 'SIMULATED',
    },
    {
      id: 'comm_init_03',
      batchId: 'batch_seed_001',
      postId: 'post_mizizi_dev_01',
      appName: 'Mizizi Social',
      authorName: 'Mizizi QA Bot #03',
      content: 'SIMULATED COMMENT: Sample feedback for the UI.',
      createdAt: '2026-10-10T08:04:00Z',
      label: 'SIMULATED',
    },
  ]);

  // Batches State
  const [batches, setBatches] = useState<EngagementBatch[]>([
    {
      id: 'batch_seed_001',
      postId: 'post_mizizi_dev_01',
      postTitle: 'Mizizi Social — Development Test Post',
      appName: 'Mizizi Social',
      adminName: 'Lead Admin (Local Dev)',
      timestamp: '2026-10-10T08:00:00Z',
      likes: 500,
      comments: 50,
      reshares: 100,
      totalRecords: 650,
      deliveryMode: 'instant',
      status: 'active',
      label: 'SIMULATED — DEVELOPMENT ONLY',
    },
  ]);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'audit_01',
      timestamp: '2026-10-10T08:00:00Z',
      admin: 'Lead Admin (Local Dev)',
      action: 'GENERATE_BATCH',
      postId: 'post_mizizi_dev_01',
      appName: 'Mizizi Social',
      details: 'Generated default seed: 500 likes, 50 comments, 100 reshares.',
      batchId: 'batch_seed_001',
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);

  // Active Post helper
  const activePost = posts.find((p) => p.id === selectedPostId) || posts[0];

  // Total simulated count across all posts
  const totalSimulatedCount = posts.reduce(
    (acc, p) => acc + p.simulatedLikes + p.simulatedComments + p.simulatedReshares,
    0
  );

  // Refresh data from real Express backend when in Live Mode
  const handleRefreshLivePosts = async () => {
    if (!isLiveMode) return;
    const res = await apiClient.getPosts();
    if (res.ok && res.data) {
      const mapped: DemoPost[] = res.data.map((p) => ({
        id: p.id,
        appName: p.appName || selectedApp,
        title: p.title,
        body: p.body,
        author: 'Backend Seeder',
        authorHandle: '@dev_seeder',
        createdAt: p.createdAt,
        genuineLikes: 0,
        genuineComments: 0,
        genuineReshares: 0,
        simulatedLikes: p.simulated?.likes || 0,
        simulatedComments: p.simulated?.comments || 0,
        simulatedReshares: p.simulated?.reshares || 0,
        batchesCount: 1,
      }));
      if (mapped.length > 0) {
        setPosts(mapped);
        setSelectedPostId(mapped[0].id);
      }
    }
  };

  // Generate engagement batch (handles both Live API and Local Simulation)
  const handleGenerateBatch = async (params: {
    postId: string;
    likes: number;
    comments: number;
    reshares: number;
    deliveryMode: 'instant' | '10s' | '30s' | '60s';
  }) => {
    setIsGenerating(true);

    if (isLiveMode) {
      // Execute REAL HTTP call to Express backend /api/engagement/generate
      const res = await apiClient.generateEngagement({
        postId: params.postId,
        likes: params.likes,
        comments: params.comments,
        reshares: params.reshares,
      });

      if (!res.ok) {
        alert(`Backend API Error: ${res.error}`);
        setIsGenerating(false);
        return;
      }

      const batchId = res.data?.batchId || `batch_${Date.now()}`;
      const targetPost = posts.find((p) => p.id === params.postId);
      const postTitle = targetPost ? targetPost.title : `Post (${params.postId})`;

      // Create new batch & audit record
      const newBatch: EngagementBatch = {
        id: batchId,
        postId: params.postId,
        postTitle,
        appName: selectedApp,
        adminName: 'Lead Admin (Live Server)',
        timestamp: new Date().toISOString(),
        likes: params.likes,
        comments: params.comments,
        reshares: params.reshares,
        totalRecords: params.likes + params.comments + params.reshares,
        deliveryMode: params.deliveryMode,
        status: 'active',
        label: 'SIMULATED — DEVELOPMENT ONLY',
      };

      const newAudit: AuditLog = {
        id: `audit_${Date.now()}`,
        timestamp: new Date().toISOString(),
        admin: 'Lead Admin (Live Server)',
        action: 'GENERATE_BATCH',
        postId: params.postId,
        appName: selectedApp,
        details: `Dispatched live HTTP request to ${serverUrl}/api/engagement/generate: +${params.likes} likes, +${params.comments} comments, +${params.reshares} reshares (HTTP 201 Created in ${res.latencyMs}ms).`,
        batchId,
      };

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === params.postId) {
            return {
              ...p,
              simulatedLikes: p.simulatedLikes + params.likes,
              simulatedComments: p.simulatedComments + params.comments,
              simulatedReshares: p.simulatedReshares + params.reshares,
              batchesCount: p.batchesCount + 1,
            };
          }
          return p;
        })
      );

      setBatches((prev) => [newBatch, ...prev]);
      setAuditLogs((prev) => [newAudit, ...prev]);
      setIsGenerating(false);
      setCurrentTab('posts');
      return;
    }

    // Local in-memory generation
    const batchId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const targetPost = posts.find((p) => p.id === params.postId);
    const postTitle = targetPost ? targetPost.title : `Custom Post (${params.postId})`;

    const newCommentsList: SimulatedCommentRecord[] = [];
    for (let i = 0; i < params.comments; i++) {
      const sampleText = COMMENT_SAMPLES[i % COMMENT_SAMPLES.length];
      newCommentsList.push({
        id: `comm_${Date.now()}_${i}`,
        batchId,
        postId: params.postId,
        appName: selectedApp,
        authorName: `Simulated User #${Math.floor(100 + Math.random() * 900)}`,
        content: sampleText,
        createdAt: new Date().toISOString(),
        label: 'SIMULATED',
      });
    }

    const newBatch: EngagementBatch = {
      id: batchId,
      postId: params.postId,
      postTitle,
      appName: selectedApp,
      adminName: 'Lead Admin (Local Dev)',
      timestamp: new Date().toISOString(),
      likes: params.likes,
      comments: params.comments,
      reshares: params.reshares,
      totalRecords: params.likes + params.comments + params.reshares,
      deliveryMode: params.deliveryMode,
      status: 'active',
      label: 'SIMULATED — DEVELOPMENT ONLY',
    };

    const newAudit: AuditLog = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      admin: 'Lead Admin (Local Dev)',
      action: 'GENERATE_BATCH',
      postId: params.postId,
      appName: selectedApp,
      details: `Generated in-memory test batch ${batchId}: +${params.likes} likes, +${params.comments} comments, +${params.reshares} reshares.`,
      batchId,
    };

    setTimeout(() => {
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === params.postId) {
            return {
              ...p,
              simulatedLikes: p.simulatedLikes + params.likes,
              simulatedComments: p.simulatedComments + params.comments,
              simulatedReshares: p.simulatedReshares + params.reshares,
              batchesCount: p.batchesCount + 1,
            };
          }
          return p;
        })
      );

      setComments((prev) => [...newCommentsList, ...prev]);
      setBatches((prev) => [newBatch, ...prev]);
      setAuditLogs((prev) => [newAudit, ...prev]);
      setIsGenerating(false);
      setCurrentTab('posts');
    }, 300);
  };

  // Delete batch (implements DELETE /api/engagement/batches/:batchId)
  const handleDeleteBatch = async (batchId: string) => {
    const batch = batches.find((b) => b.id === batchId);
    if (!batch) return;

    if (isLiveMode) {
      const res = await apiClient.deleteBatch(batchId);
      if (!res.ok) {
        alert(`Backend API Error: ${res.error}`);
        return;
      }
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === batch.postId) {
          return {
            ...p,
            simulatedLikes: Math.max(0, p.simulatedLikes - batch.likes),
            simulatedComments: Math.max(0, p.simulatedComments - batch.comments),
            simulatedReshares: Math.max(0, p.simulatedReshares - batch.reshares),
            batchesCount: Math.max(0, p.batchesCount - 1),
          };
        }
        return p;
      })
    );

    setComments((prev) => prev.filter((c) => c.batchId !== batchId));
    setBatches((prev) => prev.filter((b) => b.id !== batchId));

    const audit: AuditLog = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      admin: isLiveMode ? 'Lead Admin (Live Server)' : 'Lead Admin (Local Dev)',
      action: 'DELETE_BATCH',
      postId: batch.postId,
      appName: batch.appName,
      details: `Deleted batch ${batchId} (-${batch.likes} likes, -${batch.comments} comments, -${batch.reshares} reshares). Genuine engagement unaffected.`,
      batchId,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Clear simulated on a single post
  const handleClearPostSimulated = (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            simulatedLikes: 0,
            simulatedComments: 0,
            simulatedReshares: 0,
            batchesCount: 0,
          };
        }
        return p;
      })
    );

    setComments((prev) => prev.filter((c) => c.postId !== postId));
    setBatches((prev) => prev.filter((b) => b.postId !== postId));

    const audit: AuditLog = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      admin: isLiveMode ? 'Lead Admin (Live Server)' : 'Lead Admin (Local Dev)',
      action: 'DELETE_BATCH',
      postId,
      appName: post.appName,
      details: `Reset all simulated data on post "${post.title}". Genuine engagement retained intact.`,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Purge all simulated records across all posts
  const handlePurgeAll = () => {
    const confirmed = window.confirm(
      'Purge all simulated records across all applications? Genuine user engagement will remain 100% untouched.'
    );
    if (!confirmed) return;

    setPosts((prev) =>
      prev.map((p) => ({
        ...p,
        simulatedLikes: 0,
        simulatedComments: 0,
        simulatedReshares: 0,
        batchesCount: 0,
      }))
    );
    setComments([]);
    setBatches([]);

    const audit: AuditLog = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      admin: isLiveMode ? 'Lead Admin (Live Server)' : 'Lead Admin (Local Dev)',
      action: 'PURGE_ALL_SIMULATED',
      postId: 'ALL',
      appName: selectedApp,
      details: 'Purged all simulated engagement rows from database.',
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  // Create sample test post (implements POST /api/posts/sample)
  const handleCreateSamplePost = async () => {
    if (isLiveMode) {
      const res = await apiClient.createSamplePost();
      if (!res.ok) {
        alert(`Backend API Error: ${res.error}`);
        return;
      }
      const newPostData = res.post;
      if (newPostData) {
        const mappedPost: DemoPost = {
          id: newPostData.id,
          appName: newPostData.appName || selectedApp,
          title: newPostData.title,
          body: newPostData.body,
          author: 'Backend Seeder',
          authorHandle: '@dev_seeder',
          createdAt: newPostData.createdAt,
          genuineLikes: 0,
          genuineComments: 0,
          genuineReshares: 0,
          simulatedLikes: 0,
          simulatedComments: 0,
          simulatedReshares: 0,
          batchesCount: 0,
        };
        setPosts((prev) => [mappedPost, ...prev]);
        setSelectedPostId(mappedPost.id);
        return;
      }
    }

    const newId = `post_${selectedApp.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;
    const newPost: DemoPost = {
      id: newId,
      appName: selectedApp,
      title: `${selectedApp} — QA Test Post #${posts.length + 1}`,
      body: `Sample test post created on ${new Date().toLocaleTimeString()} for testing engagement pipelines in ${selectedApp}.`,
      author: 'QA Lead',
      authorHandle: '@qa_tester',
      createdAt: new Date().toISOString(),
      genuineLikes: 15,
      genuineComments: 3,
      genuineReshares: 2,
      simulatedLikes: 0,
      simulatedComments: 0,
      simulatedReshares: 0,
      batchesCount: 0,
    };

    setPosts((prev) => [newPost, ...prev]);
    setSelectedPostId(newId);

    const audit: AuditLog = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      admin: 'Lead Admin (Local Dev)',
      action: 'CREATE_SAMPLE_POST',
      postId: newId,
      appName: selectedApp,
      details: `Created new test post "${newPost.title}" (${newId}).`,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const handleAddCustomerApp = (newApp: CustomerApp) => {
    setRegisteredApps((prev) => [newApp, ...prev]);
    setSelectedApp(newApp.name);
    const audit: AuditLog = {
      id: `audit_${Date.now()}`,
      timestamp: new Date().toISOString(),
      admin: 'Lead Admin (Local Dev)',
      action: 'REGISTER_APP',
      postId: 'N/A',
      appName: newApp.name,
      details: `Registered customer application "${newApp.name}" (${newApp.clientOrg}) at ${newApp.apiBaseUrl}.`,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const handleDeleteCustomerApp = (appId: string) => {
    setRegisteredApps((prev) => prev.filter((a) => a.id !== appId));
  };

  const handleSelectCustomerApp = (app: CustomerApp) => {
    setSelectedApp(app.name);
    setCurrentTab('generator');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* Header */}
      <MiziziHeader
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedApp={selectedApp}
        setSelectedApp={setSelectedApp}
        registeredApps={registeredApps}
        adminToken={adminToken}
        setAdminToken={setAdminToken}
        onPurgeAll={handlePurgeAll}
        totalSimulatedCount={totalSimulatedCount}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Live Backend Connection Controller */}
        <LiveServerPanel
          isLiveMode={isLiveMode}
          setIsLiveMode={setIsLiveMode}
          serverUrl={serverUrl}
          setServerUrl={setServerUrl}
          adminToken={adminToken}
          setAdminToken={setAdminToken}
          apiClient={apiClient}
          onRefreshData={handleRefreshLivePosts}
        />

        {/* Tab 1: Engagement Generator Form */}
        {currentTab === 'generator' && (
          <EngagementGeneratorForm
            selectedApp={selectedApp}
            setSelectedApp={setSelectedApp}
            registeredApps={registeredApps}
            posts={posts}
            selectedPostId={selectedPostId}
            setSelectedPostId={setSelectedPostId}
            onCreateSamplePost={handleCreateSamplePost}
            onGenerate={handleGenerateBatch}
            isGenerating={isGenerating}
            activePost={activePost}
          />
        )}

        {/* Tab 2: Post Inspector & Data Separation Preview */}
        {currentTab === 'posts' && (
          <PostEngagementViewer
            post={activePost}
            comments={comments}
            onClearSimulatedForPost={handleClearPostSimulated}
          />
        )}

        {/* Tab 3: Batches & Audit Trail */}
        {currentTab === 'batches' && (
          <BatchesAndAudit
            batches={batches}
            auditLogs={auditLogs}
            onDeleteBatch={handleDeleteBatch}
            onClearAuditLogs={() => setAuditLogs([])}
          />
        )}

        {/* Tab 4: Multi-Tenant Customer App Registry */}
        {currentTab === 'registry' && (
          <CustomerAppRegistry
            apps={registeredApps}
            activeAppId={selectedApp}
            onSelectApp={handleSelectCustomerApp}
            onAddApp={handleAddCustomerApp}
            onDeleteApp={handleDeleteCustomerApp}
          />
        )}

        {/* Tab 5: Backend Express + Prisma Kit */}
        {currentTab === 'backend' && <BackendStarterModal />}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 text-xs text-zinc-500 font-mono text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Mizizi Engagement Generator · Real Backend API & In-Memory Modes</span>
          <span>Data Isolation: Separate SimulatedEngagement Database Table</span>
        </div>
      </footer>
    </div>
  );
}
