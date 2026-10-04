import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Sparkles, Star, Lock, Check } from 'lucide-react';
import { storage } from '../services/storage';
import { sound } from '../services/sound';

interface StickerAlbumProps {
  onBack: () => void;
}

export const StickerAlbum: React.FC<StickerAlbumProps> = ({ onBack }) => {
  const [stickers] = useState(() => storage.getStickers());
  const unlockedCount = stickers.filter((s: any) => s.unlocked).length;

  return (
    <div className="max-w-4xl mx-auto px-3 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-rose-200 text-rose-600 font-bold text-sm shadow-xs hover:bg-rose-50 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-1.5 bg-pink-100 border border-pink-300 text-pink-900 px-4 py-1.5 rounded-full text-sm font-black shadow-xs">
          <BookOpen className="w-4 h-4 text-pink-600" />
          <span>Đã sưu tầm: {unlockedCount}/{stickers.length}</span>
        </div>
      </div>

      {/* Album Title Card */}
      <div className="bg-linear-to-r from-purple-100 via-pink-100 to-rose-100 rounded-3xl border-2 border-pink-200 p-5 sm:p-6 mb-6 shadow-md text-center">
        <div className="text-5xl mb-2">📖🌸✨</div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          ALBUM STICKER CỦA MINH AN
        </h2>
        <p className="text-slate-600 font-semibold text-xs sm:text-sm mt-1 max-w-md mx-auto">
          Mỗi khi Minh An hoàn thành các bài học và trò chơi, cuốn sổ sẽ lấp lánh thêm những sticker
          mới thật đẹp!
        </p>
      </div>

      {/* Sticker Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {stickers.map((st: any) => (
          <div
            key={st.id}
            onClick={() => {
              if (st.unlocked) {
                sound.playStar();
                sound.speak(`Sticker ${st.name}. ${st.description}`);
              }
            }}
            className={`rounded-3xl border-2 p-4 text-center transition-all cursor-pointer ${
              st.unlocked
                ? 'bg-white border-pink-200 shadow-sm hover:scale-105 hover:border-pink-400'
                : 'bg-slate-100/80 border-dashed border-slate-300 opacity-60'
            }`}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-pink-50/60 flex items-center justify-center text-4xl sm:text-5xl mb-2 shadow-2xs">
              {st.unlocked ? (
                <span className="filter drop-shadow-xs animate-pulse">{st.emoji}</span>
              ) : (
                <Lock className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm">
              {st.unlocked ? st.name : 'Chưa mở khóa'}
            </h4>
            <p className="text-[11px] text-slate-500 font-medium mt-1 leading-tight">
              {st.description}
            </p>

            {st.unlocked && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2">
                <Check className="w-3 h-3" />
                <span>Đã đạt</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
