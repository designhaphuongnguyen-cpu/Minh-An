import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { MascotType } from '../types';
import { MASCOTS } from '../data/initialData';
import { sound } from '../services/sound';

interface MascotProps {
  mascot: MascotType;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  equippedAccessory?: string;
  mood?: 'happy' | 'thinking' | 'cheering' | 'waving';
  showSpeechBubble?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  mascot,
  message,
  size = 'md',
  equippedAccessory = 'bow_pink',
  mood = 'happy',
  showSpeechBubble = true,
}) => {
  const mascotInfo = MASCOTS[mascot] || MASCOTS.bunny;
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (message) {
      setIsSpeaking(true);
      sound.speak(message);
      setTimeout(() => setIsSpeaking(false), 3500);
    }
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-3xl',
    md: 'w-20 h-20 text-5xl',
    lg: 'w-28 h-28 text-7xl',
    xl: 'w-36 h-36 text-8xl',
  };

  const accessoryDisplay = () => {
    if (equippedAccessory === 'bow_pink') {
      return <span className="absolute -top-2 -right-1 text-2xl animate-bounce">🎀</span>;
    }
    if (equippedAccessory === 'crown_princess') {
      return <span className="absolute -top-4 -right-1 text-3xl animate-pulse">👑</span>;
    }
    if (equippedAccessory === 'dress_strawberry') {
      return <span className="absolute -bottom-2 -left-1 text-2xl">🍓</span>;
    }
    if (equippedAccessory === 'magic_wand') {
      return <span className="absolute top-0 -left-3 text-2xl animate-spin">🪄</span>;
    }
    if (equippedAccessory === 'carrot_basket') {
      return <span className="absolute -bottom-1 -right-2 text-2xl">🥕</span>;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4 my-2">
      {/* Mascot Avatar Character */}
      <div className="relative inline-flex items-center justify-center shrink-0">
        <div
          className={`${sizeClasses[size]} rounded-[32px] bg-gradient-to-b from-white to-pink-50 border-2 border-pink-200 shadow-md flex items-center justify-center transition-all duration-300 transform hover:scale-105 select-none ${
            mood === 'cheering' ? 'animate-bounce' : mood === 'waving' ? 'animate-pulse' : ''
          }`}
        >
          <span className="filter drop-shadow-xs leading-none">{mascotInfo.emoji}</span>
          {accessoryDisplay()}
        </div>
      </div>

      {/* Speech Bubble */}
      {showSpeechBubble && message && (
        <div className="relative flex-1 bg-white border border-pink-100 rounded-[28px] p-3.5 sm:p-4 shadow-sm">
          {/* Arrow */}
          <div className="absolute left-0 top-1/2 -translate-x-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white filter drop-shadow-xs" />

          <div className="flex items-start justify-between gap-2">
            <p className="text-[#4A4A4A] font-bold text-sm sm:text-base leading-relaxed tracking-tight">
              {message}
            </p>

            <button
              id="btn-mascot-speak"
              onClick={handleSpeak}
              className={`p-2 rounded-full border border-pink-200 shrink-0 transition-transform active:scale-90 ${
                isSpeaking ? 'bg-pink-500 text-white animate-pulse' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
              }`}
              title="Nghe bạn đọc"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
