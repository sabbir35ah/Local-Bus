/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Volume2, VolumeX, Mic, MicOff, Trophy, Sparkles, BookOpen } from 'lucide-react';
import { BusSkin } from '../game/rules.ts';
import { formatTaka } from '../game/rules.ts';

interface TitleScreenProps {
  onStart: () => void;
  onOpenGarage: () => void;
  onOpenHowToPlay: () => void;
  currentSkin: BusSkin;
  highScore: number;
  totalCash: number;
  sfxEnabled: boolean;
  voiceEnabled: boolean;
  onToggleSfx: () => void;
  onToggleVoice: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart,
  onOpenGarage,
  onOpenHowToPlay,
  currentSkin,
  highScore,
  totalCash,
  sfxEnabled,
  voiceEnabled,
  onToggleSfx,
  onToggleVoice,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-10 pointer-events-none z-20">
      {/* Top Bar: Stats & Settings */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        {/* High Score & Total Cash */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/40 px-3.5 py-1.5 rounded-lg shadow-md">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-medium text-slate-300">সেরা স্কোর:</span>
            <span className="text-sm font-bold text-amber-400 tabular-nums">
              {highScore.toLocaleString('en-US')}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/40 px-3.5 py-1.5 rounded-lg shadow-md">
            <span className="text-xs font-medium text-slate-300">জমানো ক্যাশ:</span>
            <span className="text-sm font-bold text-emerald-400 tabular-nums">
              {formatTaka(totalCash)}
            </span>
          </div>
        </div>

        {/* Audio Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSfx}
            className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
              sfxEnabled
                ? 'bg-slate-900/90 border-slate-700 text-emerald-400 hover:bg-slate-800'
                : 'bg-slate-900/90 border-red-500/50 text-red-400 hover:bg-slate-800'
            }`}
            title={sfxEnabled ? 'সাউন্ড বন্ধ করুন' : 'সাউন্ড চালু করুন'}
            aria-label="সাউন্ড টগল"
          >
            {sfxEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={onToggleVoice}
            className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
              voiceEnabled
                ? 'bg-slate-900/90 border-slate-700 text-sky-400 hover:bg-slate-800'
                : 'bg-slate-900/90 border-red-500/50 text-red-400 hover:bg-slate-800'
            }`}
            title={voiceEnabled ? 'বাংলা ভয়েস বন্ধ করুন' : 'বাংলা ভয়েস চালু করুন'}
            aria-label="বাংলা ভয়েস টগল"
          >
            {voiceEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Center Hero: Bespoke SVG Title Lockup */}
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto text-center pointer-events-auto my-auto bg-slate-950/90 border border-slate-700/80 p-6 sm:p-8 rounded-3xl shadow-2xl">
        {/* Custom Dhaka Bus SVG Emblem */}
        <div className="mb-2 drop-shadow-xl">
          <svg viewBox="0 0 320 80" className="w-72 sm:w-80 h-auto">
            {/* Bus Outline */}
            <rect x="20" y="24" width="280" height="42" rx="8" fill="#15803d" stroke="#facc15" strokeWidth="3" />
            {/* Roof Rack with Luggage */}
            <rect x="60" y="16" width="160" height="8" rx="2" fill="#334155" />
            <rect x="75" y="10" width="30" height="7" rx="1" fill="#dc2626" />
            <rect x="115" y="8" width="40" height="9" rx="1" fill="#2563eb" />
            <rect x="165" y="11" width="35" height="6" rx="1" fill="#eab308" />
            {/* Windows */}
            <rect x="35" y="32" width="40" height="18" rx="3" fill="#0f172a" />
            <rect x="85" y="32" width="45" height="18" rx="3" fill="#0f172a" />
            <rect x="140" y="32" width="45" height="18" rx="3" fill="#0f172a" />
            <rect x="195" y="32" width="45" height="18" rx="3" fill="#0f172a" />
            <rect x="250" y="32" width="35" height="18" rx="3" fill="#0f172a" />
            {/* Red & Yellow Stripe */}
            <rect x="20" y="52" width="280" height="5" fill="#dc2626" />
            <rect x="20" y="57" width="280" height="3" fill="#facc15" />
            {/* Wheels */}
            <circle cx="75" cy="66" r="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="235" cy="66" r="12" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="75" cy="66" r="5" fill="#f59e0b" />
            <circle cx="235" cy="66" r="5" fill="#f59e0b" />
            {/* Headlight beam */}
            <polygon points="280,38 315,26 315,64 280,56" fill="rgba(254, 240, 138, 0.25)" />
          </svg>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl font-black text-amber-400 tracking-tight drop-shadow-md">
          ঢাকার বাস বস
        </h1>

        <p className="text-base sm:text-lg font-bold text-emerald-400 mt-1 mb-2 tracking-wide">
          “জ্যাম আমার, রাস্তা সবার!”
        </p>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
          ঢাকার ব্যস্ত রাজপথে লোকাল বাস চালান, মোড়ে মোড়ে যাত্রী তুলুন, হর্ন দিয়ে জ্যাম ফুটান এবং হয়ে উঠুন রাজপথের আসল মহারাজ!
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            data-start="true"
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-bold text-xl rounded-xl shadow-lg shadow-emerald-900/40 border-2 border-emerald-300/40 transform active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span>গেম শুরু করুন (START)</span>
          </button>

          <button
            onClick={onOpenGarage}
            className="w-full sm:w-auto px-6 py-4 bg-slate-900/90 hover:bg-slate-800 text-amber-300 font-bold text-base rounded-xl border-2 border-amber-500/50 shadow-md transform active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>বাস গ্যারেজ ({currentSkin.name})</span>
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="w-full sm:w-auto p-4 bg-slate-900/90 hover:bg-slate-800 text-sky-300 font-bold text-base rounded-xl border border-sky-500/40 shadow-md transform active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            title="নিয়মাবলী"
            aria-label="নিয়মাবলী"
          >
            <BookOpen className="w-5 h-5" />
            <span className="sm:hidden">নিয়ম</span>
          </button>
        </div>

        {/* Active Bus Route Badge */}
        <div className="mt-4 inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/40 px-3.5 py-1 rounded-full text-xs text-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>রুট: {currentSkin.routeText}</span>
        </div>
      </div>

      {/* Flat Control Hints Footer */}
      <div className="text-center pointer-events-auto">
        <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide bg-slate-950/75 py-2 px-4 rounded-lg inline-block border border-slate-800">
          WASD বা তীর চিহ্ন দিয়ে ড্রাইভ · Space ব্রেক · H হর্ন বাজান · Esc পজ
        </p>
      </div>
    </div>
  );
};
