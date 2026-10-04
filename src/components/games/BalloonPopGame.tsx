import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Star, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { Question } from '../../types';
import { generateQuestion } from '../../learning-engine/questionGenerator';
import { sound } from '../../services/sound';
import { storage } from '../../services/storage';

interface BalloonPopGameProps {
  onBack: () => void;
  onFinished: (stars: number) => void;
}

const BALLOON_COLORS = [
  'bg-linear-to-b from-pink-400 to-rose-500 border-pink-300 text-white',
  'bg-linear-to-b from-sky-400 to-blue-500 border-sky-300 text-white',
  'bg-linear-to-b from-amber-300 to-amber-500 border-amber-200 text-white',
  'bg-linear-to-b from-emerald-400 to-teal-500 border-emerald-300 text-white',
];

export const BalloonPopGame: React.FC<BalloonPopGameProps> = ({ onBack, onFinished }) => {
  const [question, setQuestion] = useState<Question>(() => generateQuestion('addition10', 1));
  const [score, setScore] = useState(0);
  const [poppedId, setPoppedId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handlePop = (option: number | string, idx: number) => {
    const isCorrect = String(option).trim() === String(question.correctAnswer).trim();

    if (isCorrect) {
      sound.playBalloonPop();
      sound.playCorrect();
      setPoppedId(idx);
      const newScore = score + 1;
      setScore(newScore);
      storage.addStars(1);
      storage.unlockSticker('st_balloon');

      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      setFeedback('BÙM! Đúng rồi Minh An! +1 ⭐');
      sound.speak('Đúng rồi Minh An!');

      setTimeout(() => {
        setPoppedId(null);
        setFeedback(null);
        // Next problem
        const skills: Array<'addition10' | 'subtraction10' | 'counting'> = [
          'addition10',
          'subtraction10',
          'counting',
        ];
        const nextSkill = skills[Math.floor(Math.random() * skills.length)];
        setQuestion(generateQuestion(nextSkill, 1));
      }, 1200);
    } else {
      sound.playTryAgain();
      setFeedback('Chưa trúng rồi, bé chọn bóng khác nhé! 🎈');
      sound.speak('Chưa trúng rồi, con chọn bóng khác nhé!');
      setTimeout(() => setFeedback(null), 1400);
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

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-900 px-3 py-1.5 rounded-full text-sm font-extrabold shadow-xs">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Điểm: {score}</span>
          </div>
        </div>
      </div>

      {/* Game Card */}
      <div className="bg-linear-to-b from-sky-100/70 via-pink-50 to-white rounded-3xl border-2 border-sky-200 p-5 sm:p-7 shadow-lg text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1 px-3.5 py-1 bg-white/90 border border-sky-200 rounded-full text-xs font-black text-sky-700 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>BẮN BÓNG TOÁN HỌC</span>
        </div>

        {/* Question Header */}
        <div className="bg-white rounded-2xl p-4 border-2 border-sky-100 shadow-sm max-w-sm mx-auto mb-6">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {question.questionText}
            </h2>
            <button
              onClick={() => sound.speak(question.questionText)}
              className="p-2 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className="mb-4 text-sm font-extrabold text-pink-700 bg-pink-100/90 py-2 px-4 rounded-full inline-block border border-pink-200 animate-bounce">
            {feedback}
          </div>
        )}

        {/* 4 Floating Balloons */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-sm mx-auto my-4">
          {question.options.map((opt, idx) => {
            const isPopped = poppedId === idx;
            const colorClass = BALLOON_COLORS[idx % BALLOON_COLORS.length];

            return (
              <button
                key={idx}
                id={`btn-balloon-${idx}`}
                onClick={() => handlePop(opt, idx)}
                disabled={poppedId !== null}
                className={`relative flex flex-col items-center justify-center transition-all duration-300 transform active:scale-90 select-none ${
                  isPopped ? 'scale-0 opacity-0' : 'hover:scale-105 animate-pulse'
                }`}
              >
                {/* Balloon Body */}
                <div
                  className={`w-24 h-28 sm:w-28 sm:h-32 rounded-[50%/60%_60%_40%_40%] shadow-lg border-2 flex items-center justify-center font-black text-3xl sm:text-4xl filter drop-shadow-md cursor-pointer ${colorClass}`}
                >
                  <span className="drop-shadow-xs">{opt}</span>
                </div>
                {/* Balloon knot & string */}
                <div className="w-3 h-2 bg-slate-400 rounded-xs -mt-0.5" />
                <div className="w-0.5 h-6 bg-slate-300" />
              </button>
            );
          })}
        </div>

        <p className="text-xs font-bold text-sky-600 mt-4">
          🎈 Chạm vào quả bóng có đáp án đúng để làm bóng nổ nhé!
        </p>
      </div>
    </div>
  );
};
