import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Sparkles, ArrowRight, Gift } from 'lucide-react';
import { MascotType } from '../types';
import { MASCOTS } from '../data/initialData';
import { sound } from '../services/sound';

interface CelebrationModalProps {
  isOpen: boolean;
  earnedStars: number;
  mascot: MascotType;
  title?: string;
  message?: string;
  onNext: () => void;
  onGoTreasure?: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  earnedStars = 1,
  mascot,
  title = 'Đúng Rồi Minh An Ơi! 🎉',
  message = 'Minh An giải toán siêu đỉnh! Bé nhận được thêm sao may mắn nè!',
  onNext,
  onGoTreasure,
}) => {
  const mascotInfo = MASCOTS[mascot] || MASCOTS.bunny;

  useEffect(() => {
    if (isOpen) {
      sound.playCorrect();
      sound.playStar();
      sound.speak(title + '. ' + message);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 50,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'],
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border-3 border-rose-200 shadow-2xl max-w-sm sm:max-w-md w-full p-6 text-center relative overflow-hidden">
        {/* Background decorative shine */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-pink-100/60 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-100/60 rounded-full blur-xl pointer-events-none" />

        {/* Mascot cheering */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-rose-50 border-2 border-rose-200 shadow-inner text-6xl mb-3 animate-bounce">
          {mascotInfo.emoji}
        </div>

        {/* Star Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-extrabold text-lg mb-3 shadow-xs">
          <Star className="w-6 h-6 text-amber-500 fill-amber-400 animate-spin" />
          <span>+{earnedStars} NGÔI SAO!</span>
        </div>

        <h3 className="font-black text-slate-800 text-xl sm:text-2xl tracking-tight mb-2">
          {title}
        </h3>

        <p className="text-slate-600 font-semibold text-sm sm:text-base leading-relaxed mb-6">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            id="btn-celebration-next"
            onClick={() => {
              sound.playPop();
              onNext();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-base sm:text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>CÂU TIẾP THEO</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {onGoTreasure && (
            <button
              onClick={() => {
                sound.playPop();
                onGoTreasure();
              }}
              className="py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs sm:text-sm border border-amber-200 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Gift className="w-4 h-4" />
              <span>Xem Kho báu để đổi quà</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
