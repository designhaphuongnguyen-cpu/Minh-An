import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Brain,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Volume2,
  Lock,
} from 'lucide-react';
import { AIParentReport, ChildProfile, SkillProgressItem, SkillProgressMap } from '../types';
import { storage } from '../services/storage';
import { sound } from '../services/sound';

interface ParentDashboardProps {
  profile: ChildProfile;
  skills: SkillProgressMap;
  onBack: () => void;
  onPracticeSkill: (skillId: string) => void;
  onResetData: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profile,
  skills,
  onBack,
  onPracticeSkill,
  onResetData,
}) => {
  const [aiReport, setAiReport] = useState<AIParentReport | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    fetchAiReport();
  }, []);

  const fetchAiReport = async () => {
    setLoadingAi(true);
    try {
      const attempts = storage.getAttempts();
      const res = await fetch('/api/ai/parent-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          skillProgress: skills,
          recentAttempts: attempts.slice(-15),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiReport(data);
      } else {
        throw new Error('Fallback');
      }
    } catch (e) {
      const totalSolved = profile.totalQuestionsSolved || 0;
      if (totalSolved === 0) {
        setAiReport({
          summary:
            'Bé Minh An chuẩn bị bắt đầu bài học đầu tiên! Hệ thống sẽ tự động ghi lại quá trình, phân tích điểm mạnh và gợi ý học tập sau mỗi bài làm của bé.',
          strengths: [
            'Bé đã chuẩn bị sẵn sàng với linh vật bạn đồng hành',
            'Chương trình học lớp 1 trực quan, sinh động sẵn sàng cho bé khám phá',
          ],
          weaknesses: [
            'Chưa có dữ liệu bài làm — Hãy bấm "Học Bài" để bắt đầu tích lũy sao nhé!',
          ],
          realWorldActivities: [
            'Cùng Minh An đếm số ngón tay, ngón chân hoặc đồ chơi trong phòng.',
            'Khi ăn hoa quả, đố Minh An chia đều số quả cho các thành viên.',
            'Chơi trò đố vui tìm đồ vật hình tròn, hình vuông trong nhà.',
          ],
          cheerMessage:
            'Chúc Minh An có những buổi học Toán thật vui vẻ và đạt được thật nhiều ngôi sao lấp lánh!',
        });
      } else {
        setAiReport({
          summary:
            `Minh An đã hoàn thành ${totalSolved} câu hỏi toán học! Bé đang từng bước làm quen và tiến bộ mỗi ngày.`,
          strengths: [
            'Chăm chỉ luyện tập và tích lũy sao thưởng',
            'Tự tin làm quen với các phép tính cơ bản',
          ],
          weaknesses: [
            'Tiếp tục duy trì học đều đặn 10-15 phút mỗi ngày',
          ],
          realWorldActivities: [
            'Dùng 8 viên lego hoặc quả dâu, cất bớt 3 viên rồi cùng Minh An đếm số còn lại.',
            'Khi cùng mẹ đi siêu thị, nhờ Minh An chọn đúng 5 quả táo vào túi.',
            'Cùng Minh An xem đồng hồ khi đến giờ ăn tối hoặc giờ ngủ.',
          ],
          cheerMessage:
            'Bé Minh An đang tiến bộ từng ngày, phụ huynh hãy tiếp tục khen ngợi và thưởng sao cho bé nhé!',
        });
      }
    } finally {
      setLoadingAi(false);
    }
  };

  const getScoreColor = (score: number, attempted: boolean) => {
    if (!attempted) return 'text-gray-600 bg-gray-50 border-gray-200';
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-sky-700 bg-sky-50 border-sky-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getScoreBadge = (score: number, attempted: boolean) => {
    if (!attempted) return '⚪ Chưa học';
    if (score >= 85) return '🟢 Đã vững';
    if (score >= 70) return '🟡 Cần củng cố';
    if (score >= 50) return '🟠 Cần luyện thêm';
    return '🔴 Ưu tiên luyện trực quan';
  };

  return (
    <div className="max-w-4xl mx-auto px-3 py-4">
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
          <span>Quay lại trang học</span>
        </button>

        <div className="flex items-center gap-1.5 bg-purple-100 border border-purple-300 text-purple-900 px-4 py-1.5 rounded-full text-sm font-black shadow-xs">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          <span>GIAO DIỆN DÀNH CHO PHỤ HUYNH</span>
        </div>
      </div>

      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl border-2 border-purple-200 p-5 sm:p-6 mb-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 border-2 border-purple-200 flex items-center justify-center text-3xl shadow-xs">
              👧
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                Bé {profile.name} – Lớp {profile.grade}
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Thời gian học lý tưởng: 10–15 phút mỗi ngày
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
            <div className="bg-purple-50 p-2.5 rounded-2xl text-center border border-purple-100">
              <div className="text-xs text-slate-500 font-bold">Số ngày liên tiếp</div>
              <div className="text-lg font-black text-purple-800">🔥 {profile.streak} ngày</div>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-2xl text-center border border-amber-100">
              <div className="text-xs text-slate-500 font-bold">Tổng sao</div>
              <div className="text-lg font-black text-amber-800">⭐ {profile.stars}</div>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-2xl text-center border border-emerald-100">
              <div className="text-xs text-slate-500 font-bold">Đã làm</div>
              <div className="text-lg font-black text-emerald-800">
                ✅ {profile.totalQuestionsSolved ?? 0} câu
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tutor Parent Report Card */}
      <div className="bg-linear-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/80 rounded-3xl border-2 border-indigo-200 p-5 sm:p-7 mb-6 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-indigo-500 text-white shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">
                Cô Giáo AI Phân Tích & Báo Cáo
              </h3>
              <p className="text-xs text-slate-500">
                Tự động nhận diện điểm mạnh, điểm yếu và gợi ý hoạt động tại nhà
              </p>
            </div>
          </div>

          <button
            onClick={fetchAiReport}
            disabled={loadingAi}
            className="flex items-center gap-1 text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-full border border-indigo-200 hover:bg-indigo-50 shadow-2xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loadingAi ? 'animate-spin' : ''}`} />
            <span>{loadingAi ? 'Đang cập nhật...' : 'Cập nhật phân tích'}</span>
          </button>
        </div>

        {aiReport && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-white/90 rounded-2xl p-4 border border-indigo-100 shadow-2xs">
              <p className="text-slate-800 font-bold text-sm sm:text-base leading-relaxed">
                &ldquo;{aiReport.summary}&rdquo;
              </p>
            </div>

            {/* Strengths & Weaknesses 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Strengths */}
              <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200">
                <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-sm mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Điểm mạnh của Minh An:</span>
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
                  {aiReport.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-rose-50/80 rounded-2xl p-4 border border-rose-200">
                <div className="flex items-center gap-1.5 text-rose-800 font-extrabold text-sm mb-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Kỹ năng cần bố mẹ hỗ trợ thêm:</span>
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
                  {aiReport.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-600 font-bold">!</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Real world activity tips */}
            <div className="bg-amber-50/90 rounded-2xl p-4 border border-amber-200">
              <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-sm mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Gợi ý trò chơi thực tế ở nhà cùng Minh An:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {aiReport.realWorldActivities.map((act, idx) => (
                  <div
                    key={idx}
                    className="bg-white/90 p-3 rounded-xl border border-amber-200 text-xs font-semibold text-slate-700 leading-relaxed shadow-2xs"
                  >
                    <span className="font-black text-amber-700">Cách {idx + 1}: </span>
                    {act}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skill Mastery Breakdown */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 mb-6 shadow-sm">
        <h3 className="font-extrabold text-slate-800 text-lg mb-1">
          Bảng Theo Dõi Kỹ Năng (Toán, Tiếng Anh & Tiếng Việt)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Bấm vào kỹ năng bất kỳ để mở bài luyện tập riêng cho Minh An
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.values(skills) as SkillProgressItem[]).map((sk) => {
            const hasAttempted = (sk.correctCount + sk.wrongCount) > 0;
            const badgeText = getScoreBadge(sk.masteryScore, hasAttempted);
            const scoreClass = getScoreColor(sk.masteryScore, hasAttempted);

            return (
              <div
                key={sk.skillId}
                className="bg-slate-50 hover:bg-slate-100/80 rounded-2xl p-3.5 border border-slate-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{sk.icon}</span>
                      <span className="font-extrabold text-slate-800 text-sm">{sk.name}</span>
                    </div>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${scoreClass}`}>
                      {sk.masteryScore}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden my-1.5">
                    <div
                      className={`h-full rounded-full transition-all ${
                        sk.masteryScore >= 80
                          ? 'bg-emerald-500'
                          : sk.masteryScore >= 60
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${sk.masteryScore}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mt-1">
                    <span>{badgeText}</span>
                    <span>Đúng {sk.correctCount} / Sai {sk.wrongCount}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playPop();
                    onPracticeSkill(sk.skillId);
                  }}
                  className="mt-3 w-full py-1.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs border border-rose-200 flex items-center justify-center gap-1 active:scale-95 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Cho Minh An luyện phần này</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parent Controls & Reset */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-slate-800 text-sm">Quản lý & Cài đặt</h4>
          <p className="text-xs text-slate-500">Khôi phục dữ liệu ban đầu hoặc cài đặt lại tài khoản</p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Bố mẹ có muốn khôi phục lại dữ liệu mẫu cho Minh An không?')) {
              storage.resetToDefault();
              onResetData();
            }
          }}
          className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 active:scale-95 transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Đặt lại dữ liệu Demo</span>
        </button>
      </div>
    </div>
  );
};
