import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { MascotType } from '../types';
import { MASCOTS } from '../data/initialData';
import { sound } from '../services/sound';
import { storage } from '../services/storage';

interface OnboardingProps {
  onComplete: (selectedMascot: MascotType) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [selectedMascot, setSelectedMascot] = useState<MascotType>('bunny');
  const mascotInfo = MASCOTS[selectedMascot];

  const handleSelect = (m: MascotType) => {
    sound.playPop();
    setSelectedMascot(m);
    sound.speak(`Minh An đã chọn bạn ${MASCOTS[m].name}!`);
  };

  const handleStart = () => {
    sound.playCorrect();
    sound.playStar();
    storage.setMascot(selectedMascot);
    const profile = storage.getProfile();
    profile.completedOnboarding = true;
    storage.saveProfile(profile);
    onComplete(selectedMascot);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border-3 border-rose-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Header Greeting */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-rose-100 border border-rose-200 rounded-full text-xs sm:text-sm font-black text-rose-600 mb-3 shadow-2xs">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Chào mừng bé yêu</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight mb-1">
          Chào Minh An! 👋🌸
        </h1>
        <p className="text-slate-600 font-bold text-sm sm:text-base mb-6">
          Chúng mình cùng khám phá thế giới Toán học kỳ diệu nhé!
        </p>

        {/* Mascot Selection */}
        <div className="text-left mb-3">
          <label className="text-xs sm:text-sm font-extrabold text-slate-700">
            Minh An hãy chọn một người bạn đồng hành cùng học nhé:
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          {(Object.keys(MASCOTS) as MascotType[]).map((key) => {
            const m = MASCOTS[key];
            const isSelected = selectedMascot === key;

            return (
              <button
                key={key}
                id={`btn-mascot-${key}`}
                onClick={() => handleSelect(key)}
                className={`p-4 rounded-3xl border-2 transition-all duration-200 cursor-pointer text-center relative flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-rose-50/80 border-rose-400 shadow-md scale-102 ring-2 ring-rose-200'
                    : 'bg-white border-slate-200 hover:border-rose-200 shadow-2xs'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
                <span className="text-5xl sm:text-6xl filter drop-shadow-xs mb-1.5 animate-bounce">
                  {m.emoji}
                </span>
                <span className="font-extrabold text-slate-800 text-sm sm:text-base">{m.name}</span>
                <span className="text-[11px] text-slate-500 font-semibold mt-0.5">{m.tagline}</span>
              </button>
            );
          })}
        </div>

        {/* Companion Welcome Card */}
        <div className="bg-rose-50/80 rounded-2xl p-4 border border-rose-200 mb-6 text-center">
          <p className="text-rose-900 font-extrabold text-sm sm:text-base leading-relaxed">
            &ldquo;Từ hôm nay, <span className="text-rose-600 font-black">{mascotInfo.name}</span> sẽ
            đồng hành và cùng Minh An rinh thật nhiều ngôi sao toán học nhé! 🌟&rdquo;
          </p>
        </div>

        {/* Big Tactile Start Button */}
        <button
          id="btn-onboarding-start"
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 hover:from-rose-600 hover:to-pink-600 text-white font-black text-lg sm:text-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>BẮT ĐẦU HỌC TOÁN</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
