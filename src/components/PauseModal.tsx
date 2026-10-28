/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
  sfxEnabled: boolean;
  voiceEnabled: boolean;
  onToggleSfx: () => void;
  onToggleVoice: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onHome,
  sfxEnabled,
  voiceEnabled,
  onToggleSfx,
  onToggleVoice,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
        <h2 className="text-2xl font-black text-amber-400 mb-1">খেলা সাময়িক স্থগিত</h2>
        <p className="text-xs text-slate-400 mb-6">এক কাপ চা খেয়ে আবার রাজপথে নামুন!</p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onResume}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold rounded-xl border border-emerald-400 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>চালিয়ে যান (Resume)</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-bold rounded-xl border border-slate-600 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>নতুন করে শুরু (Restart)</span>
          </button>

          <button
            onClick={onHome}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 font-bold rounded-xl border border-slate-600 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span>প্রধান মেনু (Main Menu)</span>
          </button>
        </div>

        {/* Sound Toggles */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-800 w-full justify-center">
          <button
            onClick={onToggleSfx}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white cursor-pointer"
          >
            {sfxEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
            <span>সাউন্ড: {sfxEnabled ? 'চালু' : 'বন্ধ'}</span>
          </button>

          <button
            onClick={onToggleVoice}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white cursor-pointer"
          >
            {voiceEnabled ? <Mic className="w-4 h-4 text-sky-400" /> : <MicOff className="w-4 h-4 text-red-400" />}
            <span>ভয়েস: {voiceEnabled ? 'চালু' : 'বন্ধ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
