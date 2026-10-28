/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Trophy, Users, AlertOctagon, Sparkles } from 'lucide-react';
import { GameStats } from '../game/GameEngine.ts';
import { formatTaka } from '../game/rules.ts';

interface GameOverModalProps {
  stats: GameStats;
  reason: string;
  isNewHighScore: boolean;
  highScore: number;
  onRestart: () => void;
  onHome: () => void;
  onOpenGarage: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  reason,
  isNewHighScore,
  highScore,
  onRestart,
  onHome,
  onOpenGarage,
}) => {
  useEffect(() => {
    if (isNewHighScore) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isNewHighScore]);

  const distanceKm = (stats.distance / 1000).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-red-500/70 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Top Header Badge */}
        <div className="w-14 h-14 rounded-full bg-red-950 border-2 border-red-500 flex items-center justify-center mb-3 shadow-lg">
          <AlertOctagon className="w-8 h-8 text-red-400" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
          বাস সার্ভিস সমাপ্ত!
        </h2>

        {/* Humorous Bangla reason */}
        <p className="text-sm font-semibold text-amber-300 mb-4 bg-slate-950/70 px-4 py-2 rounded-xl border border-slate-800">
          “{reason}”
        </p>

        {isNewHighScore && (
          <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 px-4 py-1.5 rounded-full font-black text-sm mb-4 shadow-md animate-bounce">
            <Sparkles className="w-4 h-4" />
            <span>নতুন সর্বকালের সেরা রেকর্ড!</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-2.5 mb-6 text-left">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>মোট স্কোর</span>
            </div>
            <span className="text-xl font-black text-amber-400 tabular-nums">
              {stats.score.toLocaleString('en-US')}
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <span className="text-emerald-400 font-bold">৳</span>
              <span>উপার্জিত ভাড়া</span>
            </div>
            <span className="text-xl font-black text-emerald-400 tabular-nums">
              {formatTaka(stats.cash)}
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>যাত্রী পরিবহন</span>
            </div>
            <span className="text-xl font-black text-sky-400 tabular-nums">
              {stats.passengers} জন
            </span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <span className="text-purple-400 font-bold">🛣️</span>
              <span>অতিক্রান্ত দূরত্ব</span>
            </div>
            <span className="text-xl font-black text-purple-300 tabular-nums">
              {distanceKm} কিমি
            </span>
          </div>
        </div>

        {/* Best Score Banner */}
        <div className="w-full bg-slate-950 px-4 py-2 rounded-lg border border-slate-800 flex items-center justify-between text-xs text-slate-400 mb-6">
          <span>সর্বকালের সেরা স্কোর:</span>
          <span className="font-bold text-amber-400 tabular-nums text-sm">
            {highScore.toLocaleString('en-US')}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            data-start="true"
            onClick={onRestart}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 active:scale-98 text-white font-extrabold text-lg rounded-xl border border-emerald-300/40 shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>আবার চালান (Play Again)</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              onClick={onOpenGarage}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-98 text-amber-300 font-bold text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>বাস গ্যারেজ</span>
            </button>

            <button
              onClick={onHome}
              className="py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-300 font-bold text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>প্রধান মেনু</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
