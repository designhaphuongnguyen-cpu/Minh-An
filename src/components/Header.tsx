import React from 'react';
import { Volume2, VolumeX, Flame, Star, ShieldCheck, Home } from 'lucide-react';
import { ChildProfile, NavigationPage } from '../types';
import { MASCOTS } from '../data/initialData';
import { sound } from '../services/sound';

interface HeaderProps {
  profile: ChildProfile;
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenParentPin: () => void;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentPage,
  onNavigate,
  onOpenParentPin,
  onToggleSound,
}) => {
  const mascotInfo = MASCOTS[profile.mascot] || MASCOTS.bunny;

  return (
    <header className="h-20 bg-white border-b border-pink-100 flex items-center justify-between px-4 sm:px-8 md:px-10 shadow-xs sticky top-0 z-30">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Home / Profile Mascot Avatar & Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          {currentPage !== 'home' && currentPage !== 'onboarding' ? (
            <button
              id="btn-back-home"
              onClick={() => {
                sound.playPop();
                onNavigate('home');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold text-sm transition-all active:scale-95 border border-pink-200"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>
          ) : null}

          <div
            onClick={() => {
              sound.playPop();
              onNavigate('home');
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-2xl shadow-inner relative transition-transform group-hover:scale-105">
              <span>{mascotInfo.emoji}</span>
              {profile.equippedAccessory === 'bow_pink' && (
                <span className="absolute -top-1 -right-1 text-xs">🎀</span>
              )}
              {profile.equippedAccessory === 'crown_princess' && (
                <span className="absolute -top-2 -right-1 text-xs">👑</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-pink-500 tracking-tight">
                  Chào {profile.name}!
                </h1>
                <span className="text-xs bg-pink-100 text-pink-600 font-bold px-2.5 py-0.5 rounded-full hidden sm:inline-block">
                  Lớp {profile.grade}
                </span>
              </div>
              <p className="text-xs text-[#8A8A8A] font-medium hidden md:block">
                Bạn đồng hành: {mascotInfo.name} 🌸
              </p>
            </div>
          </div>
        </div>

        {/* Right: Stats Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Star Counter Pill */}
          <div
            id="badge-stars"
            onClick={() => {
              sound.playStar();
              onNavigate('treasure');
            }}
            className="bg-amber-50 px-3.5 sm:px-4 py-2 rounded-full border border-amber-200 flex items-center gap-2 font-bold text-amber-600 text-sm sm:text-lg cursor-pointer hover:bg-amber-100 shadow-xs active:scale-95 transition-all"
            title="Kho báu sao của Minh An"
          >
            <span className="text-lg sm:text-xl">⭐</span>
            <span className="font-bold text-amber-600">{profile.stars}</span>
          </div>

          {/* Daily Streak Flame Pill */}
          <div
            id="badge-streak"
            className="bg-orange-50 px-3.5 sm:px-4 py-2 rounded-full border border-orange-200 flex items-center gap-2 font-bold text-orange-600 text-sm sm:text-lg shadow-xs"
            title="Số ngày học liên tiếp"
          >
            <span className="text-lg sm:text-xl">🔥</span>
            <span className="font-bold text-orange-600">{profile.streak} ngày</span>
          </div>

          {/* Level Pill */}
          <div
            className="bg-purple-50 px-3.5 sm:px-4 py-2 rounded-full border border-purple-200 hidden lg:flex items-center gap-2 font-bold text-purple-600 text-sm sm:text-lg shadow-xs"
            title="Cấp độ học tập"
          >
            <span className="text-lg sm:text-xl">🏆</span>
            <span className="font-bold text-purple-600">Cấp {profile.level}</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all active:scale-90 ${
              profile.soundEnabled
                ? 'bg-pink-50 border-pink-200 text-pink-600 hover:bg-pink-100'
                : 'bg-gray-100 border-gray-200 text-gray-400 hover:bg-gray-200'
            }`}
            title={profile.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {profile.soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          {/* Parents Dashboard Button */}
          <button
            id="btn-parent-zone"
            onClick={onOpenParentPin}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all active:scale-95"
            title="Khu vực dành cho Bố Mẹ (Mã PIN)"
          >
            <ShieldCheck className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">BỐ MẸ (PIN)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
