import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Star, RefreshCw, Sparkles, CheckCircle2, Search } from 'lucide-react';
import { ChildProfile, Question, SkillId, SkillProgressItem, SkillProgressMap } from '../types';
import { generateQuestion } from '../learning-engine/questionGenerator';
import { QuestionCard } from './QuestionCard';
import { CelebrationModal } from './CelebrationModal';
import { sound } from '../services/sound';
import { storage } from '../services/storage';

interface TopicPracticeProps {
  profile: ChildProfile;
  skills: SkillProgressMap;
  initialSkillId?: SkillId;
  initialSubject?: SubjectFilter;
  onBack: () => void;
}

export type SubjectFilter = 'all' | 'math' | 'english' | 'vietnamese';

export const TopicPractice: React.FC<TopicPracticeProps> = ({
  profile,
  skills,
  initialSkillId,
  initialSubject = 'all',
  onBack,
}) => {
  const [selectedSkill, setSelectedSkill] = useState<SkillId | null>(initialSkillId || null);
  const [activeSubject, setActiveSubject] = useState<SubjectFilter>(initialSubject);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(() =>
    initialSkillId ? generateQuestion(initialSkillId, 1) : null
  );
  const [questionCount, setQuestionCount] = useState(0);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  const skillList = Object.values(skills) as SkillProgressItem[];
  const weakSkills = skillList.filter(
    (s) => s.correctCount + s.wrongCount > 0 && s.masteryScore < 75
  );

  const isMathSkill = (s: SkillProgressItem) =>
    !s.category.includes('Tiếng Anh') && !s.category.includes('Tiếng Việt');
  const isEnglishSkill = (s: SkillProgressItem) => s.category.includes('Tiếng Anh');
  const isVietnameseSkill = (s: SkillProgressItem) => s.category.includes('Tiếng Việt');

  const filteredSkills = skillList.filter((s) => {
    // Subject filter
    if (activeSubject === 'math' && !isMathSkill(s)) return false;
    if (activeSubject === 'english' && !isEnglishSkill(s)) return false;
    if (activeSubject === 'vietnamese' && !isVietnameseSkill(s)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSelectSkill = (skillId: SkillId) => {
    sound.playPop();
    setSelectedSkill(skillId);
    setQuestionCount(0);
    setCurrentQuestion(generateQuestion(skillId, 1));
  };

  const handleCorrect = (answer: string | number) => {
    if (!currentQuestion) return;

    storage.recordAttempt({
      id: `att_${Date.now()}`,
      timestamp: new Date().toISOString(),
      skillId: currentQuestion.skillId,
      questionText: currentQuestion.questionText,
      studentAnswer: answer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: true,
      responseTimeMs: 2500,
    });

    storage.addStars(1);
    setQuestionCount((prev) => prev + 1);
    setIsCelebrationOpen(true);
  };

  const handleWrong = (wrongAnswer: string | number) => {
    if (!currentQuestion) return;

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
    if (selectedSkill) {
      setCurrentQuestion(generateQuestion(selectedSkill, questionCount >= 3 ? 2 : 1));
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            sound.playPop();
            if (selectedSkill) {
              setSelectedSkill(null);
              setCurrentQuestion(null);
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-pink-200 text-pink-600 font-bold text-sm shadow-xs hover:bg-pink-50 transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{selectedSkill ? 'Đổi chủ đề' : 'Quay lại'}</span>
        </button>

        <div className="flex items-center gap-2 bg-pink-50 border border-pink-200 text-pink-700 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-xs">
          <BookOpen className="w-4 h-4 text-pink-600" />
          <span>KHO HỌC TẬP LỚP 1</span>
        </div>
      </div>

      {!selectedSkill ? (
        <div className="space-y-6">
          {/* Subject Filter Pills */}
          <div className="bg-white rounded-3xl p-3 sm:p-4 border border-pink-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveSubject('all');
                }}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSubject === 'all'
                    ? 'bg-pink-500 text-white shadow-xs scale-105'
                    : 'bg-pink-50/70 text-pink-700 hover:bg-pink-100'
                }`}
              >
                🌟 Tất cả các môn ({skillList.length})
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setActiveSubject('math');
                }}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSubject === 'math'
                    ? 'bg-indigo-600 text-white shadow-xs scale-105'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                📐 Toán Lớp 1 ({skillList.filter(isMathSkill).length})
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setActiveSubject('english');
                }}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSubject === 'english'
                    ? 'bg-sky-600 text-white shadow-xs scale-105'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                }`}
              >
                🇬🇧 Tiếng Anh Lớp 1 ({skillList.filter(isEnglishSkill).length})
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setActiveSubject('vietnamese');
                }}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeSubject === 'vietnamese'
                    ? 'bg-emerald-600 text-white shadow-xs scale-105'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                🇻🇳 Tiếng Việt Lớp 1 ({skillList.filter(isVietnameseSkill).length})
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm chủ đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-pink-400"
              />
            </div>
          </div>

          {/* 1. Dedicated "MINH AN LUYỆN THÊM" Section */}
          {weakSkills.length > 0 && activeSubject === 'all' && !searchQuery && (
            <div className="p-5 sm:p-6 bg-white rounded-[32px] border border-amber-200 shadow-sm">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-2xl">
                  <RefreshCw className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-[#4A4A4A] text-lg sm:text-xl tracking-tight">
                    🔁 MINH AN LUYỆN THÊM
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Những dạng bài Minh An cần củng cố thêm để thành thạo 100%!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {weakSkills.map((sk) => (
                  <button
                    key={sk.skillId}
                    onClick={() => handleSelectSkill(sk.skillId)}
                    className="p-3.5 rounded-2xl bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200 shadow-xs flex items-center justify-between text-left transition-all active:scale-98 cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{sk.icon}</span>
                      <div>
                        <div className="font-bold text-[#4A4A4A] text-sm">{sk.name}</div>
                        <div className="text-xs font-bold text-amber-700">
                          Độ thành thạo: {sk.masteryScore}%
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-amber-400 text-amber-950 text-xs font-bold rounded-full shadow-2xs">
                      Luyện ngay
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. All 1st Grade Topics Grid */}
          <div className="bg-white rounded-[32px] border border-pink-100 p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#4A4A4A] text-xl mb-0.5">
                  {activeSubject === 'all' && 'Danh Sách Chủ Đề Học Tập Lớp 1 📚'}
                  {activeSubject === 'math' && 'Chủ Đề Môn Toán Lớp 1 📐'}
                  {activeSubject === 'english' && 'Chủ Đề Tiếng Anh Lớp 1 🇬🇧'}
                  {activeSubject === 'vietnamese' && 'Chủ Đề Tiếng Việt Lớp 1 🇻🇳'}
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Minh An bấm vào bài học để cùng bạn đồng hành luyện tập nhé:
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-pink-50 text-pink-600 rounded-full border border-pink-200">
                {filteredSkills.length} chủ đề
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {filteredSkills.map((sk) => {
                const isEnglish = isEnglishSkill(sk);
                const isVietnamese = isVietnameseSkill(sk);

                const cardBg = isEnglish
                  ? 'bg-sky-50/40 hover:bg-sky-50 border-sky-100'
                  : isVietnamese
                  ? 'bg-emerald-50/40 hover:bg-emerald-50 border-emerald-100'
                  : 'bg-[#FFF8FA] hover:bg-pink-50/80 border-pink-100';

                const badgeBg = isEnglish
                  ? 'border-sky-200 text-sky-700'
                  : isVietnamese
                  ? 'border-emerald-200 text-emerald-700'
                  : 'border-pink-200 text-pink-700';

                return (
                  <button
                    key={sk.skillId}
                    onClick={() => handleSelectSkill(sk.skillId)}
                    className={`p-4 rounded-[24px] border text-left transition-all active:scale-95 shadow-2xs flex flex-col justify-between min-h-[120px] cursor-pointer ${cardBg}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{sk.icon}</span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 bg-white rounded-full border ${badgeBg}`}
                      >
                        {sk.masteryScore}%
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-[#4A4A4A] text-sm mb-0.5">{sk.name}</h4>
                      <span className="text-[11px] text-gray-400 font-medium">{sk.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Active Skill Practice Session */
        <div>
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              mascot={profile.mascot}
              questionIndex={questionCount}
              totalQuestions={5}
              onCorrectAnswer={handleCorrect}
              onWrongAnswer={handleWrong}
            />
          )}

          <CelebrationModal
            isOpen={isCelebrationOpen}
            earnedStars={1}
            mascot={profile.mascot}
            title="Đúng Rồi Minh An Ơi! 🎉"
            message={`Minh An hoàn thành câu hỏi về "${skills[selectedSkill]?.name}" rất xuất sắc!`}
            onNext={handleNextQuestion}
          />
        </div>
      )}
    </div>
  );
};
