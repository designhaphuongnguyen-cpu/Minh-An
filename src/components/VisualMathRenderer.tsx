import React, { useState } from 'react';
import { Volume2, Sparkles, BookOpen } from 'lucide-react';
import { Question } from '../types';
import { sound } from '../services/sound';

interface VisualMathRendererProps {
  question: Question;
  interactiveCount?: boolean;
}

export const VisualMathRenderer: React.FC<VisualMathRendererProps> = ({
  question,
  interactiveCount = true,
}) => {
  const { visualType, visualData } = question;
  const [countedItems, setCountedItems] = useState<Record<number, boolean>>({});

  const handleTapItem = (index: number) => {
    if (!interactiveCount) return;
    sound.playPop();
    setCountedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  switch (visualType) {
    // 1. Counting objects
    case 'item-count': {
      const items = visualData.itemsA || [];
      return (
        <div className="my-3 p-4 sm:p-5 bg-rose-50/70 border-2 border-rose-100 rounded-3xl">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            {items.map((emoji, idx) => {
              const isCounted = countedItems[idx];
              return (
                <button
                  key={idx}
                  onClick={() => handleTapItem(idx)}
                  className={`relative p-2 sm:p-3 text-3xl sm:text-4xl rounded-2xl transition-all duration-200 cursor-pointer transform active:scale-90 ${
                    isCounted
                      ? 'bg-amber-200 border-2 border-amber-400 scale-105 shadow-xs'
                      : 'bg-white border-2 border-rose-200/80 hover:scale-105 shadow-xs'
                  }`}
                  title="Chạm để đếm"
                >
                  <span className="filter drop-shadow-xs">{emoji}</span>
                  {isCounted && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      {idx + 1}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-center text-xs text-rose-500 font-semibold mt-3">
            💡 Bé chạm vào từng hình để đếm cho dễ nhé!
          </p>
        </div>
      );
    }

    // 2. Visual Addition
    case 'item-addition': {
      const itemsA = visualData.itemsA || [];
      const itemsB = visualData.itemsB || [];
      const countA = visualData.countA || itemsA.length;
      const countB = visualData.countB || itemsB.length;
      const emoji = visualData.emoji || '🍓';

      return (
        <div className="my-3 p-4 sm:p-5 bg-indigo-50/60 border-2 border-indigo-100 rounded-3xl">
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
            {/* Box A */}
            <div className="bg-white border-2 border-indigo-200 rounded-2xl p-2.5 sm:p-3.5 shadow-xs text-center min-w-[90px] sm:min-w-[120px]">
              <div className="flex flex-wrap gap-1.5 justify-center mb-1 max-w-[100px]">
                {itemsA.map((it, idx) => (
                  <span key={idx} className="text-2xl sm:text-3xl">
                    {it}
                  </span>
                ))}
              </div>
              <span className="font-black text-lg text-indigo-700">{countA}</span>
            </div>

            {/* Plus Operator */}
            <div className="w-9 h-9 rounded-full bg-indigo-500 text-white font-black text-xl flex items-center justify-center shadow-sm">
              +
            </div>

            {/* Box B */}
            <div className="bg-white border-2 border-indigo-200 rounded-2xl p-2.5 sm:p-3.5 shadow-xs text-center min-w-[90px] sm:min-w-[120px]">
              <div className="flex flex-wrap gap-1.5 justify-center mb-1 max-w-[100px]">
                {itemsB.map((it, idx) => (
                  <span key={idx} className="text-2xl sm:text-3xl">
                    {it}
                  </span>
                ))}
              </div>
              <span className="font-black text-lg text-indigo-700">
                {visualData.itemsB?.[0] === '❓' ? '?' : countB}
              </span>
            </div>

            {/* Equal Operator */}
            <div className="w-9 h-9 rounded-full bg-slate-400 text-white font-black text-xl flex items-center justify-center">
              =
            </div>

            {/* Question Mark Box */}
            <div className="bg-amber-100 border-2 border-dashed border-amber-400 rounded-2xl p-3 min-w-[65px] h-[75px] flex items-center justify-center shadow-xs">
              <span className="text-2xl font-black text-amber-700">?</span>
            </div>
          </div>
        </div>
      );
    }

    // 3. Visual Subtraction with Struck Items
    case 'item-subtraction': {
      const countA = visualData.countA || 5;
      const sub = visualData.subtractedCount || 2;
      const emoji = visualData.emoji || '🍓';

      return (
        <div className="my-3 p-4 sm:p-5 bg-rose-50/60 border-2 border-rose-100 rounded-3xl text-center">
          <p className="text-xs font-bold text-slate-500 mb-2">
            Có {countA} {emoji}, bớt đi {sub} {emoji} bị gạch chéo:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-md mx-auto">
            {Array.from({ length: countA }).map((_, idx) => {
              const isSubtracted = idx >= countA - sub;
              return (
                <div
                  key={idx}
                  className={`relative p-2.5 rounded-2xl text-3xl border-2 transition-all ${
                    isSubtracted
                      ? 'bg-rose-100/70 border-rose-300 opacity-60'
                      : 'bg-white border-rose-200 shadow-xs'
                  }`}
                >
                  <span>{emoji}</span>
                  {isSubtracted && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-rose-600 font-black text-2xl">❌</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-3 inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-rose-200 text-sm font-extrabold text-rose-700 shadow-xs">
            <span>{countA}</span>
            <span>-</span>
            <span>{sub}</span>
            <span>=</span>
            <span className="text-amber-600">?</span>
          </div>
        </div>
      );
    }

    // 4. Comparison balance
    case 'comparison-balance': {
      const countA = visualData.countA || 3;
      const countB = visualData.countB || 4;
      const itemsA = visualData.itemsA || [];
      const itemsB = visualData.itemsB || [];

      return (
        <div className="my-3 p-4 sm:p-5 bg-emerald-50/60 border-2 border-emerald-100 rounded-3xl">
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            {/* Left group */}
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-3 sm:p-4 text-center min-w-[100px] shadow-xs">
              <div className="flex flex-wrap gap-1 justify-center mb-1.5 max-w-[80px]">
                {itemsA.map((it, idx) => (
                  <span key={idx} className="text-2xl">
                    {it}
                  </span>
                ))}
              </div>
              <span className="font-black text-xl text-emerald-800">{countA}</span>
            </div>

            {/* Middle Question Box */}
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-dashed border-amber-400 flex items-center justify-center text-xl font-black text-amber-700 shadow-xs">
              ?
            </div>

            {/* Right group */}
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-3 sm:p-4 text-center min-w-[100px] shadow-xs">
              <div className="flex flex-wrap gap-1 justify-center mb-1.5 max-w-[80px]">
                {itemsB.map((it, idx) => (
                  <span key={idx} className="text-2xl">
                    {it}
                  </span>
                ))}
              </div>
              <span className="font-black text-xl text-emerald-800">{countB}</span>
            </div>
          </div>
          <p className="text-center text-xs font-bold text-emerald-600 mt-2">
            Minh An chọn dấu {'>'} (lớn hơn), {'<'} (bé hơn) hoặc = (bằng nhau) nhé!
          </p>
        </div>
      );
    }

    // 5. Sequence train
    case 'sequence-train': {
      const seq = visualData.sequence || [1, 2, '?', 4, 5];

      return (
        <div className="my-3 p-4 sm:p-5 bg-sky-50/70 border-2 border-sky-100 rounded-3xl">
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap">
            {/* Locomotive */}
            <div className="text-3xl sm:text-4xl p-2 bg-sky-500 rounded-2xl text-white shadow-xs">
              🚂
            </div>

            {/* Carriages */}
            {seq.map((val, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-center w-11 h-12 sm:w-14 sm:h-14 rounded-2xl font-black text-lg sm:text-xl border-2 shadow-xs transition-transform ${
                  val === '?'
                    ? 'bg-amber-100 border-dashed border-amber-500 text-amber-700 animate-pulse'
                    : 'bg-white border-sky-300 text-sky-800'
                }`}
              >
                {val}
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-xs text-sky-600 font-bold">
            🚃 Đoàn tàu toán học đang chờ toa số còn thiếu!
          </div>
        </div>
      );
    }

    // 6. Shape Match
    case 'shape-match': {
      const shapeEmoji = visualData.emoji || '🔴';
      return (
        <div className="my-3 p-4 sm:p-6 bg-purple-50/60 border-2 border-purple-100 rounded-3xl text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl border-2 border-purple-200 shadow-md text-6xl sm:text-7xl animate-pulse">
            {shapeEmoji}
          </div>
          <p className="text-xs font-bold text-purple-600 mt-3">
            Bé hãy chọn tên gọi đúng của hình vẽ trên nhé!
          </p>
        </div>
      );
    }

    // 7. Clock Read
    case 'clock-read': {
      const hour = visualData.clockHour || 7;
      // Calculate hour hand rotation angle (30 deg per hour)
      const hourAngle = (hour % 12) * 30;

      return (
        <div className="my-3 p-4 bg-amber-50/60 border-2 border-amber-100 rounded-3xl text-center">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto bg-white rounded-full border-4 border-amber-400 shadow-md flex items-center justify-center">
            {/* Clock Numbers */}
            <span className="absolute top-1.5 font-bold text-xs text-slate-700">12</span>
            <span className="absolute right-2 font-bold text-xs text-slate-700">3</span>
            <span className="absolute bottom-1.5 font-bold text-xs text-slate-700">6</span>
            <span className="absolute left-2 font-bold text-xs text-slate-700">9</span>

            {/* Minute Hand pointing at 12 */}
            <div
              className="absolute w-1 h-12 bg-slate-700 rounded-full origin-bottom"
              style={{ bottom: '50%', left: 'calc(50% - 2px)' }}
            />

            {/* Hour Hand pointing at hour */}
            <div
              className="absolute w-1.5 h-8 bg-rose-500 rounded-full origin-bottom transition-transform duration-500"
              style={{
                bottom: '50%',
                left: 'calc(50% - 3px)',
                transform: `rotate(${hourAngle}deg)`,
              }}
            />

            {/* Center Pin */}
            <div className="absolute w-3.5 h-3.5 bg-amber-600 rounded-full border-2 border-white" />
          </div>
          <p className="text-xs font-bold text-amber-700 mt-2">
            Kim ngắn màu đỏ chỉ số {hour}, kim dài chỉ số 12.
          </p>
        </div>
      );
    }

    // 8. Story problem visual card
    case 'story-card': {
      const emoji = visualData.emoji || '🍓';
      const itemsA = visualData.itemsA || [];
      const itemsB = visualData.itemsB || [];
      const sub = visualData.subtractedCount || 0;

      return (
        <div className="my-3 p-4 sm:p-5 bg-rose-50/50 border-2 border-rose-100 rounded-3xl">
          {itemsA.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
              {itemsA.map((it, idx) => {
                const isStruck = sub > 0 && idx >= itemsA.length - sub;
                return (
                  <span
                    key={idx}
                    className={`text-2xl p-1 rounded-xl bg-white border border-rose-100 shadow-2xs relative ${
                      isStruck ? 'opacity-50' : ''
                    }`}
                  >
                    {it}
                    {isStruck && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-rose-600">
                        ❌
                      </span>
                    )}
                  </span>
                );
              })}
              {itemsB.length > 0 && (
                <>
                  <span className="text-xl font-bold text-rose-500 mx-1">+</span>
                  {itemsB.map((it, idx) => (
                    <span
                      key={idx}
                      className="text-2xl p-1 rounded-xl bg-white border border-rose-100 shadow-2xs"
                    >
                      {it}
                    </span>
                  ))}
                </>
              )}
            </div>
          )}
          <p className="text-center text-xs text-rose-500 font-semibold">
            ✨ Bé đọc kỹ đề bài và xem hình minh họa nhé!
          </p>
        </div>
      );
    }

    // 9. Letter Card (Chữ cái tiếng Anh / Tiếng Việt)
    case 'letter-card': {
      const letter = visualData.letter || 'A';
      const word = visualData.word;
      const translation = visualData.translation;
      const picture = visualData.picture;
      const sequence = visualData.sequence;
      const isEnglish =
        question.skillId === 'englishLetters' ||
        question.skillId === 'englishVocabulary' ||
        question.skillId === 'englishColorsNumbers';

      return (
        <div className="my-3 p-4 sm:p-6 bg-linear-to-br from-pink-50/80 via-purple-50/60 to-indigo-50/80 border-2 border-pink-100 rounded-3xl text-center">
          {sequence ? (
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-3">
              {sequence.map((item, idx) => (
                <div
                  key={idx}
                  className={`w-12 h-14 sm:w-16 sm:h-18 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-black border-2 shadow-xs transition-transform ${
                    item === '?'
                      ? 'bg-amber-100 border-dashed border-amber-400 text-amber-700 animate-pulse'
                      : 'bg-white border-purple-200 text-purple-700'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <div className="relative inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-white border-3 border-pink-300 rounded-3xl shadow-md text-5xl sm:text-6xl font-black text-pink-600 animate-bounce">
                {letter}
                {picture && (
                  <span className="absolute -bottom-2 -right-2 text-3xl filter drop-shadow-xs">
                    {picture}
                  </span>
                )}
              </div>

              {word && (
                <div className="text-left bg-white/90 px-4 py-3 rounded-2xl border border-pink-100 shadow-2xs">
                  <div className="text-xl sm:text-2xl font-black text-purple-800 flex items-center gap-2">
                    <span>{word}</span>
                    <button
                      onClick={() => {
                        if (isEnglish) {
                          sound.speakEnglish(word);
                        } else {
                          sound.speakVietnamese(word);
                        }
                      }}
                      className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 transition-transform active:scale-90"
                      title={isEnglish ? 'Nghe phát âm tiếng Anh chuẩn' : 'Nghe đọc tiếng Việt'}
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  {translation && (
                    <div className="text-xs sm:text-sm font-semibold text-gray-500 mt-0.5">
                      {translation}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <p className="text-xs font-bold text-pink-500 mt-3">
            💡 Bé phát âm to chữ cái và bấm loa để nghe phát âm mẫu nhé!
          </p>
        </div>
      );
    }

    // 10. Word Picture Card (Từ vựng tiếng Anh / Màu sắc / Tiếng Việt)
    case 'word-picture-card': {
      const word = visualData.word || '';
      const translation = visualData.translation || '';
      const picture = visualData.picture || visualData.emoji || '🌸';
      const isEnglish =
        question.skillId === 'englishLetters' ||
        question.skillId === 'englishVocabulary' ||
        question.skillId === 'englishColorsNumbers';

      return (
        <div className="my-3 p-4 sm:p-6 bg-linear-to-br from-amber-50/70 via-rose-50/50 to-pink-50/70 border-2 border-amber-100 rounded-3xl text-center">
          <div className="inline-flex flex-col items-center justify-center p-4 bg-white rounded-3xl border-2 border-amber-200 shadow-sm max-w-xs mx-auto">
            <div className="text-6xl sm:text-7xl mb-2 filter drop-shadow-xs animate-pulse">
              {picture}
            </div>
            {word && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-black text-slate-800 tracking-wide">{word}</span>
                <button
                  onClick={() => {
                    if (isEnglish) {
                      sound.speakEnglish(word);
                    } else {
                      sound.speakVietnamese(word);
                    }
                  }}
                  className="p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 transition-all active:scale-90"
                  title={isEnglish ? 'Phát âm tiếng Anh' : 'Phát âm tiếng Việt'}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            )}
            {translation && (
              <div className="text-xs sm:text-sm font-bold text-pink-600 mt-1 bg-pink-50 px-3 py-1 rounded-full">
                {translation}
              </div>
            )}
          </div>
          <p className="text-xs font-bold text-amber-700 mt-3">
            ✨ Nhìn hình và chọn từ tương ứng nhé Minh An!
          </p>
        </div>
      );
    }

    // 11. Tone Card (Dấu thanh & Đánh vần tiếng Việt)
    case 'tone-card': {
      const word = visualData.word || '';
      const toneMark = visualData.toneMark;
      const picture = visualData.picture;

      return (
        <div className="my-3 p-4 sm:p-6 bg-linear-to-br from-emerald-50/70 to-teal-50/70 border-2 border-emerald-100 rounded-3xl text-center">
          <div className="inline-flex items-center justify-center gap-4 bg-white px-6 py-4 rounded-3xl border-2 border-emerald-200 shadow-sm">
            {picture && <span className="text-4xl sm:text-5xl">{picture}</span>}
            <div className="text-center">
              <span className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-wider">
                {word}
              </span>
              {toneMark && (
                <div className="mt-1 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block">
                  Dấu: <span className="text-base text-rose-500 font-black">{toneMark}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => sound.speakVietnamese(word)}
              className="p-2 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-all active:scale-90"
              title="Đọc to tiếng Việt"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs font-bold text-emerald-700 mt-3">
            🧩 Bé hãy đánh vần và chú ý dấu thanh trên chữ nhé!
          </p>
        </div>
      );
    }

    // 12. Reading Card (Đọc hiểu câu ngắn Tiếng Việt)
    case 'reading-card': {
      const sentence = visualData.sentence || '';
      const picture = visualData.picture || '📖';

      return (
        <div className="my-3 p-4 sm:p-6 bg-linear-to-br from-indigo-50/80 via-pink-50/60 to-purple-50/80 border-2 border-indigo-100 rounded-3xl">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-indigo-100 shadow-xs relative">
            <div className="flex items-start gap-3">
              <div className="text-3xl sm:text-4xl p-2 bg-indigo-50 rounded-2xl shrink-0">
                {picture}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                    Đoạn văn đọc hiểu
                  </span>
                  <button
                    onClick={() => sound.speakVietnamese(sentence)}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition-all active:scale-95"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Nghe đọc tiếng Việt</span>
                  </button>
                </div>
                <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
                  &ldquo;{sentence}&rdquo;
                </p>
              </div>
            </div>
          </div>
          <p className="text-center text-xs font-bold text-indigo-600 mt-3">
            📖 Bé đọc kỹ câu chuyện phía trên để trả lời câu hỏi bên dưới nhé!
          </p>
        </div>
      );
    }

    default:
      return null;
  }
};
