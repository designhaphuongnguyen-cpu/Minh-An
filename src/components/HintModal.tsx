import React, { useState } from 'react';
import { Lightbulb, Volume2, X, Sparkles, ChevronRight, Check } from 'lucide-react';
import { Question } from '../types';
import { sound } from '../services/sound';

interface HintModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({ question, isOpen, onClose }) => {
  const [activeTier, setActiveTier] = useState<1 | 2 | 3>(1);

  if (!isOpen) return null;

  const currentHintText =
    activeTier === 1
      ? question.hint1
      : activeTier === 2
      ? question.hint2
      : question.hint3;

  const handleSpeak = () => {
    sound.speak(currentHintText);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-amber-100 text-amber-700">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">
                Cô giáo & Thỏ Bông gợi ý
              </h3>
              <p className="text-xs text-slate-500">Minh An đừng lo, chúng mình cùng làm nhé!</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 my-4 p-1.5 bg-amber-50/80 rounded-2xl border border-amber-200/60">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTier(1);
            }}
            className={`flex-1 py-2 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeTier === 1
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            💡 Gợi ý 1
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTier(2);
            }}
            className={`flex-1 py-2 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeTier === 2
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            🖼️ Gợi ý 2 (Hình ảnh)
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTier(3);
            }}
            className={`flex-1 py-2 px-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeTier === 3
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-800 hover:bg-amber-100'
            }`}
          >
            📝 Từng bước
          </button>
        </div>

        {/* Hint Content Area */}
        <div className="p-4 sm:p-5 bg-amber-50/40 rounded-2xl border border-amber-100 min-h-[110px] flex items-center justify-between gap-3">
          <p className="text-slate-800 font-bold text-sm sm:text-base leading-relaxed">
            {currentHintText}
          </p>

          <button
            id="btn-speak-hint"
            onClick={handleSpeak}
            className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-xs shrink-0 active:scale-90 transition-transform"
            title="Nghe cô đọc gợi ý"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="mt-5 flex items-center justify-between gap-3">
          {activeTier < 3 ? (
            <button
              onClick={() => {
                sound.playPop();
                setActiveTier((prev) => (prev + 1) as 2 | 3);
              }}
              className="flex items-center gap-1 text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-900"
            >
              <span>Xem gợi ý tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <Sparkles className="w-4 h-4" />
              <span>Con đã xem hết gợi ý</span>
            </div>
          )}

          <button
            id="btn-close-hint"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Con hiểu rồi, làm tiếp!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
