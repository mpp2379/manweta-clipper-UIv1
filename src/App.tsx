import React, { useState, useEffect } from 'react';
import { Sparkles, Layers } from 'lucide-react';
import {
  ClipperJob,
  UserAccount,
  PipelineStepNumber,
  WordTimestamp,
  HighlightSegment,
  StyleConfig,
  BackendLog
} from './types';
import { StorageService, AccessibilitySettings } from './services/storage';
import { AuthApi, JobsApi } from './services/api';
import { SAMPLE_VIDEOS, generateHighlightsForVideo, generateSampleWordsForRange } from './services/mockData';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { StudioHub } from './components/StudioHub';
import { ReelStudio } from './components/ReelStudio';
import { AdStudio } from './components/AdStudio';
import { OfflineSyncBanner } from './components/OfflineSyncBanner';
import { Dashboard } from './components/Dashboard';
import { WizardProgressBar } from './components/ClipperWizard/WizardProgressBar';
import { Step1Upload } from './components/ClipperWizard/Step1Upload';
import { Step2Transcribe } from './components/ClipperWizard/Step2Transcribe';
import { Step3Highlights } from './components/ClipperWizard/Step3Highlights';
import { Step4ClipSelector } from './components/ClipperWizard/Step4ClipSelector';
import { Step5StyleChoices } from './components/ClipperWizard/Step5StyleChoices';
import { Step6RenderQueue } from './components/ClipperWizard/Step6RenderQueue';
import { Step7DeliverReel } from './components/ClipperWizard/Step7DeliverReel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BackendInspectorModal } from './components/BackendInspectorModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { AccessibilityModal } from './components/AccessibilityModal';

