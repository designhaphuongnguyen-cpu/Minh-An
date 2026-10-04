import React, { useState } from 'react';
import { ArrowLeft, Star, Sparkles, Trophy, Gift, Home, Play, ArrowRight } from 'lucide-react';
import { ChildProfile, Question, SkillId } from '../types';
import { generateQuestion } from '../learning-engine/questionGenerator';
import { QuestionCard } from './QuestionCard';
import { RabbitCarrotGame } from './games/RabbitCarrotGame';
import { sound } from '../services/sound';
import { storage } from '../services/storage';
import { MASCOTS } from '../data/initialData';

interface TodayLessonProps {
  profile: ChildProfile;
  onBack: () => void;
  onGoTreasure: () => void;
  onGoHome: () => void;
}

type SessionPhase = 'overview' | 'warmup' | 'core' | 'consolidation' | 'game' | 'summary';

export const TodayLesson: React.FC<TodayLessonProps> = ({
  profile,
  onBack,
  onGoTreasure,
  onGoHome,
}) => {
  const [phase, setPhase] = useState<SessionPhase>('overview');
  const [earnedStarsSession, setEarnedStarsSession] = useState(0);
  const [correctAnswersSession, setCorrectAnswersSession] = useState(0);

  // Phase questions
  const [warmupQuestions] = useState<Question[]>(() => [
    generateQuestion('counting', 1),
    generateQuestion('counting', 1),
  ]);
  const [coreQuestions] = useState<Question[]>(() => [
    generateQuestion('subtraction10', 1),
    generateQuestion('subtraction10', 1),
    generateQuestion('subtraction10', 2),
    generateQuestion('addition10', 1),
    generateQuestion('addition10', 2),
  ]);
  const [consolidationQuestions] = useState<Question[]>(() => [
    generateQuestion('comparison', 1),
    generateQuestion('wordProblems', 1),
    generateQuestion('numberSequence', 1),
  ]);

  const [questionIdx, setQuestionIdx] = useState(0);
  const mascotInfo = MASCOTS[profile.mascot] || MASCOTS.bunny;

  const handleStartSession = () => {
    sound.playPop();
    sound.playStar();
    setPhase('warmup');
    setQuestionIdx(0);
  };

  const handleCorrect = (answer: string | number) => {
    setEarnedStarsSession((prev) => prev + 1);
    setCorrectAnswersSession((prev) => prev + 1);
    storage.addStars(1);

    const curQ = getCurrentQuestion();
    if (curQ) {
      storage.recordAttempt({
        id: `att_${Date.now()}`,
        timestamp: new Date().toISOString(),
        skillId: curQ.skillId,
        questionText: curQ.questionText,
        studentAnswer: answer,
        correctAnswer: curQ.correctAnswer,
        isCorrect: true,
        responseTimeMs: 2500,
      });
    }

    // Move next
    if (phase === 'warmup') {
      if (questionIdx + 1 < warmupQuestions.length) {
        setQuestionIdx((prev) => prev + 1);
      } else {
        setPhase('core');
        setQuestionIdx(0);
        sound.speak('Minh An hoàn thành khởi động rất tốt! Giờ chúng mình vào bài học chính nhé!');
      }
    } else if (phase === 'core') {
      if (questionIdx + 1 < coreQuestions.length) {
        setQuestionIdx((prev) => prev + 1);
      } else {
        setPhase('consolidation');
        setQuestionIdx(0);
        sound.speak('Tuyệt vời! Chúng mình cùng củng cố thêm 3 câu nhé!');
      }
    } else if (phase === 'consolidation') {
      if (questionIdx + 1 < consolidationQuestions.length) {
        setQuestionIdx((prev) => prev + 1);
      } else {
        setPhase('game');
        sound.speak('Hoan hô Minh An! Giờ đến phần Chơi Toán cùng Thỏ Bông nhé!');
      }
    }
  };

  const handleWrong = (wrongAnswer: string | number) => {
    const curQ = getCurrentQuestion();
    if (curQ) {
      storage.recordAttempt({
        id: `att_${Date.now()}`,
        timestamp: new Date().toISOString(),
        skillId: curQ.skillId,
        questionText: curQ.questionText,
        studentAnswer: wrongAnswer,
        correctAnswer: curQ.correctAnswer,
        isCorrect: false,
        mistakeType: 'calculationError',
        responseTimeMs: 3500,
      });
    }
  };

  const getCurrentQuestion = (): Question | null => {
    if (phase === 'warmup') return warmupQuestions[questionIdx];
    if (phase === 'core') return coreQuestions[questionIdx];
    if (phase === 'consolidation') return consolidationQuestions[questionIdx];
    return null;
  };

  const handleGameFinished = (extraStars: number) => {
    setEarnedStarsSession((prev) => prev + extraStars);
    storage.checkDailyStreak();
    storage.unlockSticker('st_star');
    setPhase('summary');
    sound.playVictory();
  };

  return (
    <div className="max-w-2xl mx-auto px-3 py-4">
      {/* Top Bar */}
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

        <div className="flex items-center gap-1.5 bg-rose-100 border border-rose-200 text-rose-800 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>HÔM NAY MINH AN HỌC GÌ?</span>
        </div>
      </div>

      {/* 1. OVERVIEW SCREEN (Plan designed for today) */}
      {phase === 'overview' && (
        <div className="bg-white rounded-[32px] border border-pink-100 p-6 sm:p-8 shadow-xl text-center relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-pink-50 border border-pink-200 rounded-full text-xs font-black text-pink-600 mb-3">
            <span>KẾ HOẠCH HỌC TẬP 10–15 PHÚT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#4A4A4A] tracking-tight mb-2">
            Hôm nay Minh An học gì cùng {mascotInfo.name}? 🌸
          </h2>
          <p className="text-gray-500 font-medium text-xs sm:text-sm mb-6">
            Thiết kế lộ trình nhẹ nhàng, trực quan dựa trên sự tiến bộ của bé:
          </p>

          {/* Schedule Modules */}
          <div className="space-y-3 max-w-md mx-auto mb-6 text-left">
            {/* Step 1 */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFF5F7] border border-[#FED7E2]">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔢</span>
                <div>
                  <div className="text-xs font-bold text-pink-600">Khởi động (2 phút)</div>
                  <div className="font-extrabold text-[#4A4A4A] text-sm">Đếm số & Nhận biết</div>
                </div>
              </div>
              <span className="text-xs font-bold bg-white px-2.5 py-1 rounded-full border border-pink-200 text-pink-700">
                2 câu
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF5FF] border border-[#E9D8FD]">
              <div className="flex items-center gap-3">
                <span className="text-3xl">➖</span>
                <div>
                  <div className="text-xs font-bold text-purple-600">Học chính (5 phút)</div>
                  <div className="font-extrabold text-[#4A4A4A] text-sm">Phép trừ phạm vi 10</div>
                </div>
              </div>
              <span className="text-xs font-bold bg-white px-2.5 py-1 rounded-full border border-purple-200 text-purple-700">
                5 câu
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FFFBEB] border border-[#FEFCBF]">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🐰</span>
                <div>
                  <div className="text-xs font-bold text-amber-600">Chơi Toán (3 phút)</div>
                  <div className="font-extrabold text-[#4A4A4A] text-sm">Giúp Thỏ tìm cà rốt</div>
                </div>
              </div>
              <span className="text-xs font-bold bg-white px-2.5 py-1 rounded-full border border-amber-200 text-amber-700">
                1 Game
              </span>
            </div>

            {/* Goal */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#E6FFFA] border border-[#B2F5EA]">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⭐</span>
                <div>
                  <div className="text-xs font-bold text-teal-600">Mục tiêu hôm nay</div>
                  <div className="font-extrabold text-[#4A4A4A] text-sm">Kiếm 5–8 ngôi sao</div>
                </div>
              </div>
              <span className="text-xs font-bold bg-teal-500 text-white px-2.5 py-1 rounded-full">
                Sắp đạt
              </span>
            </div>
          </div>

          <button
            id="btn-start-today-session"
            onClick={handleStartSession}
            className="w-full max-w-md py-4 px-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-black text-lg sm:text-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <Play className="w-6 h-6 fill-white" />
            <span>MINH AN BẮT ĐẦU</span>
          </button>
        </div>
      )}

      {/* 2. WARMUP, CORE & CONSOLIDATION QUESTIONS */}
      {(phase === 'warmup' || phase === 'core' || phase === 'consolidation') && (
        <div>
          {/* Phase Badge */}
          <div className="text-center mb-3">
            <span className="inline-block text-xs font-extrabold px-3 py-1 rounded-full bg-pink-100 text-pink-700 border border-pink-200 shadow-2xs">
              {phase === 'warmup' && '🔥 Phần 1: Khởi động đếm số'}
              {phase === 'core' && '📚 Phần 2: Học chính (Phép tính trực quan)'}
              {phase === 'consolidation' && '✨ Phần 3: Củng cố & Bài toán lời văn'}
            </span>
          </div>

          {getCurrentQuestion() && (
            <QuestionCard
              question={getCurrentQuestion()!}
              mascot={profile.mascot}
              questionIndex={questionIdx}
              totalQuestions={
                phase === 'warmup'
                  ? warmupQuestions.length
                  : phase === 'core'
                  ? coreQuestions.length
                  : consolidationQuestions.length
              }
              onCorrectAnswer={handleCorrect}
              onWrongAnswer={handleWrong}
            />
          )}
        </div>
      )}

      {/* 3. GAME PHASE */}
      {phase === 'game' && (
        <RabbitCarrotGame
          onBack={() => setPhase('overview')}
          onFinished={handleGameFinished}
        />
      )}

      {/* 4. SUMMARY SCREEN */}
      {phase === 'summary' && (
        <div className="bg-white rounded-[32px] border border-pink-100 p-6 sm:p-8 text-center shadow-xl animate-in fade-in">
          <div className="text-6xl sm:text-7xl mb-3 animate-bounce">🎉🌸🐰</div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#4A4A4A] mb-2">
            MINH AN HOÀN THÀNH XUẤT SẮC!
          </h2>
          <p className="text-gray-500 font-bold text-sm sm:text-base mb-6">
            Hôm nay Minh An đã học rất chăm chỉ và thông minh!
          </p>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-6">
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
              <div className="text-2xl mb-1">⭐</div>
              <div className="text-lg font-black text-amber-600">+{earnedStarsSession + 5} Sao</div>
              <div className="text-[11px] text-gray-500 font-bold">Thưởng hôm nay</div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <div className="text-2xl mb-1">✅</div>
              <div className="text-lg font-black text-emerald-600">{correctAnswersSession + 5} câu</div>
              <div className="text-[11px] text-gray-500 font-bold">Làm chính xác</div>
            </div>

            <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 text-center">
              <div className="text-2xl mb-1">🔥</div>
              <div className="text-lg font-black text-orange-600">{profile.streak} ngày</div>
              <div className="text-[11px] text-gray-500 font-bold">Học liên tiếp</div>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-center">
              <div className="text-2xl mb-1">💪</div>
              <div className="text-lg font-black text-purple-600">Tiến bộ</div>
              <div className="text-[11px] text-gray-500 font-bold">Phép trừ & cộng</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <button
              onClick={() => {
                sound.playPop();
                onGoTreasure();
              }}
              className="py-3.5 px-6 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-base shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Gift className="w-5 h-5" />
              <span>NHẬN QUÀ & ĐỔI SAO</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                onGoHome();
              }}
              className="py-3.5 px-6 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-black text-base shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span>VỀ TRANG CHỦ</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
