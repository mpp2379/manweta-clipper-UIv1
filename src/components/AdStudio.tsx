import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Zap,
  Play,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Layers,
  Flame,
  Clock,
  Target,
  Users,
  Film
} from 'lucide-react';
import { UserAccount } from '../types';

interface AdStudioProps {
  user: UserAccount;
  onOpenCheckout: () => void;
  onOpenAuth: () => void;
  onLaunchClipper: () => void;
  theme: 'dark' | 'light';
}

const SAMPLE_PRODUCTS = [
  {
    title: 'AuraWave Wireless Noise-Cancelling ANC Headphones',
    url: 'https://store.aurawave.io/products/anc-headphones-pro',
    category: 'Electronics',
    price: '$129'
  },
  {
    title: 'HydraFlow Thermal Titanium Smart Water Bottle',
    url: 'https://shop.hydraflow.co/bottle-titanium',
    category: 'Fitness & Lifestyle',
    price: '$48'
  },
  {
    title: 'GlowRevive Peptide Radiance Morning Face Serum',
    url: 'https://skincare.glowrevive.com/serum-v2',
    category: 'Beauty & Skincare',
    price: '$36'
  }
];

const CREATOR_PERSONAS = [
  { id: 'techie', name: 'Tech Reviewer', tone: 'Skeptical & Spec-heavy', desc: 'Focuses on battery, build, and price comparison' },
  { id: 'lifestyle', name: 'Everyday Creator', tone: 'Relatable & Casual', desc: 'Shows day-in-the-life routines and unboxing' },
  { id: 'expert', name: 'Product Specialist', tone: 'Authoritative & Clear', desc: 'Explains technical engineering benefits' }
];

