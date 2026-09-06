import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Check,
  Zap,
  ShieldCheck,
  CreditCard,
  Lock,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Clock,
  Star,
  Award
} from 'lucide-react';
import { PRICING_PLANS } from '../services/mockData';
import { StorageService } from '../services/storage';
import { UserAccount } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onSuccessUpgrade: (updatedUser: UserAccount) => void;
  theme: 'dark' | 'light';
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  user,
  onSuccessUpgrade,
  theme,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlanId, setSelectedPlanId] = useState<'starter' | 'pro' | 'agency'>('pro');
  const [step, setStep] = useState<'plans' | 'payment' | 'success'>('plans');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState(user.name || 'Alex Rivera');

  if (!isOpen) return null;

  const selectedPlan = PRICING_PLANS.find(p => p.id === selectedPlanId) || PRICING_PLANS[1];
  const basePrice = billingCycle === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;
  const finalPrice = discountPercent > 0 ? (basePrice * (1 - discountPercent / 100)).toFixed(2) : basePrice.toFixed(2);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'VIRAL50' || couponCode.toUpperCase() === 'MANWETA50') {
      setCouponApplied(true);
      setDiscountPercent(50);
    } else if (couponCode.toUpperCase() === 'CREATOR20') {
      setCouponApplied(true);
      setDiscountPercent(20);
    } else {
      alert('Invalid coupon code. Try code "VIRAL50" for 50% discount!');
    }
  };

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');

      // Grant credits
      StorageService.upgradePlan(selectedPlan.id, selectedPlan.minutesPerMonth);
      const updated = StorageService.getUser();
      onSuccessUpgrade(updated);

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {}
    }, 1200);
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in"
    >
      <div
        id="checkout-dialog-card"
        className={`relative w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          theme === 'dark'
            ? 'bg-[#0A0A0A] border-[#222222] text-[#EDEDED]'
            : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222222] flex items-center justify-between bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-[#161616] text-[#00FF85] border border-[#262626]">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-medium text-white flex items-center gap-2">
                Upgrade Manweta AI Plan
                <span className="text-[10px] font-mono font-medium uppercase px-2.5 py-0.5 rounded-full bg-[#161616] text-[#00FF85] border border-[#262626]">
                  Save 30% on Annual
                </span>
              </h3>
              <p className="text-xs text-[#888888]">
                Unlock 4K rendering, 10x viral highlighting, and priority GPU encoding queue.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#888888] hover:text-white hover:bg-[#181818] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: Select Plan */}
          {step === 'plans' && (
            <div className="space-y-6">
              {/* Billing Cycle Switcher */}
              <div className="flex items-center justify-center">
                <div className="flex items-center bg-[#111111] p-1 rounded-full border border-[#222222]">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-black shadow'
                        : 'text-[#888888] hover:text-white'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      billingCycle === 'yearly'
                        ? 'bg-white text-black shadow'
                        : 'text-[#888888] hover:text-white'
                    }`}
                  >
                    <span>Annual Billing</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.2 rounded-full bg-black text-[#00FF85]">
                      Save 30%
                    </span>
                  </button>
                </div>
              </div>

              {/* 3 Pricing Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRICING_PLANS.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

                  return (
                    <div
                      key={plan.id}
                      id={`plan-card-${plan.id}`}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-5 rounded-3xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#141414] border-white shadow-xl ring-1 ring-white/30'
                          : 'bg-[#111111] hover:bg-[#141414] border-[#222222]'
                      }`}
                    >
                      {plan.isPopular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white text-black shadow-md">
                          Most Popular
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-base font-medium text-white">{plan.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#181818] text-[#888888] border border-[#262626]">
                            {plan.resolution}
                          </span>
                        </div>

                        <div className="mb-4">
                          <span className="text-3xl font-light text-white font-mono">${price}</span>
                          <span className="text-xs text-[#888888]">/month</span>
                          {billingCycle === 'yearly' && (
                            <span className="text-[10px] text-[#00FF85] block font-medium">
                              Billed annually (${price * 12}/yr)
                            </span>
                          )}
                        </div>

                        <div className="space-y-2.5 pt-3 border-t border-[#222222] text-xs">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-[#CCCCCC]">
                              <Check className="w-3.5 h-3.5 text-[#00FF85] flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlanId(plan.id);
                          setStep('payment');
                        }}
                        className={`mt-6 w-full py-3 rounded-2xl font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-white hover:bg-neutral-200 text-black'
                            : 'bg-[#181818] hover:bg-[#252525] text-white border border-[#2A2A2A]'
                        }`}
                      >
                        <span>Select {plan.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-[#222222] flex flex-wrap items-center justify-around gap-4 text-xs text-[#888888]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00FF85]" />
                  14-Day 100% Money-Back Guarantee
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-white" />
                  256-Bit SSL Encrypted Checkout
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#00FF85]" />
                  Instant Video Credits Activation
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Checkout & Payment Form */}
          {step === 'payment' && (
            <form onSubmit={handleCompletePayment} className="space-y-6 max-w-xl mx-auto">
              <div className="p-5 rounded-3xl bg-[#111111] border border-[#222222] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#00FF85] uppercase tracking-wider">Selected Plan</span>
                  <h4 className="text-base font-medium text-white">{selectedPlan.name}</h4>
                  <span className="text-xs text-[#888888]">
                    {selectedPlan.minutesPerMonth} mins/month • {billingCycle === 'yearly' ? 'Annual Plan' : 'Monthly Plan'}
                  </span>
                </div>

                <div className="text-right font-mono">
                  <span className="text-2xl font-light text-white">${finalPrice}</span>
                  <span className="text-xs text-[#888888] block">
                    {discountPercent > 0 ? `${discountPercent}% off applied` : '/month'}
                  </span>
                </div>
              </div>

              {/* Coupon Code Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. VIRAL50)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-[#111111] border border-[#222222] text-xs font-mono uppercase text-white focus:outline-none focus:border-white"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2.5 rounded-2xl bg-[#181818] hover:bg-[#252525] text-xs font-semibold text-white border border-[#2A2A2A]"
                >
                  Apply Code
                </button>
              </div>

              {couponApplied && (
                <div className="p-3 rounded-2xl bg-[#141414] border border-[#00FF85]/30 text-[#00FF85] text-xs font-medium flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Coupon applied! 50% discount activated on this billing cycle.
                </div>
              )}

              {/* 1-Click Apple Pay / Fast Checkout */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsProcessing(true);
                    setTimeout(() => {
                      setIsProcessing(false);
                      setStep('success');
                      StorageService.upgradePlan(selectedPlan.id, selectedPlan.minutesPerMonth);
                      onSuccessUpgrade(StorageService.getUser());
                    }, 1000);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Pay with Pay / Google Pay (1-Click)</span>
                </button>

                <div className="text-center text-[#666666] text-[11px] font-medium uppercase tracking-wider my-2">
                  — or pay with credit card —
                </div>
              </div>

              {/* Credit Card Input Fields */}
              <div className="space-y-3 p-5 rounded-3xl bg-[#111111] border border-[#222222]">
                <div>
                  <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#222222] text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider block mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4242 •••• •••• 4242"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#222222] text-xs font-mono text-white focus:outline-none focus:border-white"
                    />
                    <CreditCard className="w-4 h-4 text-[#666666] absolute right-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider block mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#222222] text-xs font-mono text-white focus:outline-none focus:border-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider block mb-1">CVC / CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#222222] text-xs font-mono text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('plans')}
                  className="px-5 py-3 rounded-2xl bg-[#181818] hover:bg-[#252525] text-[#EDEDED] font-semibold text-xs border border-[#2A2A2A]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-black" />
                  {isProcessing ? 'Processing Secure Payment...' : `Complete Upgrade ($${finalPrice})`}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Confirmation */}
          {step === 'success' && (
            <div className="text-center py-8 space-y-4 max-w-md mx-auto animate-in zoom-in">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-[#141414] border border-[#00FF85]/30 flex items-center justify-center text-[#00FF85]">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-light text-white">Upgrade Successful!</h3>
              <p className="text-xs text-[#888888]">
                Your account has been upgraded to <strong className="text-white font-medium">{selectedPlan.name}</strong>. {selectedPlan.minutesPerMonth} minutes of priority 4K rendering credits have been added to your balance.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-8 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-semibold text-xs shadow-sm transition-all"
              >
                Return to Clipper Studio
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
