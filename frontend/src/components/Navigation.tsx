import React from 'react';
import {
  Sparkles,
  Layers,
  Film,
  Zap,
  CreditCard,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Accessibility,
  PlusCircle,
  Terminal,
  User,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Video,
  Grid
} from 'lucide-react';
import { UserAccount } from '../types';

interface NavigationProps {
  currentPage: 'home' | 'studios' | 'clipper' | 'pricing';
  setCurrentPage: (page: 'home' | 'studios' | 'clipper' | 'pricing') => void;
  currentTab: 'dashboard' | 'wizard' | 'reels' | 'pricing';
  setCurrentTab: (tab: 'dashboard' | 'wizard' | 'reels' | 'pricing') => void;
  user: UserAccount;
  isLoggedIn: boolean;
  isOfflineSimulated: boolean;
  setIsOfflineSimulated: (offline: boolean) => void;
  pendingSyncCount: number;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  onOpenA11y: () => void;
  onOpenBackendInspector: () => void;
  onOpenCheckout: () => void;
  onOpenAuth: () => void;
  onGoogleSignIn: () => void;
  onStartNewClip: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  setCurrentPage,
  currentTab,
  setCurrentTab,
  user,
  isLoggedIn,
  isOfflineSimulated,
  setIsOfflineSimulated,
  pendingSyncCount,
  theme,
  toggleTheme,
  onOpenA11y,
  onOpenBackendInspector,
  onOpenCheckout,
  onOpenAuth,
  onGoogleSignIn,
  onStartNewClip,
}) => {
  return (
    <>
      {/* Top Desktop & Tablet Navigation */}
      <header
        id="main-app-header"
        className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors border-b ${
          theme === 'dark'
            ? 'bg-[#0A0A0A]/90 border-[#222222] text-[#EDEDED]'
            : 'bg-white/95 border-neutral-200 text-neutral-900 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Studio Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => setCurrentPage(isLoggedIn ? 'studios' : 'home')}
              className="flex items-center gap-2.5 group text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40 rounded-lg p-1"
            >
              <div className="w-9 h-9 rounded-xl bg-[#141414] border border-[#262626] p-1 shadow-sm group-hover:border-[#444444] transition-all flex items-center justify-center">
                <Film className="w-4 h-4 text-[#00FF85] group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-white">
                    Manweta AI
                  </span>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#141414] text-[#00FF85] border border-[#222222]">
                    v2.0
                  </span>
                </div>
                <p className="text-[11px] text-[#666666] leading-tight hidden sm:block">
                  Next-Gen AI Creative Studios
                </p>
              </div>
            </button>

            {/* If inside Clip Studio, show quick return to Studios Hub */}
            {currentPage === 'clipper' && (
              <button
                type="button"
                id="back-to-studios-hub-btn"
                onClick={() => setCurrentPage('studios')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141414] hover:bg-[#1C1C1C] border border-[#262626] text-xs font-semibold text-[#AAAAAA] hover:text-white transition-all ml-2"
                title="Return to all Manweta AI Studios"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Studios</span>
              </button>
            )}
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#111111] p-1 rounded-full border border-[#222222]">
            <button
              id="nav-tab-home"
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                currentPage === 'home'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#888888] hover:text-[#EDEDED] hover:bg-[#1A1A1A]'
              }`}
            >
              Home
            </button>

            <button
              id="nav-tab-studios-hub"
              onClick={() => setCurrentPage('studios')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                currentPage === 'studios'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#888888] hover:text-[#EDEDED] hover:bg-[#1A1A1A]'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-[#00FF85]" />
              Studios Hub
            </button>

            <button
              id="nav-tab-clip-studio"
              onClick={() => {
                setCurrentPage('clipper');
                setCurrentTab('wizard');
              }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                currentPage === 'clipper'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#888888] hover:text-[#EDEDED] hover:bg-[#1A1A1A]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00FF85]" />
              Clip Studio
            </button>

            <button
              id="nav-tab-pricing"
              onClick={() => setCurrentPage('pricing')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                currentPage === 'pricing'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#888888] hover:text-[#EDEDED] hover:bg-[#1A1A1A]'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              Pricing
            </button>

            <button
              id="nav-tab-backend-logs"
              onClick={onOpenBackendInspector}
              className="px-3.5 py-1.5 text-xs font-medium text-[#888888] hover:text-[#EDEDED] hover:bg-[#1A1A1A] rounded-full transition-all flex items-center gap-1.5"
              title="Inspect backend architecture & pipeline"
            >
              <Terminal className="w-3.5 h-3.5 text-[#00FF85]" />
              <span className="hidden lg:inline">Backend</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Offline Simulation Toggle */}
            <button
              id="offline-simulator-btn"
              onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
                isOfflineSimulated
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse'
                  : 'bg-[#141414] text-[#00FF85] border-[#222222] hover:border-[#333333]'
              }`}
              title={
                isOfflineSimulated
                  ? 'Offline Simulation Active - Edits cached in IndexedDB'
                  : 'Connected to Cloud Queue - Click to simulate Offline Mode'
              }
              aria-label="Toggle network simulation"
            >
              {isOfflineSimulated ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-[#00FF85]" />
                  <span className="hidden sm:inline">Sync Online</span>
                </>
              )}
            </button>

            {/* Pending Sync Badge */}
            {pendingSyncCount > 0 && (
              <span
                id="pending-sync-badge"
                className="px-2 py-1 rounded-full text-[11px] font-mono bg-[#1A1A1A] text-amber-300 border border-amber-500/30 flex items-center gap-1"
                title={`${pendingSyncCount} action(s) waiting to sync`}
              >
                <RotateCcw className="w-3 h-3 animate-spin" />
                {pendingSyncCount}
              </span>
            )}

            {/* Credits Counter Pill */}
            <button
              id="user-credits-pill-btn"
              onClick={onOpenCheckout}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                theme === 'dark'
                  ? 'bg-[#111111] border-[#222222] text-[#EDEDED] hover:border-[#444444]'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:border-neutral-400'
              }`}
              title="Click to upgrade credits"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-semibold">{user.creditsRemaining}</span>
              <span className="text-[#666666] text-[11px] hidden sm:inline">min</span>
            </button>

            {/* Accessibility Settings Trigger */}
            <button
              id="a11y-settings-btn"
              onClick={onOpenA11y}
              className="p-2 rounded-xl text-[#888888] hover:text-[#EDEDED] hover:bg-[#1A1A1A] border border-transparent hover:border-[#222222] transition-all"
              title="Accessibility Settings (A11y)"
              aria-label="Accessibility options"
            >
              <Accessibility className="w-4 h-4" />
            </button>

            {/* Dark / Light Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#888888] hover:text-[#EDEDED] hover:bg-[#1A1A1A] border border-transparent hover:border-[#222222] transition-all"
              title="Toggle theme"
              aria-label="Toggle dark and light mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700" />
              )}
            </button>

            {/* If NOT logged in, show Google Auth Button */}
            {!isLoggedIn ? (
              <button
                type="button"
                id="header-google-signin-btn"
                onClick={onGoogleSignIn}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 shadow-sm transition-all"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.7 0 3 .6 4 1.5l3-3C17.2 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                <span>Google Sign In</span>
              </button>
            ) : (
              <button
                id="header-upgrade-btn"
                onClick={onOpenCheckout}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-neutral-200 shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade</span>
              </button>
            )}

            {/* User Avatar / Auth */}
            <button
              id="user-profile-avatar-btn"
              onClick={onOpenAuth}
              className="w-8 h-8 rounded-xl overflow-hidden border border-[#2A2A2A] hover:border-[#444444] transition-all flex items-center justify-center bg-[#141414]"
              title={user.email || 'Click to sign in'}
              aria-label="User profile"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-4 h-4 text-[#888888]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div
        id="mobile-bottom-nav"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg px-2 py-1.5 flex items-center justify-around ${
          theme === 'dark'
            ? 'bg-[#0A0A0A]/95 border-[#222222] text-[#888888]'
            : 'bg-white/95 border-neutral-200 text-neutral-800 shadow-lg'
        }`}
      >
        <button
          id="mobile-nav-home"
          onClick={() => setCurrentPage('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            currentPage === 'home' ? 'text-white font-bold' : 'text-[#888888]'
          }`}
        >
          <Film className="w-5 h-5 mb-0.5" />
          Home
        </button>

        <button
          id="mobile-nav-studios"
          onClick={() => setCurrentPage('studios')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            currentPage === 'studios' ? 'text-white font-bold' : 'text-[#888888]'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5 text-[#00FF85]" />
          Studios
        </button>

        <button
          id="mobile-nav-create"
          onClick={() => {
            onStartNewClip();
            setCurrentPage('clipper');
            setCurrentTab('wizard');
          }}
          className="flex flex-col items-center justify-center -mt-4"
        >
          <div className="w-11 h-11 rounded-full bg-white text-black p-0.5 shadow-lg flex items-center justify-center hover:scale-105 transition-transform">
            <PlusCircle className="w-6 h-6 text-black" />
          </div>
          <span className="text-[10px] font-bold text-white mt-0.5">Clip</span>
        </button>

        <button
          id="mobile-nav-pricing"
          onClick={() => setCurrentPage('pricing')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            currentPage === 'pricing' ? 'text-white font-bold' : 'text-[#888888]'
          }`}
        >
          <CreditCard className="w-5 h-5 mb-0.5" />
          Pricing
        </button>

        <button
          id="mobile-nav-logs"
          onClick={onOpenBackendInspector}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium text-[#888888]"
        >
          <Terminal className="w-5 h-5 mb-0.5 text-[#00FF85]" />
          Backend
        </button>
      </div>
    </>
  );
};
