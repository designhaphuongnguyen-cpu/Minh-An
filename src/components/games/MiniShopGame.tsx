import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Star, ShoppingBag, Volume2, Sparkles } from 'lucide-react';
import { sound } from '../../services/sound';
import { storage } from '../../services/storage';

interface MiniShopGameProps {
  onBack: () => void;
  onFinished: (stars: number) => void;
}

interface ShopItem {
  name: string;
  emoji: string;
  price: number;
}

const SHOP_ITEMS: ShopItem[] = [
  { name: 'Cây kem dâu mát lạnh', emoji: '🍦', price: 6 },
  { name: 'Chú gấu bông nhỏ', emoji: '🧸', price: 7 },
  { name: 'Hộp kẹo ngọt ngào', emoji: '🍬', price: 4 },
  { name: 'Rổ dâu tây chín mọng', emoji: '🍓', price: 5 },
  { name: 'Chiếc nơ cài tóc', emoji: '🎀', price: 3 },
  { name: 'Bánh cupcake kem sữa', emoji: '🧁', price: 8 },
];

export const MiniShopGame: React.FC<MiniShopGameProps> = ({ onBack, onFinished }) => {
  const TOTAL_COINS = 10;
  const [itemIndex, setItemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentItem = SHOP_ITEMS[itemIndex % SHOP_ITEMS.length];
  const remainingCoins = TOTAL_COINS - currentItem.price;

  // Generate 4 choices
  const options = Array.from(
    new Set([
      remainingCoins,
      Math.max(1, remainingCoins - 1),
      remainingCoins + 1,
      Math.min(9, remainingCoins + 2),
    ])
  ).sort((a, b) => a - b);

  const handleBuy = (choice: number) => {
    if (choice === remainingCoins) {
      sound.playCorrect();
      sound.playStar();
      const newScore = score + 1;
      setScore(newScore);
      storage.addStars(1);
      storage.unlockSticker('st_candy');

      try {
        confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
      } catch (e) {}

      const msg = `Chính xác! ${TOTAL_COINS} - ${currentItem.price} = ${remainingCoins} xu. Minh An đã mua được ${currentItem.name}! 🛍️`;
      setFeedback(msg);
      sound.speak(msg);

      setTimeout(() => {
        setFeedback(null);
        setItemIndex((prev) => prev + 1);
      }, 2000);
    } else {
      sound.playTryAgain();
      const msg = `Gần đúng rồi! Có ${TOTAL_COINS} đồng, trả tiền ${currentItem.price} đồng thì còn lại mấy đồng nhỉ?`;
      setFeedback(msg);
      sound.speak(msg);
      setTimeout(() => setFeedback(null), 1800);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-3 py-4">
      {/* Top Header */}
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

        <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-full text-sm font-extrabold shadow-xs">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>Điểm: {score}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl border-2 border-amber-200 p-5 sm:p-7 shadow-lg text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1 px-3.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-black text-amber-800 mb-3 shadow-2xs">
          <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
          <span>CỬA HÀNG NHỎ CỦA MINH AN</span>
        </div>

        {/* Story Card */}
        <div className="bg-amber-50/70 rounded-2xl p-4 sm:p-5 border border-amber-200 mb-4 text-left">
          <p className="text-slate-800 font-extrabold text-sm sm:text-base leading-relaxed">
            Minh An có <span className="text-amber-700 font-black">{TOTAL_COINS} đồng xu</span>. Minh
            An muốn mua <span className="text-rose-600 font-black">{currentItem.name}</span> giá{' '}
            <span className="text-amber-700 font-black">{currentItem.price} đồng</span>.
          </p>
          <p className="text-slate-700 font-black text-base sm:text-lg mt-2 text-rose-600">
            Hỏi Minh An còn lại bao nhiêu đồng xu?
          </p>
        </div>

        {/* Visual Item & Coins */}
        <div className="my-4 p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex flex-col sm:flex-row items-center justify-around gap-4">
          {/* Shop Item Badge */}
          <div className="text-center bg-white p-3.5 rounded-2xl border-2 border-rose-200 shadow-xs min-w-[120px]">
            <div className="text-5xl mb-1">{currentItem.emoji}</div>
            <div className="font-extrabold text-xs text-slate-700">{currentItem.name}</div>
            <div className="text-sm font-black text-rose-600 mt-1">Giá: {currentItem.price} 🪙</div>
          </div>

          {/* Visual 10 Coins with Paid Coins Struck Out */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-bold text-slate-500 mb-1.5">
              10 Đồng xu của Minh An (bớt {currentItem.price} xu):
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: TOTAL_COINS }).map((_, idx) => {
                const isPaid = idx < currentItem.price;
                return (
                  <div
                    key={idx}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all ${
                      isPaid
                        ? 'bg-slate-200 border-slate-300 opacity-50 relative'
                        : 'bg-amber-400 border-amber-500 text-white shadow-xs'
                    }`}
                  >
                    🪙
                    {isPaid && (
                      <span className="absolute inset-0 flex items-center justify-center text-rose-600 font-black text-xs">
                        ❌
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className="my-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold rounded-xl animate-in fade-in">
            {feedback}
          </div>
        )}

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto my-3">
          {options.map((opt, idx) => (
            <button
              key={idx}
              id={`btn-shop-opt-${idx}`}
              onClick={() => handleBuy(opt)}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-amber-50 border-2 border-amber-300 text-amber-950 font-black text-xl shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{opt}</span>
              <span className="text-sm font-bold text-slate-500">đồng xu</span>
            </button>
          ))}
        </div>

        <p className="text-xs font-bold text-slate-500 mt-2">
          💡 Minh An lấy 10 trừ đi {currentItem.price} nhé!
        </p>
      </div>
    </div>
  );
};