export const AdStudio: React.FC<AdStudioProps> = ({
  user,
  onOpenCheckout,
  onOpenAuth,
  onLaunchClipper,
  theme
}) => {
  const [productUrl, setProductUrl] = useState(SAMPLE_PRODUCTS[0].url);
  const [productTitle, setProductTitle] = useState(SAMPLE_PRODUCTS[0].title);
  const [selectedPersona, setSelectedPersona] = useState('techie');
  const [platform, setPlatform] = useState<'tiktok' | 'meta' | 'youtube'>('tiktok');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeHookIndex, setActiveHookIndex] = useState(0);

  const [generatedAd, setGeneratedAd] = useState<{
    hooks: { type: string; hook: string; score: number }[];
    ugcScript: { section: string; script: string; visual: string }[];
    callToAction: string;
    offerBanner: string;
  } | null>({
    hooks: [
      {
        type: 'Skeptical Hook (High Retention)',
        hook: '"I was 100% convinced these $129 headphones were just marketing hype until I wore them on a 6-hour flight..."',
        score: 96
      },
      {
        type: 'Comparison Hook (Competitor Agitation)',
        hook: '"Stop paying $350 for designer logo headphones. Here is the sound test they do not want you to hear..."',
        score: 94
      },
      {
        type: 'Problem / Solution Hook',
        hook: '"If your ears hurt after 2 hours on Zoom calls, your headphone clamping force is completely wrong."',
        score: 91
      }
    ],
    ugcScript: [
      {
        section: '0:00 - 0:04 Hook',
        script: 'I tossed my $300 name-brand headphones in a drawer after testing these for 48 hours.',
        visual: 'Creator holding up both pairs, shaking head at the overpriced pair.'
      },
      {
        section: '0:05 - 0:15 Demo',
        script: 'The ANC chip cuts out 98% of coffee shop chatter, and the memory foam earcups do not pinch glasses.',
        visual: 'Snap-on test showing noise isolation wave animation.'
      },
      {
        section: '0:16 - 0:25 Value Prop',
        script: 'You get 55 hours of battery life on a single USB-C charge. That is literally a full month of gym workouts.',
        visual: 'Extreme macro zoom on the battery indicator and sleek matte finish.'
      },
      {
        section: '0:26 - 0:32 CTA',
        script: 'Tap the link below right now to grab the 30% launch discount before stock runs out.',
        visual: 'Finger tapping screen overlay with coupon code FLASH30 animation.'
      }
    ],
    callToAction: 'Tap Shop Now to get 30% OFF + Free 2-Day Shipping',
    offerBanner: 'LIMITED TIME: FLASH30 for 30% OFF'
  });

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productUrl.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setGeneratedAd({
        hooks: [
          {
            type: 'Direct Problem Hook',
            hook: `"If you have been looking for an upgrade to ${productTitle.slice(0, 35)}..., watch this before buying."`,
            score: 97
          },
          {
            type: 'Before / After Hook',
            hook: `"My daily routine completely transformed when I switched to this. Here is the unvarnished truth."`,
            score: 93
          },
          {
            type: 'Cost vs Value Hook',
            hook: `"Why pay 3x more when this exact model delivers the same performance with a lifetime guarantee?"`,
            score: 89
          }
        ],
        ugcScript: [
          {
            section: '0:00 - 0:03 Hook',
            script: `Do not buy ${productTitle.slice(0, 30)} until you see this test.`,
            visual: 'Quick unboxing clip with dramatic reveal lighting and caption overlays.'
          },
          {
            section: '0:04 - 0:14 In-Use Testing',
            script: 'Here are the top 3 things that blew me away during daily testing.',
            visual: 'Fast montage demonstrating key product durability and benefits.'
          },
          {
            section: '0:15 - 0:24 Social Proof',
            script: 'Over 12,000 verified 5-star customer reviews cannot be wrong.',
            visual: 'Review screenshot overlays popping on screen.'
          },
          {
            section: '0:25 - 0:30 Conversion CTA',
            script: 'Click the link right here to claim your exclusive discount while units remain.',
            visual: 'Animated sticker pointing down to shopping bag.'
          }
        ],
        callToAction: 'Shop today and get instant checkout savings',
        offerBanner: 'PROMO CODE: CREATOR20'
      });
    }, 1200);
  };

  return (
    <div id="manweta-ad-studio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#EDEDED]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#222222] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-[11px] font-semibold text-sky-300 uppercase tracking-wider mb-2">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>AI Product Advertisement Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            E-Commerce & UGC Video Ads
          </h1>
          <p className="text-xs text-[#888888] mt-1">
            Transform product URLs into high-converting TikTok and Meta video ads with viral hooks and UGC creator scripts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#262626] text-xs font-mono text-[#00FF85] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{user.creditsRemaining} credits remaining</span>
          </div>
          <button
            type="button"
            onClick={onLaunchClipper}
            className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Film className="w-3.5 h-3.5 text-black" />
            <span>Open Clip Studio</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Product Ingest & Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-5 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-400" />
              <span>Product Ingest</span>
            </h2>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#AAAAAA] mb-1.5">
                  Store / Product Link
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    placeholder="https://yourstore.com/products/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-sky-400"
                  />
                  <ExternalLink className="w-3.5 h-3.5 text-[#555555] absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#AAAAAA] mb-1.5">
                  Product Name / Title
                </label>
                <input
                  type="text"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  placeholder="e.g. Wireless Noise Cancelling Headphones"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Sample Product Presets */}
              <div>
                <span className="text-[11px] text-[#666666] block mb-1.5">Try Sample Store Items:</span>
                <div className="space-y-1.5">
                  {SAMPLE_PRODUCTS.map((prod, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setProductUrl(prod.url);
                        setProductTitle(prod.title);
                      }}
                      className="w-full p-2 rounded-xl bg-[#161616] hover:bg-[#202020] text-left border border-[#2A2A2A] transition-colors flex items-center justify-between text-[11px]"
                    >
                      <span className="text-white font-medium truncate max-w-[220px]">{prod.title}</span>
                      <span className="text-[#00FF85] font-mono">{prod.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Platform & UGC Creator Persona */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#AAAAAA] mb-1.5">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="tiktok">TikTok Ads (9:16)</option>
                    <option value="meta">Meta Reels / IG</option>
                    <option value="youtube">YouTube Shorts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#AAAAAA] mb-1.5">Persona</label>
                  <select
                    value={selectedPersona}
                    onChange={(e) => setSelectedPersona(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    {CREATOR_PERSONAS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-3.5 rounded-2xl bg-sky-400 hover:bg-sky-300 text-black font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Extracting Product Hooks...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate Viral UGC Ad Hooks</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Generated UGC Ad Package */}
        <div className="lg:col-span-7 space-y-6">
          {generatedAd ? (
            <div className="p-6 rounded-3xl bg-[#111111] border border-[#222222] space-y-6 shadow-xl">
              <div className="border-b border-[#222222] pb-4">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-sky-400" />
                  <span>3 Retention Hooks & Full UGC Script</span>
                </h3>
                <p className="text-xs text-[#777777] mt-0.5">
                  Optimized for organic e-commerce conversions & ROAS
                </p>
              </div>

              {/* Hook Selection Cards */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-[#888888] block">Select Winning Hook:</span>
                {generatedAd.hooks.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveHookIndex(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all space-y-1.5 ${
                      activeHookIndex === idx
                        ? 'bg-sky-500/10 border-sky-400 text-white shadow-md'
                        : 'bg-[#0A0A0A] border-[#222222] text-[#888888] hover:border-[#333333]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-sky-300">{item.type}</span>
                      <span className="font-mono text-[#00FF85] font-semibold">{item.score}% Virality</span>
                    </div>
                    <p className="text-xs font-medium text-white leading-snug">{item.hook}</p>
                  </button>
                ))}
              </div>

              {/* Full Video Ad Script Breakdown */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-semibold text-[#888888] block">UGC Shot List & Voiceover:</span>
                {generatedAd.ugcScript.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-[#222222] space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#00FF85]">
                      <span>{step.section}</span>
                      <span className="text-[#666666]">Take {idx + 1}</span>
                    </div>
                    <div className="text-white font-medium">"{step.script}"</div>
                    <div className="text-[11px] text-[#777777]">
                      <strong className="text-[#999999]">Visual Direction: </strong>
                      {step.visual}
                    </div>
                  </div>
                ))}
              </div>

              {/* Offer Banner Preview */}
              <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between text-xs">
                <span className="text-sky-300 font-semibold">{generatedAd.offerBanner}</span>
                <span className="font-mono text-[11px] text-white">Callout Sticker</span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#222222]">
                <button
                  type="button"
                  onClick={onLaunchClipper}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Film className="w-3.5 h-3.5 text-black" />
                  <span>Send to Clip Studio & Add Captions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={onOpenCheckout}
                  className="text-xs text-[#AAAAAA] hover:text-white transition-colors"
                >
                  Upgrade ad generation credits
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#111111] border border-[#222222] text-center space-y-4">
              <ShoppingBag className="w-10 h-10 text-[#555555] mx-auto" />
              <h3 className="text-base font-bold text-white">No Ad Generated Yet</h3>
              <p className="text-xs text-[#777777] max-w-sm mx-auto leading-relaxed">
                Paste your store or product link on the left to extract competitive hooks and generate a 30-second UGC ad script.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
