/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Pause, Volume2, VolumeX, Mic, MicOff, Users, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react';
import { GameStats, PlayerControls } from '../game/GameEngine.ts';
import { DialogueItem } from '../game/dialogues.ts';
import { formatTaka } from '../game/rules.ts';

interface HUDProps {
  stats: GameStats;
  currentDialogue: DialogueItem | null;
  nearMissBonus: number | null;
  onPause: () => void;
  onHonk: () => void;
  sfxEnabled: boolean;
  voiceEnabled: boolean;
  onToggleSfx: () => void;
  onToggleVoice: () => void;
  controls: PlayerControls;
  onControlChange: (control: keyof PlayerControls, active: boolean) => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  currentDialogue,
  nearMissBonus,
  onPause,
  onHonk,
  sfxEnabled,
  voiceEnabled,
  onToggleSfx,
  onToggleVoice,
  onControlChange,
}) => {
  const speedInt = Math.round(stats.speed);
  const distanceKm = (stats.distance / 1000).toFixed(1);
  const isNearStop = stats.distanceToStop < 45 && stats.distanceToStop > 0;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-3 sm:p-5">
      {/* Top HUD: Responsive 2-Cluster Bar + Centered Stop Badge */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          {/* Top-Left: Speed & Distance Cluster */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-lg pointer-events-auto">
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">গতি</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
                  {speedInt}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-amber-400">কিমি/ঘ</span>
              </div>
            </div>

            <div className="h-6 sm:h-8 w-[1px] bg-slate-700 mx-0.5 sm:mx-1"></div>

            <div className="flex flex-col">
              <span className="text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">দূরত্ব</span>
              <div className="flex items-baseline gap-1">
                <span className="text-base sm:text-xl font-bold text-sky-300 tabular-nums">
                  {distanceKm}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-slate-300">কিমি</span>
              </div>
            </div>
          </div>

          {/* Top-Right: Cash, Passengers, Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
            {/* Cash */}
            <div className="bg-slate-900/90 border border-emerald-500/50 px-2 sm:px-3 py-1 rounded-lg sm:rounded-xl shadow-md flex items-center gap-1">
              <span className="text-[10px] sm:text-xs text-emerald-400 font-bold">ভাড়া</span>
              <span className="text-xs sm:text-base font-bold text-emerald-300 tabular-nums">
                {formatTaka(stats.cash)}
              </span>
            </div>

            {/* Passengers */}
            <div className="bg-slate-900/90 border border-sky-500/50 px-1.5 sm:px-2.5 py-1 rounded-lg sm:rounded-xl shadow-md flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-xs sm:text-base font-bold text-sky-300 tabular-nums">
                {stats.passengers}
              </span>
            </div>

            {/* Sound & Pause Controls */}
            <button
              onClick={onToggleSfx}
              className="p-1.5 sm:p-2 bg-slate-900/90 border border-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer"
              title="সাউন্ড টগল"
              aria-label="সাউন্ড টগল"
            >
              {sfxEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />}
            </button>

            <button
              onClick={onToggleVoice}
              className="p-1.5 sm:p-2 bg-slate-900/90 border border-slate-700 rounded-lg text-slate-300 hover:text-white cursor-pointer"
              title="ভয়েস টগল"
              aria-label="ভয়েস টগল"
            >
              {voiceEnabled ? <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" /> : <MicOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />}
            </button>

            <button
              onClick={onPause}
              className="p-1.5 sm:p-2 bg-slate-900/90 border border-amber-500/60 rounded-lg text-amber-400 hover:bg-slate-800 cursor-pointer shadow"
              title="পজ (Esc / P)"
              aria-label="পজ করুন"
            >
              <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Sub-Bar Center: Next Stop Notice / Near Miss */}
        <div className="flex flex-col items-center mx-auto pointer-events-auto">
          {nearMissBonus !== null && (
            <div className="animate-bounce bg-amber-500 text-slate-950 px-3 py-0.5 sm:py-1 rounded-full font-bold text-xs shadow-lg border border-amber-300 mb-1 flex items-center gap-1">
              <span>🔥 কাছাকাছি ওভারটেক! +৳{nearMissBonus}</span>
            </div>
          )}

          <div
            className={`px-3 py-1 rounded-lg border text-xs sm:text-sm font-semibold shadow-md flex items-center gap-1.5 sm:gap-2 transition-colors ${
              isNearStop
                ? 'bg-amber-950/90 border-amber-500 text-amber-300 animate-pulse'
                : 'bg-slate-900/90 border-slate-700 text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span>পরবর্তী স্টপ: </span>
            <span className="font-bold text-amber-400">{stats.nextStopName}</span>
            <span className="text-[10px] sm:text-xs text-slate-400 tabular-nums">
              ({Math.round(stats.distanceToStop)} মি.)
            </span>
          </div>

          {isNearStop && (
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-400 mt-1 bg-black/60 px-2 py-0.5 rounded">
              গতি কমিয়ে ২০ এর নিচে আনুন ও যাত্রী তুলুন!
            </span>
          )}
        </div>
      </div>

      {/* Middle-Right: Bus Damage Gauge (Compact on mobile) */}
      <div className="self-end my-auto pointer-events-auto bg-slate-900/90 border border-slate-700/80 p-2 sm:p-2.5 rounded-xl shadow-lg flex flex-col items-center gap-1">
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-slate-300">
          <AlertTriangle className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${stats.damage > 60 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
          <span className="hidden sm:inline">বাসের অবস্থা</span>
          <span className="sm:hidden">ক্ষতি</span>
        </div>

        {/* Vertical Damage Bar */}
        <div className="w-3 sm:w-4 h-16 sm:h-28 bg-slate-950 rounded-full border border-slate-700 overflow-hidden flex flex-col justify-end p-0.5">
          <div
            className={`w-full rounded-full transition-all duration-300 ${
              stats.damage > 70
                ? 'bg-red-500'
                : stats.damage > 40
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ height: `${Math.max(5, stats.damage)}%` }}
          />
        </div>

        <span className="text-[10px] sm:text-xs font-bold text-white tabular-nums">
          {Math.round(stats.damage)}%
        </span>
      </div>

      {/* Bottom Area: Comic Dialogue Balloon & Mobile Controls */}
      <div className="w-full flex flex-col items-center gap-3">
        {/* Floating Comic Speech Bubble */}
        {currentDialogue && (
          <div className="pointer-events-auto max-w-lg bg-amber-100 text-slate-900 border-2 border-amber-500 px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
              {currentDialogue.speaker.startsWith('হেলপার') ? 'হে' : currentDialogue.speaker.startsWith('ড্রাইভার') ? 'ড্রা' : 'যা'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-amber-900 uppercase">
                {currentDialogue.speaker}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                “{currentDialogue.text}”
              </span>
            </div>
          </div>
        )}

        {/* Mobile / Screen Touch Controls Bar */}
        <div className="w-full flex items-center justify-between pointer-events-auto pt-2 pb-1">
          {/* Left / Right Steering Buttons */}
          <div className="flex items-center gap-3">
            <button
              onPointerDown={() => onControlChange('left', true)}
              onPointerUp={() => onControlChange('left', false)}
              onPointerLeave={() => onControlChange('left', false)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/90 active:bg-sky-600 text-white font-bold border-2 border-sky-500/60 shadow-lg flex items-center justify-center cursor-pointer select-none"
              aria-label="বামে যান"
            >
              <ArrowLeft className="w-7 h-7 text-sky-300" />
            </button>

            <button
              onPointerDown={() => onControlChange('right', true)}
              onPointerUp={() => onControlChange('right', false)}
              onPointerLeave={() => onControlChange('right', false)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/90 active:bg-sky-600 text-white font-bold border-2 border-sky-500/60 shadow-lg flex items-center justify-center cursor-pointer select-none"
              aria-label="ডানে যান"
            >
              <ArrowRight className="w-7 h-7 text-sky-300" />
            </button>
          </div>

          {/* Center: Legendary Horn Button */}
          <button
            onClick={onHonk}
            className="px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 active:scale-95 text-white font-extrabold text-sm sm:text-base border-2 border-amber-300 shadow-xl shadow-red-950/50 flex items-center gap-2 cursor-pointer select-none"
            aria-label="হর্ন বাজান"
          >
            <span className="text-xl">📢</span>
            <div className="flex flex-col text-left leading-none">
              <span>হর্ন (H)</span>
              <span className="text-[10px] text-amber-200">রাস্তা ক্লিয়ার!</span>
            </div>
          </button>

          {/* Right: Brake & Gas Pedals */}
          <div className="flex items-center gap-3">
            <button
              onPointerDown={() => onControlChange('brake', true)}
              onPointerUp={() => onControlChange('brake', false)}
              onPointerLeave={() => onControlChange('brake', false)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900/90 active:bg-red-700 text-red-400 font-bold border-2 border-red-500/60 shadow-lg flex flex-col items-center justify-center cursor-pointer select-none leading-none"
              aria-label="ব্রেক"
            >
              <span className="text-xs font-bold uppercase">ব্রেক</span>
              <span className="text-[10px] text-slate-400">(S)</span>
            </button>

            <button
              onPointerDown={() => onControlChange('gas', true)}
              onPointerUp={() => onControlChange('gas', false)}
              onPointerLeave={() => onControlChange('gas', false)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-600 active:bg-emerald-500 text-white font-bold border-2 border-emerald-300 shadow-lg flex flex-col items-center justify-center cursor-pointer select-none leading-none"
              aria-label="এক্সিলারেটর / গ্যাস"
            >
              <span className="text-xs font-bold uppercase">গ্যাস</span>
              <span className="text-[10px] text-emerald-200">(W)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
