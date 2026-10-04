import React, { useState } from 'react';
import { ArrowLeft, Gamepad2, Star, Sparkles, Trophy } from 'lucide-react';
import { RabbitCarrotGame } from './games/RabbitCarrotGame';
import { BalloonPopGame } from './games/BalloonPopGame';
import { TrainSequenceGame } from './games/TrainSequenceGame';
import { MiniShopGame } from './games/MiniShopGame';
import { sound } from '../services/sound';

interface MathGamesHubProps {
  onBack: () => void;
  onGameComplete: () => void;
}

type ActiveGame = null | 'rabbit' | 'balloons' | 'train' | 'shop';

export const MathGamesHub: React.FC<MathGamesHubProps> = ({ onBack, onGameComplete }) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);

  if (activeGame === 'rabbit') {
    return (
      <RabbitCarrotGame
        onBack={() => setActiveGame(null)}
        onFinished={() => {
          setActiveGame(null);
          onGameComplete();
        }}
      />
    );
  }

  if (activeGame === 'balloons') {
    return (
      <BalloonPopGame
        onBack={() => setActiveGame(null)}
        onFinished={() => {
          setActiveGame(null);
          onGameComplete();
        }}
      />
    );
  }

  if (activeGame === 'train') {
    return (
      <TrainSequenceGame
        onBack={() => setActiveGame(null)}
        onFinished={() => {
          setActiveGame(null);
          onGameComplete();
        }}
      />
    );
  }

  if (activeGame === 'shop') {
    return (
      <MiniShopGame
        onBack={() => setActiveGame(null)}
        onFinished={() => {
          setActiveGame(null);
          onGameComplete();
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 py-4">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-pink-200 text-pink-600 font-bold text-sm shadow-xs hover:bg-pink-50 transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-1.5 bg-pink-50 border border-pink-200 text-pink-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-xs">
          <Gamepad2 className="w-4 h-4 text-pink-600" />
          <span>KHU VUI CHƠI TOÁN HỌC</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-50 to-pink-50 rounded-[32px] border border-pink-100 p-6 mb-6 shadow-sm text-center">
        <div className="text-5xl mb-2">🎮✨🎈</div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#4A4A4A] tracking-tight">
          Học Toán Như Chơi Game!
        </h2>
        <p className="text-gray-500 font-medium text-xs sm:text-sm mt-1 max-w-md mx-auto">
          Minh An chọn trò chơi yêu thích để vừa phiêu lưu vừa kiếm thật nhiều ngôi sao nhé!
        </p>
      </div>

      {/* 4 Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Game 1: Rabbit Carrot */}
        <button
          onClick={() => {
            sound.playPop();
            setActiveGame('rabbit');
          }}
          className="bg-white hover:bg-emerald-50/40 rounded-[32px] border border-emerald-100 p-5 sm:p-6 text-left shadow-sm transition-all active:scale-95 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-5xl group-hover:scale-110 transition-transform">🐰🥕</span>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              Thưởng +5 ⭐
            </span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#4A4A4A]">
              Giúp Thỏ Tìm Cà Rốt
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
              Giải đúng 5 bài toán để bạn Thỏ nhảy từng bước tới củ cà rốt thơm ngon!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>Chơi ngay</span>
            <span>➔</span>
          </div>
        </button>

        {/* Game 2: Balloon Pop */}
        <button
          onClick={() => {
            sound.playPop();
            setActiveGame('balloons');
          }}
          className="bg-white hover:bg-pink-50/40 rounded-[32px] border border-pink-100 p-5 sm:p-6 text-left shadow-sm transition-all active:scale-95 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-5xl group-hover:scale-110 transition-transform">🎈💥</span>
            <span className="text-xs font-bold px-3 py-1 bg-pink-50 text-pink-700 border border-pink-200 rounded-full">
              Thưởng +1 ⭐ / bóng
            </span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#4A4A4A]">
              Bắn Bóng Toán Học
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
              Chạm nhanh vào quả bóng có phép tính đúng để làm bóng nổ tung rực rỡ!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-pink-600">
            <span>Chơi ngay</span>
            <span>➔</span>
          </div>
        </button>

        {/* Game 3: Train Sequence */}
        <button
          onClick={() => {
            sound.playPop();
            setActiveGame('train');
          }}
          className="bg-white hover:bg-purple-50/40 rounded-[32px] border border-purple-100 p-5 sm:p-6 text-left shadow-sm transition-all active:scale-95 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-5xl group-hover:scale-110 transition-transform">🚂💨</span>
            <span className="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full">
              Quy luật số
            </span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#4A4A4A]">
              Đoàn Tàu Dãy Số
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
              Lắp đúng toa tàu còn thiếu để đoàn tàu toán học hú còi lăn bánh nhé!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-purple-600">
            <span>Chơi ngay</span>
            <span>➔</span>
          </div>
        </button>

        {/* Game 4: Mini Shop */}
        <button
          onClick={() => {
            sound.playPop();
            setActiveGame('shop');
          }}
          className="bg-white hover:bg-amber-50/40 rounded-[32px] border border-amber-100 p-5 sm:p-6 text-left shadow-sm transition-all active:scale-95 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-5xl group-hover:scale-110 transition-transform">🛍️🍦</span>
            <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
              Toán đời sống
            </span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#4A4A4A]">
              Cửa Hàng Nhỏ Của Minh An
            </h3>
            <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
              Cầm 10 đồng xu đi mua kem, gấu bông và tính số tiền thừa còn lại!
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-amber-700">
            <span>Chơi ngay</span>
            <span>➔</span>
          </div>
        </button>
      </div>
    </div>
  );
};
