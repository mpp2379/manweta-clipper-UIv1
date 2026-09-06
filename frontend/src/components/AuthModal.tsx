import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  UserCheck,
  CheckCircle2,
  Key,
  Loader2
} from 'lucide-react';
import { UserAccount } from '../types';
import { StorageService } from '../services/storage';
import { AuthApi } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onAuthSuccess: (user: UserAccount) => void;
  theme: 'dark' | 'light';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onAuthSuccess,
  theme,
}) => {
  const [email, setEmail] = useState('');
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    // Real OAuth: full-page redirect into the Flask backend's /auth/google
    // route, which redirects to Google, then back to /auth/google/callback,
    // which sets httpOnly session cookies and redirects to FRONTEND_URL.
    // App.tsx re-checks the session (AuthApi.me()) on load and calls
    // onAuthSuccess once the cookie-based session is confirmed.
    setIsGoogleSigningIn(true);
    AuthApi.loginWithGoogle();
  };

  const handleGuestDemo = () => {
    const guestUser: UserAccount = {
      id: 'guest_' + Date.now(),
      name: 'Guest Creator',
      email: 'guest.creator@manweta.ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plan: 'free',
      creditsRemaining: 60,
      creditsTotal: 60,
      isGuest: true,
      joinedDate: 'August 2026'
    };
    StorageService.saveUser(guestUser);
    onAuthSuccess(guestUser);
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setIsMagicLinkSent(true);
      const updatedUser: UserAccount = {
        ...user,
        email: email || user.email,
        name: email ? email.split('@')[0] : user.name,
        isGuest: false
      };
      StorageService.saveUser(updatedUser);
      onAuthSuccess(updatedUser);
      setTimeout(() => {
        onClose();
      }, 600);
    }, 800);
  };

  return (
    <div
      id="auth-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
    >
      <div
        id="auth-dialog"
        className="relative w-full max-w-md rounded-3xl border border-[#262626] p-6 sm:p-8 shadow-2xl overflow-hidden bg-[#111111] text-[#EDEDED]"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#777777] hover:text-white hover:bg-[#1A1A1A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#161616] border border-[#262626] flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-[#00FF85]" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Sign In to Manweta AI
          </h3>
          <p className="text-xs text-[#888888]">
            Access all 4 creative studios, cloud render queue, and customized caption presets.
          </p>
        </div>

        <div className="space-y-3">
          {/* Google Sign In Primary */}
          <button
            type="button"
            id="google-auth-trigger-btn"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSigningIn}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2.5 hover:scale-[1.01]"
          >
            {isGoogleSigningIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Authenticating with Google...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Instant Guest Demo Option */}
          <button
            type="button"
            onClick={handleGuestDemo}
            className="w-full py-3 px-4 rounded-2xl bg-[#161616] hover:bg-[#202020] border border-[#2A2A2A] text-[#EDEDED] font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-[#00FF85]" />
            <span>1-Click Instant Guest Demo (No Password)</span>
          </button>

          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#222222]" />
            </div>
            <span className="relative bg-[#111111] px-2 text-[10px] font-bold text-[#666666] uppercase">
              Or email magic sign-in
            </span>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-[#AAAAAA] block mb-1">Work Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-[#00FF85]"
                />
                <Mail className="w-4 h-4 text-[#666666] absolute right-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#252525] border border-[#2E2E2E] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-[#00FF85]" />
              {isLoggingIn ? 'Sending Secure Token...' : 'Send Magic Sign-In Link'}
            </button>
          </form>

          {isMagicLinkSent && (
            <div className="p-3 rounded-xl bg-[#00FF85]/10 border border-[#00FF85]/30 text-[#00FF85] text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Signed in successfully! Transitioning to Studio Hub...</span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#222222] flex items-center justify-center gap-2 text-[11px] text-[#666666]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00FF85]" />
          <span>SOC2 Type II & GDPR Compliant Data Encryption</span>
        </div>
      </div>
    </div>
  );
};
