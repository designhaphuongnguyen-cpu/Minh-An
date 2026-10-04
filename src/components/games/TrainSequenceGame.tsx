import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Star, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { generateQuestion } from '../../learning-engine/questionGenerator';
import { sound } from '../../services/sound';
import { storage } from '../../services/storage';

interface TrainSequenceGameProps {
  onBack: () => void;
  onFinished: (stars: number) => void;
}

export const TrainSequenceGame: React.FC<TrainSequenceGameProps> = ({ onBack, onFinished }) => {
  const [question, setQuestion] = useState(() => generateQuestion('numberSequence', 1));
  const [score, setScore] = useState(0);
  const [isTrainMoving, setIsTrainMoving] = useState(false);
  const [chosenAnswer, setChosenAnswer] = useState<number | string | null>(null);

  const handleSelectNumber = (num: number | string) => {
    const isCorrect = String(num).trim() === String(question.correctAnswer).trim();

    if (isCorrect) {
      setChosenAnswer(num);
      sound.playCorrect();
      setIsTrainMoving(true);
      const newScore = score + 1;
      setScore(newScore);
      storage.addStars(1);
      storage.unlockSticker('st_train');

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      sound.speak(`Tu tu xình xịch! Đúng rồi Minh An! Toa số ${num} đã vào chỗ.`);

      setTimeout(() => {
        setIsTrainMoving(false);
        setChosenAnswer(null);
        setQuestion(generateQuestion('numberSequence', 1));
      }, 2000);
    } else {
      sound.playTryAgain();
      sound.speak('Gần đúng rồi, Minh An chọn toa khác nhé!');
    }
  };

  const sequence = question.visualData.sequence || [1, 2, '?', 4, 5];

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

      <div className="bg-white rounded-3xl border-2 border-sky-200 p-5 sm:p-7 shadow-lg text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1 px-3.5 py-1 bg-sky-50 border border-sky-200 rounded-full text-xs font-black text-sky-700 mb-4 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>ĐOÀN TÀU SỐ HỌC</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">
          Chọn số còn thiếu để đoàn tàu lăn bánh nhé!
        </h2>

        {/* Choo Choo Train Display */}
        <div className="my-6 p-4 bg-sky-50/70 rounded-3xl border-2 border-sky-100 overflow-hidden relative">
          <div
            className={`flex items-center justify-center gap-2 transition-transform duration-1000 ${
              isTrainMoving ? 'translate-x-full opacity-60' : 'translate-x-0'
            }`}
          >
            {/* Locomotive */}
            <div className="w-14 h-14 bg-sky-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">
              🚂
            </div>

            {/* Carriages */}
            {sequence.map((val, idx) => {
              const isMissing = val === '?';
              const displayVal = isMissing && chosenAnswer !== null ? chosenAnswer : val;

              return (
                <div
                  key={idx}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl border-2 shadow-xs transition-all ${
                    isMissing
                      ? chosenAnswer !== null
                        ? 'bg-emerald-400 border-emerald-500 text-white animate-bounce'
                        : 'bg-amber-100 border-dashed border-amber-500 text-amber-800 animate-pulse'
                      : 'bg-white border-sky-300 text-sky-900'
                  }`}
                >
                  {displayVal}
                </div>
              );
            })}
          </div>

          {/* Railway Tracks */}
          <div className="mt-3 flex items-center justify-center gap-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-4 h-1.5 bg-slate-300 rounded-full" />
            ))}
          </div>
        </div>

        {/* Number Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md mx-auto my-4">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              id={`btn-train-opt-${idx}`}
              onClick={() => handleSelectNumber(opt)}
              disabled={isTrainMoving}
              className="py-3 px-4 rounded-2xl bg-white hover:bg-sky-50 border-2 border-sky-300 text-slate-800 font-black text-2xl shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>

        <p className="text-xs font-bold text-sky-600 mt-2">
          🚂 Giúp đoàn tàu tìm đúng toa số nhé Minh An!
        </p>
      </div>
    </div>
  );
};