export default function App() {
  // --- Global Navigation State ---
  // Initial page: 'home' (Landing Page) as requested
  const [currentPage, setCurrentPage] = useState<'home' | 'studios' | 'clipper' | 'reels' | 'ads' | 'pricing'>('home');
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'wizard' | 'reels' | 'pricing'>('wizard');

  // --- User & Account State ---
  const [user, setUser] = useState<UserAccount>(() => StorageService.getUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => StorageService.getIsLoggedIn());

  const handleSignOut = () => {
    StorageService.logout();
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  // --- Theme & A11y ---
  const [theme, setTheme] = useState<'dark' | 'light'>(() => StorageService.getTheme());
  const [a11ySettings, setA11ySettings] = useState<AccessibilitySettings>(() => StorageService.getA11ySettings());

  // --- Jobs & Offline Simulation ---
  const [jobs, setJobs] = useState<ClipperJob[]>(() => StorageService.getJobs());
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [pendingSyncQueue, setPendingSyncQueue] = useState<string[]>(() => StorageService.getPendingSyncQueue());

  // --- Real backend pipeline state (upload -> Whisper -> GPT highlights) ---
  const [isPipelineProcessing, setIsPipelineProcessing] = useState(false);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  // --- Active Job in Wizard ---
  const [activeJob, setActiveJob] = useState<ClipperJob>(() => jobs[0] || {
    id: 'job-init',
    title: SAMPLE_VIDEOS[0].title,
    sourceType: 'youtube',
    sourceUrl: SAMPLE_VIDEOS[0].videoUrl,
    fileSizeMb: 850,
    durationSeconds: SAMPLE_VIDEOS[0].durationSec,
    resolution: '1920x1080',
    fps: 60,
    thumbnailUrl: SAMPLE_VIDEOS[0].thumbnail,
    status: 'queued',
    currentStep: 1,
    progressPercent: 0,
    transcriptText: '',
    words: [],
    highlights: [],
    customClipRange: [142, 187],
    styleConfig: {
      captionStyle: 'hormozi',
      aspectRatio: '9:16',
      framing: 'smart_speaker',
      fontSize: 'lg',
      fontFamily: 'display',
      textColor: '#FFFFFF',
      highlightColor: '#FACC15',
      showEmojis: true,
      position: 'middle',
      musicTrack: 'lo-fi-beats',
      musicVolume: 18,
      showBrandLogo: true,
      brandName: '@manweta.ai',
      autoReOffsetTimestamps: true,
    },
    createdAt: new Date().toISOString(),
    syncState: 'synced',
    backendLogs: []
  });

  const [maxAccessibleStep, setMaxAccessibleStep] = useState<PipelineStepNumber>(activeJob.currentStep || 1);

  // --- Modals ---
  const [isBackendInspectorOpen, setIsBackendInspectorOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);

  // Apply Theme & A11y classes to root
  useEffect(() => {
    StorageService.setTheme(theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-[#0A0A0A]', 'text-[#EDEDED]');
      document.body.classList.remove('bg-neutral-100', 'text-neutral-900');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('bg-[#0A0A0A]', 'text-[#EDEDED]');
      document.body.classList.add('bg-neutral-100', 'text-neutral-900');
    }
  }, [theme]);

  // Handle Online/Offline Automatic Syncing
  useEffect(() => {
    if (!isOfflineSimulated && pendingSyncQueue.length > 0) {
      const timer = setTimeout(() => {
        const updatedJobs = jobs.map(j => {
          if (pendingSyncQueue.includes(j.id)) {
            return { ...j, syncState: 'synced' as const };
          }
          return j;
        });
        setJobs(updatedJobs);
        StorageService.saveJobs(updatedJobs);
        setPendingSyncQueue([]);
        localStorage.removeItem('manweta_sync_queue_v1');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOfflineSimulated, pendingSyncQueue, jobs]);

  // Sync active job back to storage
  const updateActiveJob = (updated: Partial<ClipperJob>) => {
    const newJob: ClipperJob = { ...activeJob, ...updated };
    setActiveJob(newJob);

    if (isOfflineSimulated) {
      newJob.syncState = 'pending_sync';
      StorageService.enqueueForSync(newJob.id);
      setPendingSyncQueue(prev => prev.includes(newJob.id) ? prev : [...prev, newJob.id]);
    }

    StorageService.saveOrUpdateJob(newJob);
    setJobs(prev => {
      const idx = prev.findIndex(j => j.id === newJob.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newJob;
        return copy;
      }
      return [newJob, ...prev];
    });
  };

  // Google Sign-In Handler — real OAuth redirect into the Flask backend.
  // Session cookies are set server-side; on return, the bootstrap effect
  // below (AuthApi.me()) hydrates `user`/`isLoggedIn` for real.
  const handleGoogleSignIn = () => {
    AuthApi.loginWithGoogle();
  };

  // On first load (including the redirect back from Google), check whether
  // we already have a valid session cookie and hydrate real user state.
  useEffect(() => {
    let cancelled = false;
    AuthApi.me().then((me) => {
      if (cancelled) return;
      const account = AuthApi.toUserAccount(me);
      if (account) {
        StorageService.saveUser(account);
        setUser(account);
        setIsLoggedIn(true);
        setCurrentPage((prev) => (prev === 'home' ? 'studios' : prev));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Start new video clip creation
  const handleStartNewClip = () => {
    const newJobId = 'job_' + Date.now().toString(36);
    const blankJob: ClipperJob = {
      id: newJobId,
      title: 'New Podcast Ingest',
      sourceType: 'sample',
      sourceUrl: SAMPLE_VIDEOS[0].videoUrl,
      sourceFileName: 'podcast_stream.mp4',
      fileSizeMb: 650,
      durationSeconds: SAMPLE_VIDEOS[0].durationSec,
      resolution: '1920x1080',
      fps: 60,
      thumbnailUrl: SAMPLE_VIDEOS[0].thumbnail,
      status: 'queued',
      currentStep: 1,
      progressPercent: 0,
      transcriptText: '',
      words: [],
      highlights: [],
      customClipRange: [142, 187],
      styleConfig: {
        captionStyle: 'hormozi',
        aspectRatio: '9:16',
        framing: 'smart_speaker',
        fontSize: 'lg',
        fontFamily: 'display',
        textColor: '#FFFFFF',
        highlightColor: '#FACC15',
        showEmojis: true,
        position: 'middle',
        musicTrack: 'lo-fi-beats',
        musicVolume: 18,
        showBrandLogo: true,
        brandName: '@manweta.ai',
        autoReOffsetTimestamps: true,
      },
      createdAt: new Date().toISOString(),
      syncState: isOfflineSimulated ? 'pending_sync' : 'synced',
      backendLogs: [
        {
          id: 'log_0',
          timestamp: new Date().toLocaleTimeString(),
          service: 'Queue',
          level: 'info',
          message: 'Initialized new clipper job in state queued'
        }
      ]
    };

    setActiveJob(blankJob);
    setMaxAccessibleStep(1);
    setCurrentPage('clipper');
    setCurrentTab('wizard');
    StorageService.saveOrUpdateJob(blankJob);
  };

  const handleOpenExistingJob = (job: ClipperJob) => {
    setActiveJob(job);
    setMaxAccessibleStep(job.currentStep || 1);
    setCurrentPage('clipper');
    setCurrentTab('wizard');
  };

  // --- Step 1 Handlers ---

  // Real path: an actual file was uploaded. We call the live backend
  // (OpenAI Whisper transcription + GPT highlight analysis via ffmpeg),
  // then poll until it's ready and jump straight into Step 2 with real data.
  const handleRealUpload = async (file: File, title: string) => {
    setIsPipelineProcessing(true);
    setPipelineError(null);
    try {
      const created = await JobsApi.create(file, title);
      updateActiveJob({
        id: created.id,
        title: created.title,
        sourceType: 'upload',
        sourceFileName: created.sourceFileName,
        fileSizeMb: created.fileSizeMb,
        status: 'transcribing',
        currentStep: 1,
        progressPercent: 10,
      });

      const finished = await JobsApi.pollUntil(
        created.id,
        (j) => j.status === 'awaiting_selection'
      );

      if (finished.status === 'failed') {
        throw new Error(finished.errorMessage || 'Processing failed on the server.');
      }

      const highlights = finished.highlights || [];
      let logs: BackendLog[] = [];
      try {
        logs = await JobsApi.logs(created.id);
      } catch {
        /* logs are cosmetic only */
      }

      updateActiveJob({
        ...finished,
        currentStep: 2,
        progressPercent: 40,
        selectedHighlightId: finished.selectedHighlightId || highlights[0]?.id,
        customClipRange: highlights[0]
          ? [highlights[0].startTime, highlights[0].endTime]
          : activeJob.customClipRange,
        backendLogs: logs.length ? logs : activeJob.backendLogs,
      });
      setMaxAccessibleStep(2);
    } catch (err) {
      setPipelineError(err instanceof Error ? err.message : 'Upload failed');
      updateActiveJob({ status: 'failed', errorMessage: String(err) });
    } finally {
      setIsPipelineProcessing(false);
    }
  };

  const handleVideoSelected = (source: {
    type: 'upload' | 'youtube' | 'sample';
    url: string;
    fileName?: string;
    fileSizeMb: number;
    durationSec: number;
    title: string;
    thumbnail: string;
    file?: File;
  }) => {
    // Real backend pipeline for actual uploaded files.
    if (source.type === 'upload' && source.file) {
      updateActiveJob({
        title: source.title,
        sourceType: 'upload',
        sourceFileName: source.fileName,
        fileSizeMb: source.fileSizeMb,
        thumbnailUrl: source.thumbnail,
      });
      void handleRealUpload(source.file, source.title);
      return;
    }

    // 'youtube' (URL import) and 'sample' sources are not wired to a real
    // ingestion pipeline yet (see README "Next steps" — needs a legally
    // reviewed yt-dlp download step). They still use demo data so the rest
    // of the wizard remains explorable end-to-end.
    const highlights = generateHighlightsForVideo(source.title, source.durationSec);
    const words = generateSampleWordsForRange(highlights[0]?.startTime || 142, highlights[0]?.endTime || 187);

    updateActiveJob({
      title: source.title,
      sourceType: source.type,
      sourceUrl: source.url,
      sourceFileName: source.fileName,
      fileSizeMb: source.fileSizeMb,
      durationSeconds: source.durationSec,
      thumbnailUrl: source.thumbnail,
      status: 'transcribing',
      currentStep: 2,
      progressPercent: 20,
      highlights,
      words,
      selectedHighlightId: highlights[0]?.id,
      customClipRange: [highlights[0]?.startTime || 142, highlights[0]?.endTime || 187],
      backendLogs: [
        ...(activeJob.backendLogs || []),
        {
          id: 'log_' + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          service: 'ffprobe',
          level: 'success',
          message: `Stream validated: 1080p H.264 AAC (${source.fileSizeMb}MB)`
        },
        {
          id: 'log_s3_' + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          service: 'S3',
          level: 'success',
          message: `Multipart payload stored to s3://manweta-raw-videos/${activeJob.id}.mp4`
        }
      ]
    });

    setMaxAccessibleStep(2);
  };

  // --- Step 2 Handlers ---
  const handleTranscriptionComplete = (words: WordTimestamp[], fullText: string) => {
    const highlights = (activeJob.highlights && activeJob.highlights.length > 0)
      ? activeJob.highlights
      : generateHighlightsForVideo(activeJob.title || 'Viral Podcast Clip', activeJob.durationSeconds || 180);

    const firstHl = highlights[0];
    const baseWords = (words && words.length > 0)
      ? words
      : generateSampleWordsForRange(firstHl?.startTime || 142, firstHl?.endTime || 187);

    const resolvedWords = baseWords.filter(w => w && typeof w.word === 'string');

    updateActiveJob({
      status: 'analyzing',
      currentStep: 3,
      progressPercent: 40,
      words: resolvedWords,
      highlights,
      selectedHighlightId: activeJob.selectedHighlightId || firstHl?.id || 'hl-1',
      customClipRange: activeJob.customClipRange || [firstHl?.startTime || 142, firstHl?.endTime || 187],
      transcriptText: fullText || resolvedWords.map(w => w?.word || '').join(' '),
      backendLogs: [
        ...(activeJob.backendLogs || []),
        {
          id: 'log_wh_' + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          service: 'Whisper',
          level: 'success',
          message: `Generated ${resolvedWords.length} word-level tokens with high acoustic confidence`
        }
      ]
    });
    setMaxAccessibleStep(3);
  };

  // --- Step 3 Handlers ---
  const handleSelectHighlight = (highlight: HighlightSegment) => {
    updateActiveJob({
      selectedHighlightId: highlight.id,
      customClipRange: [highlight.startTime, highlight.endTime],
      status: 'awaiting_selection',
      currentStep: 4,
      progressPercent: 60,
      backendLogs: [
        ...(activeJob.backendLogs || []),
        {
          id: 'log_llm_' + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          service: 'LLM_Analyzer',
          level: 'success',
          message: `Selected candidate #${highlight.id}: "${highlight.title}" (${highlight.score}% Hook probability)`
        }
      ]
    });
    setMaxAccessibleStep(4);
  };

  // --- Step 4 Handlers ---
  const handleConfirmRange = (range: [number, number], selectedHighlightId?: string) => {
    updateActiveJob({
      customClipRange: range,
      selectedHighlightId,
      currentStep: 5,
      progressPercent: 75,
      backendLogs: [
        ...(activeJob.backendLogs || []),
        {
          id: 'log_trim_' + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          service: 'Queue',
          level: 'info',
          message: `Stored In/Out boundaries: ${range[0]}s -> ${range[1]}s (duration: ${(range[1] - range[0]).toFixed(1)}s)`
        }
      ]
    });
    setMaxAccessibleStep(5);
  };

  // --- Step 5 Handlers ---
  // Real backend jobs get a UUID id from Postgres; demo/mock jobs use
  // client-generated ids like 'job_...' — this tells us which pipeline to use.
  const isRealBackendJob = (job: ClipperJob) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(job.id);

  const [isRenderProcessing, setIsRenderProcessing] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  const handleSaveStyles = async (styleConfig: StyleConfig) => {
    updateActiveJob({
      styleConfig,
      status: 'rendering',
      currentStep: 6,
      progressPercent: 85,
      backendLogs: [
        ...(activeJob.backendLogs || []),
        {
          id: 'log_style_' + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          service: 'Queue',
          level: 'info',
          message: `Attached render config: ${styleConfig.captionStyle} captions, ${styleConfig.aspectRatio}, music: ${styleConfig.musicTrack}`
        }
      ]
    });
    setMaxAccessibleStep(6);

    if (!isRealBackendJob(activeJob)) return; // demo/sample job: Step6's own animation drives completion

    setIsRenderProcessing(true);
    setRenderError(null);
    try {
      const range = (activeJob.customClipRange || [0, 30]) as [number, number];
      const selection = activeJob.selectedHighlightId
        ? { highlightId: activeJob.selectedHighlightId }
        : { customRange: range };

      await JobsApi.render(activeJob.id, selection, styleConfig);
      const finished = await JobsApi.pollUntil(activeJob.id, (j) => j.status === 'done', {
        timeoutMs: 15 * 60 * 1000,
      });

      if (finished.status === 'failed') {
        throw new Error(finished.errorMessage || 'Render failed on the server.');
      }
      updateActiveJob({ ...finished });
    } catch (err) {
      setRenderError(err instanceof Error ? err.message : 'Render failed');
      updateActiveJob({ status: 'failed', errorMessage: String(err) });
    } finally {
      setIsRenderProcessing(false);
    }
  };

  // --- Step 6 Handlers ---
  const handleRenderComplete = (renderedUrl: string) => {
    StorageService.deductCredits(1);
    setUser(StorageService.getUser());

    // For real backend jobs, activeJob.downloadUrl was already set by the
    // await in handleSaveStyles above — prefer that real, playable URL over
    // whatever placeholder Step6RenderQueue's cosmetic animation produced.
    const finalUrl = activeJob.downloadUrl || renderedUrl;

    updateActiveJob({
      renderedVideoUrl: finalUrl,
      downloadUrl: finalUrl,
      status: 'done',
      currentStep: 7,
      progressPercent: 100,
      completedAt: new Date().toISOString(),
      backendLogs: [
        ...(activeJob.backendLogs || []),
        {
          id: 'log_ff_' + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          service: 'FFmpeg',
          level: 'success',
          message: 'Video filtered to 9:16, burned re-offset ASS subtitles, encoded to H.264 MP4'
        },
        {
          id: 'log_deliv_' + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          service: 'S3',
          level: 'success',
          message: 'Delivered final reel to CDN & broadcasted WebSocket completion event'
        }
      ]
    });
    setMaxAccessibleStep(7);
  };

  return (
    <div
      id="manweta-ai-app-root"
      className={`min-h-screen flex flex-col transition-colors ${
        a11ySettings.highContrast ? 'contrast-125' : ''
      } ${a11ySettings.largeText ? 'text-base' : 'text-sm'}`}
    >
      {/* Top Header Navigation */}
      <Navigation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        isLoggedIn={isLoggedIn}
        isOfflineSimulated={isOfflineSimulated}
        setIsOfflineSimulated={setIsOfflineSimulated}
        pendingSyncCount={pendingSyncQueue.length}
        theme={theme}
        toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        onOpenA11y={() => setIsA11yOpen(true)}
        onOpenBackendInspector={() => setIsBackendInspectorOpen(true)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onGoogleSignIn={handleGoogleSignIn}
        onStartNewClip={handleStartNewClip}
        onSignOut={handleSignOut}
      />

      {/* Offline / Background Sync Banner */}
      <OfflineSyncBanner
        isOffline={isOfflineSimulated}
        pendingCount={pendingSyncQueue.length}
        onForceSync={() => {
          setIsOfflineSimulated(false);
        }}
        onToggleOffline={() => setIsOfflineSimulated(false)}
        theme={theme}
      />

      {/* PAGE ROUTER */}
      <main className="flex-1 w-full pb-24 md:pb-12">
        {/* PAGE 1: Landing Homepage */}
        {currentPage === 'home' && (
          <LandingPage
            onLoginClick={() => setIsAuthOpen(true)}
            onGoogleSignIn={handleGoogleSignIn}
            onEnterStudioHub={() => setCurrentPage('studios')}
            onLaunchClipStudio={() => {
              setCurrentPage('clipper');
              setCurrentTab('wizard');
            }}
            onNavigatePricing={() => setCurrentPage('pricing')}
            isLoggedIn={isLoggedIn}
            user={user}
            theme={theme}
          />
        )}

        {/* PAGE 2: Studios Hub (2nd Page Selector) */}
        {currentPage === 'studios' && (
          <StudioHub
            user={user}
            isLoggedIn={isLoggedIn}
            savedJobs={jobs}
            onLaunchClipStudio={() => {
              setCurrentPage('clipper');
              setCurrentTab('wizard');
            }}
            onSelectExistingJob={handleOpenExistingJob}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onGoHome={() => setCurrentPage('home')}
            theme={theme}
          />
        )}

        {/* PAGE: Reel Studio */}
        {currentPage === 'reels' && (
          <ReelStudio
            user={user}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLaunchClipper={() => {
              setCurrentPage('clipper');
              setCurrentTab('wizard');
            }}
            theme={theme}
          />
        )}

        {/* PAGE: Ad Studio */}
        {currentPage === 'ads' && (
          <AdStudio
            user={user}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onLaunchClipper={() => {
              setCurrentPage('clipper');
              setCurrentTab('wizard');
            }}
            theme={theme}
          />
        )}

        {/* PAGE 3: Clip Studio (Intact 7-Step Pipeline + Dashboard) */}
        {currentPage === 'clipper' && (
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Tab switch inside Clip Studio */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="tab-clip-wizard-btn"
                  onClick={() => setCurrentTab('wizard')}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentTab === 'wizard'
                      ? 'bg-white text-black shadow-md'
                      : 'bg-[#141414] text-[#888888] hover:text-white border border-[#222222]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>7-Step Clipper Pipeline</span>
                </button>
                <button
                  type="button"
                  id="tab-clip-dashboard-btn"
                  onClick={() => setCurrentTab('dashboard')}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    currentTab === 'dashboard'
                      ? 'bg-white text-black shadow-md'
                      : 'bg-[#141414] text-[#888888] hover:text-white border border-[#222222]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Project Dashboard</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleStartNewClip}
                className="px-4 py-2 rounded-2xl bg-[#161616] hover:bg-[#222222] border border-[#2E2E2E] text-white font-semibold text-xs transition-colors"
              >
                + New Ingest
              </button>
            </div>

            {currentTab === 'dashboard' && (
              <Dashboard
                jobs={jobs}
                user={user}
                onStartNewClip={handleStartNewClip}
                onOpenJob={handleOpenExistingJob}
                onOpenCheckout={() => setIsCheckoutOpen(true)}
                isOffline={isOfflineSimulated}
                theme={theme}
              />
            )}

            {currentTab === 'wizard' && (
              <ErrorBoundary
                fallbackTitle="Error in Wizard Step"
                onReset={() => updateActiveJob({ currentStep: 1 })}
              >
                <div id="clipper-wizard-workflow-wrapper" className="space-y-6">
                  <WizardProgressBar
                    currentStep={activeJob.currentStep}
                    jobStatus={activeJob.status}
                    maxAccessibleStep={maxAccessibleStep}
                    onStepClick={(step) => {
                      updateActiveJob({ currentStep: step });
                    }}
                    theme={theme}
                  />

                  {/* Step 1: Upload or link */}
                  {activeJob.currentStep === 1 && !isPipelineProcessing && (
                    <Step1Upload
                      onVideoSelected={handleVideoSelected}
                      theme={theme}
                      isOffline={isOfflineSimulated}
                    />
                  )}

                  {/* Real backend pipeline in flight: uploaded file is being
                      transcribed (OpenAI Whisper) and analyzed (GPT) on the
                      server. Step 2's own animation takes over once this
                      resolves and real words/highlights land on activeJob. */}
                  {activeJob.currentStep === 1 && isPipelineProcessing && (
                    <div className="flex flex-col items-center justify-center gap-4 py-24 rounded-3xl bg-[#111111] border border-[#222222] text-center">
                      <div className="w-10 h-10 rounded-full border-2 border-[#00FF85] border-t-transparent animate-spin" />
                      <div>
                        <p className="text-sm font-semibold text-white">Uploading & transcribing your video...</p>
                        <p className="text-xs text-[#888888] mt-1">
                          Running OpenAI Whisper + highlight analysis on the server. This can take a minute or two for longer videos.
                        </p>
                      </div>
                    </div>
                  )}

                  {pipelineError && activeJob.currentStep === 1 && !isPipelineProcessing && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      {pipelineError}
                    </div>
                  )}

                  {/* Step 2: Transcribe audio */}
                  {activeJob.currentStep === 2 && (
                    <Step2Transcribe
                      job={activeJob}
                      onTranscriptionComplete={handleTranscriptionComplete}
                      theme={theme}
                    />
                  )}

                  {/* Step 3: Detect highlights */}
                  {activeJob.currentStep === 3 && (
                    <Step3Highlights
                      job={activeJob}
                      onSelectHighlight={handleSelectHighlight}
                      theme={theme}
                    />
                  )}

                  {/* Step 4: User selects clip */}
                  {activeJob.currentStep === 4 && (
                    <Step4ClipSelector
                      job={activeJob}
                      onConfirmSelection={handleConfirmRange}
                      theme={theme}
                    />
                  )}

                  {/* Step 5: Style choices */}
                  {activeJob.currentStep === 5 && (
                    <Step5StyleChoices
                      job={activeJob}
                      onSaveStyles={handleSaveStyles}
                      theme={theme}
                    />
                  )}

                  {/* Step 6: Render the clip */}
                  {activeJob.currentStep === 6 && !isRenderProcessing && (
                    <Step6RenderQueue
                      job={activeJob}
                      onRenderComplete={handleRenderComplete}
                      theme={theme}
                    />
                  )}

                  {activeJob.currentStep === 6 && isRenderProcessing && (
                    <div className="flex flex-col items-center justify-center gap-4 py-24 rounded-3xl bg-[#111111] border border-[#222222] text-center">
                      <div className="w-10 h-10 rounded-full border-2 border-[#00FF85] border-t-transparent animate-spin" />
                      <div>
                        <p className="text-sm font-semibold text-white">Creating your viral reel in high definition...</p>
                        <p className="text-xs text-[#888888] mt-1">
                          Applying smart 9:16 crop, dynamic animated captions, and audio enhancement.
                        </p>
                      </div>
                    </div>
                  )}

                  {renderError && activeJob.currentStep === 6 && !isRenderProcessing && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                      {renderError}
                    </div>
                  )}

                  {/* Step 7: Deliver the reel */}
                  {activeJob.currentStep === 7 && (
                    <Step7DeliverReel
                      job={activeJob}
                      onClipAnother={() => {
                        updateActiveJob({ currentStep: 3, status: 'analyzing' });
                      }}
                      onStartNewVideo={handleStartNewClip}
                      onOpenCheckout={() => setIsCheckoutOpen(true)}
                      theme={theme}
                    />
                  )}
                </div>
              </ErrorBoundary>
            )}
          </div>
        )}

        {/* PAGE 4: Pricing */}
        {currentPage === 'pricing' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-[#00FF85]/10 text-[#00FF85] border border-[#00FF85]/30">
                Transparent High-Volume Pricing
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Scale Your Video & Ad Production with Manweta AI
              </h2>
              <p className="text-xs sm:text-sm text-[#888888]">
                Pick a plan tailored for creators, podcasts, and digital agencies. Includes 14-day money-back guarantee.
              </p>
            </div>

            <div className="pt-2 max-w-md mx-auto">
              <button
                id="open-full-checkout-btn"
                type="button"
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Open Interactive Upgrade & Checkout Modal</span>
              </button>
            </div>

            {/* Embedded Pricing Cards */}
            <Dashboard
              jobs={jobs}
              user={user}
              onStartNewClip={handleStartNewClip}
              onOpenJob={handleOpenExistingJob}
              onOpenCheckout={() => setIsCheckoutOpen(true)}
              isOffline={isOfflineSimulated}
              theme={theme}
            />
          </div>
        )}
      </main>

      {/* Interactive Modals */}
      <BackendInspectorModal
        isOpen={isBackendInspectorOpen}
        onClose={() => setIsBackendInspectorOpen(false)}
        currentJob={activeJob}
        theme={theme}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        user={user}
        onSuccessUpgrade={(updated) => setUser(updated)}
        theme={theme}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onAuthSuccess={(updated) => {
          setUser(updated);
          StorageService.setIsLoggedIn(true);
          setIsLoggedIn(true);
          setCurrentPage('studios');
        }}
        theme={theme}
      />

      <AccessibilityModal
        isOpen={isA11yOpen}
        onClose={() => setIsA11yOpen(false)}
        settings={a11ySettings}
        onUpdateSettings={(newSettings) => {
          setA11ySettings(newSettings);
          StorageService.saveA11ySettings(newSettings);
        }}
        theme={theme}
      />
    </div>
  );
}
