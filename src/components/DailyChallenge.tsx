import React, { useState } from 'react';
import { ArrowLeft, Star, Trophy, Sparkles, Home, RotateCcw } from 'lucide-react';
import { Question, SkillId } from '../types';
import { generateQuestion } from '../learning-engine/questionGenerator';
import { QuestionCard } from './QuestionCard';
import { sound } from '../services/sound';
import { storage } from '../services/storage';

interface DailyChallengeProps {
  onBack: () => void;
  onFinished: () => void;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ onBack, onFinished }) => {
  const TOTAL_QUESTIONS = 5;
  const [questions] = useState<Question[]>(() => {
    const allSkillPool: SkillId[][] = [
      ['counting', 'addition10', 'subtraction10'], // Math basic
      ['englishLetters', 'englishVocabulary', 'englishColorsNumbers'], // English
      ['vietnameseLetters', 'vietnameseRhymes', 'vietnameseReading'], // Vietnamese
      ['comparison', 'numberSequence', 'wordProblems'], // Math advanced
      ['englishVocabulary', 'vietnameseReading', 'englishColorsNumbers'], // Language wrap-up
    ];

    return allSkillPool.map((pool) => {
      const randomSkill = pool[Math.floor(Math.random() * pool.length)];
      return generateQuestion(randomSkill, 1);
    });
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleCorrect = (answer: string | number) => {
    const q = questions[currentIndex];
    storage.recordAttempt({
      id: `att_${Date.now()}`,
      timestamp: new Date().toISOString(),
      skillId: q.skillId,
      questionText: q.questionText,
      studentAnswer: answer,
      correctAnswer: q.correctAnswer,
      isCorrect: true,
      responseTimeMs: 2500,
    });

    setCorrectCount((prev) => prev + 1);
    goToNext();
  };

  const handleWrong = (wrongAnswer: string | number) => {
    const q = questions[currentIndex];
    storage.recordAttempt({
      id: `att_${Date.now()}`,
      timestamp: new Date().toISOString(),
      skillId: q.skillId,
      questionText: q.questionText,
      studentAnswer: wrongAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect: false,
      mistakeType: 'calculationError',
      responseTimeMs: 3500,
    });
  };

  const goToNext = () => {
    if (currentIndex + 1 >= TOTAL_QUESTIONS) {
      storage.addStars(5);
      storage.checkDailyStreak();
      storage.unlockSticker('st_trophy');
      setIsCompleted(true);
      sound.playVictory();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 py-4">
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

        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3.5 py-1.5 rounded-full text-sm font-black shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>🌟 THỬ THÁCH HÔM NAY</span>
        </div>
      </div>

      {!isCompleted ? (
        <QuestionCard
          question={questions[currentIndex]}
          mascot="bunny"
          questionIndex={currentIndex}
          totalQuestions={TOTAL_QUESTIONS}
          onCorrectAnswer={handleCorrect}
          onWrongAnswer={handleWrong}
        />
      ) : (
        <div className="bg-white rounded-3xl border-3 border-amber-200 p-6 sm:p-8 text-center shadow-xl animate-in fade-in">
          <div className="text-6xl mb-3 animate-bounce">🏆🎉🌸</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
            XUẤT SẮC QUÁ MINH AN!
          </h2>
          <p className="text-slate-600 font-extrabold text-base sm:text-lg mb-4">
            Minh An đã làm đúng {correctCount}/{TOTAL_QUESTIONS} câu hỏi thử thách!
          </p>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 max-w-md mx-auto mb-6 text-left">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Lời nhận xét từ Cô giáo AI & Thỏ Bông:</span>
            </div>
            <p className="text-slate-700 text-xs sm:text-sm font-semibold leading-relaxed">
              &ldquo;Hôm nay phép cộng và đếm số của Minh An rất tự tin và chính xác. Ngày mai chúng
              mình cùng luyện thêm một chút phép trừ nhé! Bé nhớ nhận sao để đổi quà trong Kho báu
              nha!&rdquo;
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-100 border border-amber-300 rounded-full text-amber-900 font-black text-lg mb-6 shadow-xs">
            <Star className="w-6 h-6 text-amber-500 fill-amber-400 animate-spin" />
            <span>NHẬN THƯỞNG +5 NGÔI SAO!</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                sound.playPop();
                onFinished();
              }}
              className="py-3.5 px-6 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-base shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
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
