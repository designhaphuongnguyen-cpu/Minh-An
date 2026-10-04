import React, { useState } from 'react';
import { ArrowLeft, Star, Sparkles, Trophy } from 'lucide-react';
import { Question } from '../../types';
import { generateQuestion } from '../../learning-engine/questionGenerator';
import { QuestionCard } from '../QuestionCard';
import { CelebrationModal } from '../CelebrationModal';
import { sound } from '../../services/sound';
import { storage } from '../../services/storage';

interface RabbitCarrotGameProps {
  onBack: () => void;
  onFinished: (stars: number) => void;
}

export const RabbitCarrotGame: React.FC<RabbitCarrotGameProps> = ({ onBack, onFinished }) => {
  const TOTAL_STEPS = 5;
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() =>
    generateQuestion('addition10', 1)
  );
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleCorrectAnswer = () => {
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    storage.recordAttempt({
      id: `att_${Date.now()}`,
      timestamp: new Date().toISOString(),
      skillId: currentQuestion.skillId,
      questionText: currentQuestion.questionText,
      studentAnswer: currentQuestion.correctAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: true,
      responseTimeMs: 2500,
    });

    if (nextStep >= TOTAL_STEPS) {
      storage.addStars(5);
      storage.unlockSticker('st_bunny');
      setIsGameOver(true);
      sound.playVictory();
    } else {
      setIsCelebrationOpen(true);
    }
  };

  const handleWrongAnswer = (wrongAnswer: string | number) => {
    storage.recordAttempt({
      id: `att_${Date.now()}`,
      timestamp: new Date().toISOString(),
      skillId: currentQuestion.skillId,
      questionText: currentQuestion.questionText,
      studentAnswer: wrongAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: false,
      mistakeType: 'calculationError',
      responseTimeMs: 3000,
    });
  };

  const handleNextQuestion = () => {
    setIsCelebrationOpen(false);
    // Cycle between skills
    const skills: Array<'addition10' | 'subtraction10' | 'counting'> = [
      'addition10',
      'subtraction10',
      'counting',
    ];
    const skill = skills[currentStep % skills.length];
    setCurrentQuestion(generateQuestion(skill, 1));
  };

  return (
    <div className="max-w-2xl mx-auto px-3 py-4">
      {/* Top Navigation */}
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

        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-sm font-extrabold shadow-xs">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>Thưởng +5 ⭐ khi về đích</span>
        </div>
      </div>

      {/* Rabbit Carrot Hop Track */}
      <div className="bg-white rounded-3xl border-2 border-emerald-200 p-4 sm:p-5 shadow-md mb-6">
        <div className="flex items-center justify-between text-xs font-black text-slate-600 mb-2">
          <span>🐰 Thỏ Bông</span>
          <span className="text-emerald-700">Bước {currentStep}/{TOTAL_STEPS}</span>
          <span>🥕 Cà rốt giòn</span>
        </div>

        {/* Path Bar */}
        <div className="relative bg-emerald-50 h-16 sm:h-20 rounded-2xl border-2 border-emerald-100 flex items-center justify-between px-3 sm:px-6 overflow-hidden">
          {/* Track stones */}
          {Array.from({ length: TOTAL_STEPS + 1 }).map((_, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-xs sm:text-sm border-2 transition-all ${
                idx <= currentStep
                  ? 'bg-emerald-400 border-emerald-500 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              {idx === TOTAL_STEPS ? '🥕' : idx}
            </div>
          ))}

          {/* Animated Bunny */}
          <div
            className="absolute top-2 transition-all duration-700 ease-out text-3xl sm:text-4xl filter drop-shadow-md"
            style={{
              left: `calc(${(currentStep / TOTAL_STEPS) * 82}% + 10px)`,
            }}
          >
            <span className="inline-block animate-bounce">🐰</span>
          </div>
        </div>
      </div>

      {/* Game Content */}
      {!isGameOver ? (
        <QuestionCard
          question={currentQuestion}
          mascot="bunny"
          questionIndex={currentStep}
          totalQuestions={TOTAL_STEPS}
          onCorrectAnswer={handleCorrectAnswer}
          onWrongAnswer={handleWrongAnswer}
        />
      ) : (
        <div className="bg-white rounded-3xl border-3 border-emerald-200 p-6 sm:p-8 text-center shadow-xl animate-in fade-in">
          <div className="text-6xl mb-3 animate-bounce">🐰🥕✨</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-2">
            HOAN HÔ MINH AN!
          </h2>
          <p className="text-slate-600 font-bold text-base mb-4">
            Minh An đã giúp Thỏ Bông nhảy qua {TOTAL_STEPS} thử thách để thưởng thức củ cà rốt ngon
            lành!
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-100 border border-amber-300 rounded-full text-amber-800 font-black text-lg mb-6 shadow-xs">
            <Trophy className="w-6 h-6 text-amber-500 fill-amber-400" />
            <span>NHẬN +5 NGÔI SAO!</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                sound.playPop();
                onFinished(5);
              }}
              className="py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-base shadow-md active:scale-95 transition-all"
            >
              VỀ TRANG CHỦ
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setCurrentStep(0);
                setIsGameOver(false);
                setCurrentQuestion(generateQuestion('addition10', 1));
              }}
              className="py-3.5 px-6 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-base border border-rose-200 active:scale-95 transition-all"
            >
              CHƠI LẠI MÀN NÀY
            </button>
          </div>
        </div>
      )}

      {/* Interstitial Celebration */}
      <CelebrationModal
        isOpen={isCelebrationOpen}
        earnedStars={1}
        mascot="bunny"
        title="Thỏ Bông Nhảy Thêm 1 Bước! 🐰"
        message="Minh An giỏi quá, chỉ còn một chút nữa là Thỏ tới củ cà rốt rồi!"
        onNext={handleNextQuestion}
      />
    </div>
  );
};
