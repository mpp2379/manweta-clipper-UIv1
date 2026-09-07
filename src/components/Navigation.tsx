import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Film,
  Zap,
  CreditCard,
  User,
  ArrowLeft,
  Video,
  Grid,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import { UserAccount } from '../types';

interface NavigationProps {
  currentPage: 'home' | 'studios' | 'clipper' | 'reels' | 'ads' | 'pricing';
  setCurrentPage: (page: 'home' | 'studios' | 'clipper' | 'reels' | 'ads' | 'pricing') => void;
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
  onSignOut?: () => void;
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
  onSignOut
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
              id="nav-tab-reel-studio"
              onClick={() => setCurrentPage('reels')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                currentPage === 'reels'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#888888] hover:text-[#EDEDED] hover:bg-[#1A1A1A]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-amber-400" />
              Reel Studio
            </button>

            <button
              id="nav-tab-ad-studio"
              onClick={() => setCurrentPage('ads')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                currentPage === 'ads'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-[#888888] hover:text-[#EDEDED] hover:bg-[#1A1A1A]'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-sky-400" />
              Ad Studio
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
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* If NOT logged in: Show ONLY Sign In button, NO profile pic or credits */}
            {!isLoggedIn ? (
              <button
                type="button"
                id="header-signin-btn"
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 shadow-sm transition-all"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Credits Counter Pill - only shown when logged in */}
                <button
                  id="user-credits-pill-btn"
                  onClick={onOpenCheckout}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                    theme === 'dark'
                      ? 'bg-[#111111] border-[#222222] text-[#EDEDED] hover:border-[#444444]'
                      : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:border-neutral-400'
                  }`}
                  title="Click to get more credits"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold">{user.creditsRemaining}</span>
                  <span className="text-[#666666] text-[11px] hidden sm:inline">credits</span>
                </button>

                <button
                  id="header-upgrade-btn"
                  onClick={onOpenCheckout}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-neutral-200 shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade</span>
                </button>

                {/* User Avatar with interactive dropdown - ONLY shown when logged in */}
                <div className="relative">
                  <button
                    type="button"
                    id="user-profile-avatar-btn"
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="w-8 h-8 rounded-xl overflow-hidden border border-[#2A2A2A] hover:border-[#444444] transition-all flex items-center justify-center bg-[#141414]"
                    title={user.email || user.name}
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
                      <span className="font-bold text-xs text-white">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    )}
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div
                      id="profile-dropdown-menu"
                      className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#262626] bg-[#111111] shadow-2xl p-3 z-50 animate-in fade-in"
                    >
                      <div className="flex items-center gap-2.5 pb-3 border-b border-[#222222]">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-[#1A1A1A] flex-shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">{user.name}</p>
                          <p className="text-[11px] text-[#777777] truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="py-2.5 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[#888888] px-1">
                          <span>Plan</span>
                          <span className="font-bold text-[#00FF85] uppercase text-[10px] bg-[#00FF85]/10 px-2 py-0.5 rounded-full border border-[#00FF85]/20">
                            {user.plan}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#888888] px-1">
                          <span>Credits</span>
                          <span className="font-mono text-white font-semibold">{user.creditsRemaining} credits</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#222222] space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onOpenCheckout();
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-white hover:bg-[#1A1A1A] flex items-center gap-2 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Get More Credits</span>
                        </button>
                        <button
                          type="button"
                          id="nav-logout-btn"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            if (onSignOut) {
                              onSignOut();
                            }
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
          id="mobile-nav-reels"
          onClick={() => setCurrentPage('reels')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            currentPage === 'reels' ? 'text-white font-bold' : 'text-[#888888]'
          }`}
        >
          <Video className="w-5 h-5 mb-0.5 text-amber-400" />
          Reels
        </button>

        <button
          id="mobile-nav-ads"
          onClick={() => setCurrentPage('ads')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
            currentPage === 'ads' ? 'text-white font-bold' : 'text-[#888888]'
          }`}
        >
          <ShoppingBag className="w-5 h-5 mb-0.5 text-sky-400" />
          Ads
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
      </div>
    </>
  );
};
