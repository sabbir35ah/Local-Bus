/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Check, Lock, Zap, Gauge, Compass } from 'lucide-react';
import { BUS_SKINS, BusSkin, formatTaka } from '../game/rules.ts';

interface BusGarageModalProps {
  unlockedSkinIds: string[];
  selectedSkinId: string;
  totalCash: number;
  onSelectSkin: (skin: BusSkin) => void;
  onUnlockSkin: (skin: BusSkin) => void;
  onClose: () => void;
}

export const BusGarageModal: React.FC<BusGarageModalProps> = ({
  unlockedSkinIds,
  selectedSkinId,
  totalCash,
  onSelectSkin,
  onUnlockSkin,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border-2 border-amber-500/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚌</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-amber-400">
                ঢাকার বাস গ্যারেজ (Bus Garage)
              </h2>
              <p className="text-xs text-slate-300">
                উপার্জিত ভাড়া দিয়ে নতুন ডিজাইনের শক্তিশালী বাস আনলক করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-950/90 border border-emerald-500/50 px-3 py-1.5 rounded-xl">
              <span className="text-xs text-slate-300 mr-1.5">ব্যালেন্স:</span>
              <span className="text-sm font-bold text-emerald-400 tabular-nums">
                {formatTaka(totalCash)}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="বন্ধ করুন"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Bus List Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {BUS_SKINS.map((skin) => {
            const isUnlocked = unlockedSkinIds.includes(skin.id);
            const isSelected = selectedSkinId === skin.id;
            const canAfford = totalCash >= skin.price;

            return (
              <div
                key={skin.id}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-400 shadow-lg shadow-amber-950/40'
                    : isUnlocked
                    ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                    : 'bg-slate-900/60 border-slate-800 opacity-90'
                }`}
              >
                <div>
                  {/* Bus Header & Color Tag */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{skin.name}</h3>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                            চলমান
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">{skin.subtitle}</p>
                    </div>

                    {/* Color Swatch Dots */}
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-full border border-slate-700">
                      <span className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ backgroundColor: skin.primaryColor }}></span>
                      <span className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ backgroundColor: skin.secondaryColor }}></span>
                      <span className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ backgroundColor: skin.stripeColor }}></span>
                    </div>
                  </div>

                  {/* Route Board Banner */}
                  <div className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded text-xs text-amber-300 font-mono mb-3 truncate">
                    রুট: {skin.routeText}
                  </div>

                  {/* Stats Breakdown */}
                  <div className="grid grid-cols-3 gap-2 text-xs mb-4">
                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80 flex flex-col items-center">
                      <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                        <Gauge className="w-3.5 h-3.5 text-sky-400" />
                        <span>সর্বোচ্চ গতি</span>
                      </div>
                      <span className="font-bold text-white">{skin.maxSpeed} কিমি/ঘ</span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80 flex flex-col items-center">
                      <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>পিকআপ</span>
                      </div>
                      <span className="font-bold text-white">{skin.acceleration}</span>
                    </div>

                    <div className="bg-slate-950/60 p-2 rounded border border-slate-800/80 flex flex-col items-center">
                      <div className="flex items-center gap-1 text-slate-400 mb-0.5">
                        <Compass className="w-3.5 h-3.5 text-emerald-400" />
                        <span>কন্ট্রোল</span>
                      </div>
                      <span className="font-bold text-white">{(skin.handling * 10).toFixed(0)}/10</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div>
                  {isSelected ? (
                    <button
                      disabled
                      className="w-full py-2.5 bg-amber-500/20 text-amber-300 font-bold text-sm rounded-lg border border-amber-500/40 flex items-center justify-center gap-1.5 cursor-default"
                    >
                      <Check className="w-4 h-4" />
                      <span>ড্রাইভিংয়ের জন্য প্রস্তুত</span>
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => onSelectSkin(skin)}
                      className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 active:scale-98 text-white font-bold text-sm rounded-lg border border-slate-500 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>এই বাস বেছে নিন</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onUnlockSkin(skin)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 font-bold text-sm rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white border-emerald-400 shadow-md'
                          : 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      <span>আনলক করুন ({formatTaka(skin.price)})</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
