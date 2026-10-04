import React, { useState } from 'react';
import { Volume2, Lightbulb, Sparkles, RefreshCw } from 'lucide-react';
import { MascotType, Question } from '../types';
import { VisualMathRenderer } from './VisualMathRenderer';
import { HintModal } from './HintModal';
import { MASCOTS } from '../data/initialData';
import { sound } from '../services/sound';

interface QuestionCardProps {
  question: Question;
  mascot: MascotType;
  questionIndex: number;
  totalQuestions: number;
  onCorrectAnswer: (answer: string | number) => void;
  onWrongAnswer: (wrongAnswer: string | number, mistakeCount: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  mascot,
  questionIndex,
  totalQuestions,
  onCorrectAnswer,
  onWrongAnswer,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  const mascotInfo = MASCOTS[mascot] || MASCOTS.bunny;

  const handleSpeakQuestion = () => {
    sound.speak(question.questionText);
  };

  const handleSelectOption = (option: string | number) => {
    if (isAnswering) return;
    setSelectedAnswer(option);
    setIsAnswering(true);

    const isCorrect = String(option).trim() === String(question.correctAnswer).trim();

    if (isCorrect) {
      sound.playCorrect();
      setFeedbackMessage(`Đúng rồi Minh An! ${question.explanation}`);
      setTimeout(() => {
        onCorrectAnswer(option);
        setIsAnswering(false);
        setSelectedAnswer(null);
        setFeedbackMessage(null);
        setMistakeCount(0);
      }, 1400);
    } else {
      const nextMistakes = mistakeCount + 1;
      setMistakeCount(nextMistakes);
      sound.playTryAgain();
      onWrongAnswer(option, nextMistakes);

      if (nextMistakes === 1) {
        const msg = `Gần đúng rồi Minh An ơi. Con thử bấm lại lần nữa nhé! 🌸`;
        setFeedbackMessage(msg);
        sound.speak(msg);
      } else if (nextMistakes === 2) {
        const msg = `${mascotInfo.name} gợi ý cho Minh An nhé! Hãy nhìn kỹ hình vẽ hoặc bấm bóng đèn gợi ý nha!`;
        setFeedbackMessage(msg);
        sound.speak(msg);
      } else {
        const msg = `${question.hint3}`;
        setFeedbackMessage(msg);
        sound.speak(msg);
      }

      setTimeout(() => {
        setIsAnswering(false);
        setSelectedAnswer(null);
      }, 1600);
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-pink-100 shadow-lg p-4 sm:p-7 max-w-xl mx-auto relative overflow-hidden">
      {/* Progress Bar & Question Counter */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-extrabold text-pink-600 bg-pink-50 border border-pink-200 px-3.5 py-1 rounded-full">
            Câu {questionIndex + 1}/{totalQuestions}
          </span>
          {question.title && (
            <span className="text-xs text-gray-500 font-bold hidden sm:inline">
              {question.title}
            </span>
          )}
        </div>

        {/* Question Progress Bar */}
        <div className="flex-1 max-w-[140px] sm:max-w-[180px] bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-pink-400 to-purple-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${((questionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Text & Audio Button */}
      <div className="bg-pink-50/50 rounded-2xl p-4 sm:p-5 border border-pink-100 mb-3 flex items-start justify-between gap-3">
        <h2 className="font-extrabold text-[#4A4A4A] text-base sm:text-xl leading-relaxed tracking-tight flex-1">
          {question.questionText}
        </h2>

        <button
          id="btn-speak-question"
          onClick={handleSpeakQuestion}
          className="p-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-xs shrink-0 active:scale-90 transition-transform cursor-pointer"
          title="Nghe cô đọc câu hỏi"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Visual Math Graphic */}
      <VisualMathRenderer question={question} />

      {/* Encouraging Feedback Message (Soft & Warm) */}
      {feedbackMessage && (
        <div
          className={`my-3 p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in transition-all ${
            feedbackMessage.includes('Đúng rồi')
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-amber-50 text-amber-900 border border-amber-200'
          }`}
        >
          <span className="text-xl shrink-0">
            {feedbackMessage.includes('Đúng rồi') ? '🎉' : '💡'}
          </span>
          <p className="flex-1">{feedbackMessage}</p>
        </div>
      )}

      {/* 4 Big High-Contrast Touch Answer Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 my-4">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = String(option).trim() === String(question.correctAnswer).trim();

          let btnStyles = 'bg-white hover:bg-pink-50/60 border-2 border-pink-200 text-[#4A4A4A]';

          if (isSelected) {
            if (isCorrect) {
              btnStyles = 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-md scale-98';
            } else {
              btnStyles = 'bg-amber-100 text-amber-900 border-2 border-amber-400';
            }
          }

          return (
            <button
              key={idx}
              id={`btn-option-${idx}`}
              onClick={() => handleSelectOption(option)}
              disabled={isAnswering}
              className={`min-h-[58px] sm:min-h-[68px] rounded-2xl font-black text-xl sm:text-2xl shadow-xs transition-all active:scale-95 flex items-center justify-center cursor-pointer select-none px-4 ${btnStyles}`}
            >
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom helper: "Con chưa hiểu" Button */}
      <div className="mt-4 pt-3 border-t border-pink-100 flex items-center justify-between">
        <button
          id="btn-open-hint"
          onClick={() => {
            sound.playPop();
            setIsHintOpen(true);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs sm:text-sm border border-amber-200 active:scale-95 transition-all cursor-pointer"
        >
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Con chưa hiểu 💡</span>
        </button>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Học cùng {mascotInfo.name}</span>
        </div>
      </div>

      {/* Hint Modal */}
      <HintModal
        question={question}
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
      />
    </div>
  );
};
