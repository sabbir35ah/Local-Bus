/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-slate-900 border-2 border-sky-500/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🚦</span>
            <div>
              <h2 className="text-xl font-bold text-sky-400">খেলার নিয়মাবলী ও কৌশল</h2>
              <p className="text-xs text-slate-400">ঢাকা লোকাল বাসের আসল বস হয়ে উঠুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <span>🎮</span>
              <span>নিয়ন্ত্রণ (Controls):</span>
            </h3>
            <ul className="space-y-1.5 text-slate-300">
              <li><strong className="text-white">W বা ⬆️ তীর:</strong> এক্সিলারেট / গতি বাড়ানো</li>
              <li><strong className="text-white">S বা ⬇️ তীর:</strong> ব্রেক ও গতি কমানো</li>
              <li><strong className="text-white">A বা ⬅️ তীর:</strong> বামে স্টিয়ারিং</li>
              <li><strong className="text-white">D বা ➡️ তীর:</strong> ডানে স্টিয়ারিং</li>
              <li><strong className="text-white">Space:</strong> ইমার্জেন্সি হ্যান্ডব্রেক</li>
              <li><strong className="text-white">H:</strong> বিখ্যাত লোকাল বাস হর্ন (রাস্তা ক্লিয়ার হবে!)</li>
              <li><strong className="text-white">Esc / P:</strong> গেম পজ করা</li>
            </ul>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <h3 className="font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>যাত্রী তোলা ও ভাড়া আদায়:</span>
            </h3>
            <p className="leading-relaxed">
              রাস্তায় কিছু দূর পরপর বাস স্টপ (হলুদ দাগ দেওয়া জোন) আসবে। স্টপ আসার আগে গতি কমিয়ে ২০ কিমি/ঘণ্টার নিচে নামান। বাস স্টপে দাঁড়ালে স্বয়ংক্রিয়ভাবে যাত্রী উঠবে এবং ক্যাশ ও বোনাস পয়েন্ট পাবেন!
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <h3 className="font-bold text-sky-400 mb-2 flex items-center gap-1.5">
              <span>⚡</span>
              <span>কাছাকাছি ওভারটেক ও হর্ন:</span>
            </h3>
            <p className="leading-relaxed">
              সিএনজি, রিকশা বা প্রাইভেট কারের খুব কাছ দিয়ে না ছুঁয়ে ওভারটেক করলে বিশেষ ‘ক্লোজ ওভারটেক বোনাস’ পাবেন। সামনে সিএনজি থাকলে <strong className="text-amber-300">H</strong> চেপে হর্ন বাজালে তারা পাশ কেটে সরে যাবে!
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <h3 className="font-bold text-red-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>ক্ষতি ও অ্যাক্সিডেন্ট:</span>
            </h3>
            <p className="leading-relaxed">
              ধাক্কা খেলে বাসের ক্ষতি বাড়বে। হালকা টোকায় কিছু ক্ষতি হয়, কিন্তু জোরে সামনাসামনি ধাক্কা খেলে বাস মারাত্মক ভেঙে পড়বে এবং ১০০% ক্ষতিতে সার্ভিস শেষ হবে।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg cursor-pointer"
          >
            বুঝেছি, চলেন খেলি!
          </button>
        </div>
      </div>
    </div>
  );
};
