import React, { useState } from 'react';
import {
  Volume2,
  Sparkles,
  Play,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { ChildProfile, NavigationPage, SkillProgressItem, SkillProgressMap } from '../types';
import { MASCOTS } from '../data/initialData';
import { sound } from '../services/sound';

interface HomeDashboardProps {
  profile: ChildProfile;
  skills: SkillProgressMap;
  onNavigate: (page: NavigationPage) => void;
  onSelectSubject?: (subject: 'math' | 'english' | 'vietnamese') => void;
  onOpenParentPin: () => void;
}

const MASCOT_MESSAGES = [
  'Hôm nay chúng mình cùng học Toán, Tiếng Anh và Tiếng Việt nhé, Minh An ơi!',
  'Minh An ơi, Thỏ Bông đã sẵn sàng cùng con khám phá bài học mới rồi nè!',
  'Cố lên Minh An! Mỗi ngày 10 phút là con sẽ học siêu đỉnh!',
  'Hôm nay có trò chơi mới trong Kho Báu kìa Minh An ơi!',
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  skills,
  onNavigate,
  onSelectSubject,
  onOpenParentPin,
}) => {
  const [randomMsgIndex] = useState(() => Math.floor(Math.random() * MASCOT_MESSAGES.length));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mascotInfo = MASCOTS[profile.mascot] || MASCOTS.bunny;

  const currentMsg = MASCOT_MESSAGES[randomMsgIndex];

  const handleSpeak = () => {
    setIsSpeaking(true);
    sound.speakVietnamese(currentMsg);
    setTimeout(() => setIsSpeaking(false), 3500);
  };

  // Skill calculations for 3 main subjects
  const allSkillItems = Object.values(skills) as SkillProgressItem[];
  const mathSkills = allSkillItems.filter(
    (s) => !s.category.includes('Tiếng Anh') && !s.category.includes('Tiếng Việt')
  );
  const englishSkills = allSkillItems.filter((s) => s.category.includes('Tiếng Anh'));
  const vietnameseSkills = allSkillItems.filter((s) => s.category.includes('Tiếng Việt'));

  const getAvgScore = (list: SkillProgressItem[]) => {
    if (list.length === 0) return 0;
    const total = list.reduce((acc, curr) => acc + curr.masteryScore, 0);
    return Math.round(total / list.length);
  };

  const mathScore = getAvgScore(mathSkills);
  const englishScore = getAvgScore(englishSkills);
  const vietnameseScore = getAvgScore(vietnameseSkills);

  const handleChooseSubject = (subject: 'math' | 'english' | 'vietnamese') => {
    sound.playPop();
    if (onSelectSubject) {
      onSelectSubject(subject);
    } else {
      onNavigate('practice-topics');
    }
  };

  // Specific highlight scores
  const countingScore = skills.counting?.masteryScore ?? 0;
  const enLetterScore = skills.englishLetters?.masteryScore ?? 0;
  const viLetterScore = skills.vietnameseLetters?.masteryScore ?? 0;

  // Weak skills for quick practice (skills the child has practiced and needs reinforcement)
  const skillList = Object.values(skills) as SkillProgressItem[];
  const weakSkills = skillList.filter((s) => s.correctCount + s.wrongCount > 0 && s.masteryScore < 75);

  const accessoryDisplay = () => {
    if (profile.equippedAccessory === 'bow_pink') {
      return <span className="absolute -top-2 -right-1 text-3xl animate-bounce">🎀</span>;
    }
    if (profile.equippedAccessory === 'crown_princess') {
      return <span className="absolute -top-4 -right-1 text-4xl animate-pulse">👑</span>;
    }
    if (profile.equippedAccessory === 'dress_strawberry') {
      return <span className="absolute -bottom-2 -left-1 text-3xl">🍓</span>;
    }
    if (profile.equippedAccessory === 'magic_wand') {
      return <span className="absolute top-0 -left-3 text-3xl animate-spin">🪄</span>;
    }
    if (profile.equippedAccessory === 'carrot_basket') {
      return <span className="absolute -bottom-1 -right-2 text-3xl">🥕</span>;
    }
    return null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Main Two-Column Layout (Matching Sleek Interface Spec) */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        {/* Left Section (1/3 on desktop) */}
        <section className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* Mascot Hero Card */}
          <div className="bg-white rounded-[40px] p-6 sm:p-8 shadow-xl border border-pink-50 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-pink-50 rounded-full opacity-50 pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-50 rounded-full opacity-50 pointer-events-none" />

            <div className="relative mb-2">
              <div className="text-[90px] sm:text-[100px] relative z-10 filter drop-shadow-sm select-none transition-transform hover:scale-105">
                {mascotInfo.emoji}
              </div>
              {accessoryDisplay()}
            </div>

            <div className="bg-pink-500 text-white px-6 py-2 rounded-2xl text-base sm:text-lg font-bold mb-4 relative z-10 shadow-xs">
              {mascotInfo.name}
            </div>

            <p className="text-lg sm:text-xl font-medium leading-relaxed text-pink-600 relative z-10">
              “{currentMsg}”
            </p>

            <button
              id="btn-mascot-audio"
              onClick={handleSpeak}
              className={`mt-4 px-4 py-2 rounded-full border border-pink-200 text-xs font-bold flex items-center gap-2 transition-all active:scale-95 z-10 ${
                isSpeaking
                  ? 'bg-pink-500 text-white animate-pulse'
                  : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'Đang đọc...' : 'Nghe bạn đọc'}</span>
            </button>
          </div>

          {/* Child Progress Card */}
          <div className="bg-white rounded-[32px] p-6 shadow-md border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-bold text-gray-500 uppercase tracking-widest">
                Tiến độ của bé
              </h2>
              <span className="text-xs font-bold text-pink-500">Lớp 1</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span className="text-gray-700 flex items-center gap-1.5">
                    <span>📐</span> Toán Lớp 1
                  </span>
                  <span className="text-indigo-600 font-extrabold">{mathScore}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${mathScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span className="text-gray-700 flex items-center gap-1.5">
                    <span>🇬🇧</span> Tiếng Anh Lớp 1
                  </span>
                  <span className="text-sky-600 font-extrabold">{englishScore}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${englishScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-bold mb-1.5">
                  <span className="text-gray-700 flex items-center gap-1.5">
                    <span>🇻🇳</span> Tiếng Việt Lớp 1
                  </span>
                  <span className="text-emerald-600 font-extrabold">{vietnameseScore}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${vietnameseScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section (2/3 on desktop) */}
        <section className="w-full lg:w-2/3 flex flex-col gap-6 sm:gap-8">
          {/* Main Hero Card: HÔM NAY MINH AN HỌC GÌ? */}
          <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-[40px] p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">
                HÔM NAY MINH AN HỌC GÌ?
              </h2>
              <p className="text-pink-50 text-base sm:text-lg mb-6 opacity-90 font-medium">
                Kế hoạch đặc biệt kết hợp Toán, Tiếng Anh & Tiếng Việt dành riêng cho con!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30">
                  <div className="text-2xl mb-1">📐</div>
                  <div className="font-bold text-base">Toán Vui</div>
                  <div className="text-xs opacity-85">Số đếm & Phép tính</div>
                </div>

                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30">
                  <div className="text-2xl mb-1">🇬🇧</div>
                  <div className="font-bold text-base">Tiếng Anh</div>
                  <div className="text-xs opacity-85">Chữ cái & Từ vựng</div>
                </div>

                <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30">
                  <div className="text-2xl mb-1">🇻🇳</div>
                  <div className="font-bold text-base">Tiếng Việt</div>
                  <div className="text-xs opacity-85">Dấu thanh & Đọc hiểu</div>
                </div>
              </div>

              <button
                id="btn-home-start-today"
                onClick={() => {
                  sound.playPop();
                  onNavigate('learn-today');
                }}
                className="mt-6 sm:mt-8 bg-white text-pink-500 font-black text-xl sm:text-2xl px-10 sm:px-12 py-3.5 sm:py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 flex items-center gap-3 transition-transform cursor-pointer"
              >
                <span>BẮT ĐẦU BÀI HỌC HÔM NAY</span>
                <span>✨</span>
              </button>
            </div>

            <div className="absolute right-[-20px] bottom-[-20px] text-[180px] sm:text-[200px] opacity-20 rotate-12 pointer-events-none select-none">
              ✨
            </div>
          </div>

          {/* 3 Main Subject Selection Cards */}
          <div className="bg-white rounded-[36px] p-6 sm:p-7 border-2 border-pink-100 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎒</span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                    CHỌN MÔN HỌC LỚP 1
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                  Bé bấm vào môn con muốn học để bắt đầu khám phá từng chủ đề nhé!
                </p>
              </div>
              <span className="self-start sm:self-auto text-xs font-extrabold text-pink-600 bg-pink-50 border border-pink-200 px-3 py-1 rounded-full">
                3 Môn Học Chuẩn Lớp 1
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Môn Toán */}
              <div
                id="btn-subject-math"
                onClick={() => handleChooseSubject('math')}
                className="group relative bg-gradient-to-b from-indigo-500 to-indigo-700 text-white rounded-3xl p-5 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 flex flex-col justify-between overflow-hidden border-2 border-indigo-400"
              >
                <div className="absolute -right-4 -bottom-4 text-7xl opacity-15 pointer-events-none group-hover:scale-110 transition-transform">
                  📐
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      📐
                    </div>
                    <span className="text-xs font-black bg-white/25 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                      11 Chủ đề
                    </span>
                  </div>
                  <h4 className="text-xl font-black mb-1">MÔN TOÁN</h4>
                  <p className="text-xs text-indigo-100 font-medium line-clamp-2 mb-3">
                    Số 1-100, Phép cộng trừ, So sánh, Hình học & Toán đố
                  </p>
                </div>

                <div className="pt-3 border-t border-white/20">
                  <div className="flex justify-between text-xs font-bold mb-1.5 text-indigo-100">
                    <span>Thành thạo</span>
                    <span className="font-extrabold text-amber-300">{mathScore}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-amber-300 rounded-full transition-all duration-500"
                      style={{ width: `${mathScore}%` }}
                    />
                  </div>
                  <button className="w-full py-2.5 bg-white text-indigo-700 font-black text-sm rounded-2xl shadow-sm group-hover:bg-amber-300 group-hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5">
                    <span>Vào Học Toán</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2. Tiếng Anh */}
              <div
                id="btn-subject-english"
                onClick={() => handleChooseSubject('english')}
                className="group relative bg-gradient-to-b from-sky-500 to-blue-700 text-white rounded-3xl p-5 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 flex flex-col justify-between overflow-hidden border-2 border-sky-400"
              >
                <div className="absolute -right-4 -bottom-4 text-7xl opacity-15 pointer-events-none group-hover:scale-110 transition-transform">
                  🇬🇧
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      🔤
                    </div>
                    <span className="text-[11px] font-black bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full shadow-xs">
                      Phát âm Anh 🎧
                    </span>
                  </div>
                  <h4 className="text-xl font-black mb-1">TIẾNG ANH</h4>
                  <p className="text-xs text-sky-100 font-medium line-clamp-2 mb-3">
                    Bảng chữ cái A-Z, Từ vựng con vật, hoa quả & màu sắc
                  </p>
                </div>

                <div className="pt-3 border-t border-white/20">
                  <div className="flex justify-between text-xs font-bold mb-1.5 text-sky-100">
                    <span>Thành thạo</span>
                    <span className="font-extrabold text-amber-300">{englishScore}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-amber-300 rounded-full transition-all duration-500"
                      style={{ width: `${englishScore}%` }}
                    />
                  </div>
                  <button className="w-full py-2.5 bg-white text-sky-700 font-black text-sm rounded-2xl shadow-sm group-hover:bg-amber-300 group-hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5">
                    <span>Vào Học Tiếng Anh</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3. Tiếng Việt */}
              <div
                id="btn-subject-vietnamese"
                onClick={() => handleChooseSubject('vietnamese')}
                className="group relative bg-gradient-to-b from-emerald-500 to-teal-700 text-white rounded-3xl p-5 cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 flex flex-col justify-between overflow-hidden border-2 border-emerald-400"
              >
                <div className="absolute -right-4 -bottom-4 text-7xl opacity-15 pointer-events-none group-hover:scale-110 transition-transform">
                  🇻🇳
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      📖
                    </div>
                    <span className="text-[11px] font-black bg-rose-400 text-white px-2 py-0.5 rounded-full shadow-xs">
                      Giọng Việt 🎙️
                    </span>
                  </div>
                  <h4 className="text-xl font-black mb-1">TIẾNG VIỆT</h4>
                  <p className="text-xs text-emerald-100 font-medium line-clamp-2 mb-3">
                    Bảng chữ cái, 5 Dấu thanh, Ghép vần & Đọc hiểu truyện
                  </p>
                </div>

                <div className="pt-3 border-t border-white/20">
                  <div className="flex justify-between text-xs font-bold mb-1.5 text-emerald-100">
                    <span>Thành thạo</span>
                    <span className="font-extrabold text-amber-300">{vietnameseScore}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-amber-300 rounded-full transition-all duration-500"
                      style={{ width: `${vietnameseScore}%` }}
                    />
                  </div>
                  <button className="w-full py-2.5 bg-white text-emerald-700 font-black text-sm rounded-2xl shadow-sm group-hover:bg-amber-300 group-hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5">
                    <span>Vào Học Tiếng Việt</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Main Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 flex-1">
            {/* Card 1: HỌC BÀI */}
            <div
              id="btn-nav-learn"
              onClick={() => {
                sound.playPop();
                onNavigate('learn-today');
              }}
              className="bg-[#E6FFFA] border-4 border-[#B2F5EA] rounded-[32px] p-6 flex items-center gap-5 sm:gap-6 cursor-pointer shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-inner shrink-0 select-none">
                📚
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#2C7A7B]">HỌC BÀI</h3>
                <p className="text-[#319795] text-sm font-medium">Khám phá kiến thức mới</p>
              </div>
            </div>

            {/* Card 2: LUYỆN TẬP */}
            <div
              id="btn-nav-practice"
              onClick={() => {
                sound.playPop();
                onNavigate('practice-topics');
              }}
              className="bg-[#FAF5FF] border-4 border-[#E9D8FD] rounded-[32px] p-6 flex items-center gap-5 sm:gap-6 cursor-pointer shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-inner shrink-0 select-none">
                ✏️
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#6B46C1]">LUYỆN TẬP</h3>
                <p className="text-[#805AD5] text-sm font-medium">Ôn lại những bài đã học</p>
              </div>
            </div>

            {/* Card 3: CHƠI TOÁN */}
            <div
              id="btn-nav-games"
              onClick={() => {
                sound.playPop();
                onNavigate('math-games');
              }}
              className="bg-[#FFFBEB] border-4 border-[#FEFCBF] rounded-[32px] p-6 flex items-center gap-5 sm:gap-6 cursor-pointer shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-95"
            >
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-inner shrink-0 select-none">
                🎮
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#B7791F]">CHƠI TOÁN</h3>
                <p className="text-[#D69E2E] text-sm font-medium">Vừa chơi vừa giỏi toán</p>
              </div>
            </div>

            {/* Card 4: KHO BÁU */}
            <div
              id="btn-nav-treasure"
              onClick={() => {
                sound.playPop();
                onNavigate('treasure');
              }}
              className="bg-[#FFF5F7] border-4 border-[#FED7E2] rounded-[32px] p-6 flex items-center gap-5 sm:gap-6 cursor-pointer shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-95 relative overflow-hidden"
            >
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-inner shrink-0 select-none">
                🎁
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#B83280]">KHO BÁU</h3>
                <p className="text-[#D53F8C] text-sm font-medium">Nhận quà từ sao may mắn</p>
              </div>
              <div className="absolute top-3 right-4 bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
                MỚI!
              </div>
            </div>
          </div>

          {/* Secondary Quick Links: Daily Challenge & Sticker Album */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => {
                sound.playPop();
                onNavigate('daily-challenge');
              }}
              className="bg-white rounded-[28px] border border-amber-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  🌟
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-base">Thử Thách Hôm Nay</h4>
                  <p className="text-xs text-amber-700 font-medium">5 câu hỏi nhanh nhận +5 ⭐</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-500 shrink-0" />
            </div>

            <div
              onClick={() => {
                sound.playPop();
                onNavigate('album');
              }}
              className="bg-white rounded-[28px] border border-purple-200 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl shadow-inner shrink-0">
                  📖
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-base">Album Sticker</h4>
                  <p className="text-xs text-purple-700 font-medium">Bộ sưu tập huy hiệu lấp lánh</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-500 shrink-0" />
            </div>
          </div>

          {/* Weakness Practice Section */}
          {weakSkills.length > 0 && (
            <div className="bg-white rounded-[32px] border border-pink-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔁</span>
                <div>
                  <h4 className="font-bold text-gray-800 text-base">Minh An Luyện Thêm</h4>
                  <p className="text-xs text-gray-500 font-medium">
                    Tự động phát hiện những dạng bài con cần củng cố thêm
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {weakSkills.map((sk) => (
                  <button
                    key={sk.skillId}
                    onClick={() => {
                      sound.playPop();
                      onNavigate('practice-topics');
                    }}
                    className="p-3.5 bg-pink-50/50 hover:bg-pink-100/60 rounded-2xl border border-pink-200 flex items-center justify-between text-left transition-all active:scale-95 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{sk.icon}</span>
                      <div>
                        <div className="font-bold text-gray-800 text-sm">{sk.name}</div>
                        <div className="text-[11px] font-bold text-pink-600">
                          Độ thành thạo: {sk.masteryScore}%
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-white bg-pink-500 px-3 py-1 rounded-full shadow-xs">
                      Luyện ngay
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
