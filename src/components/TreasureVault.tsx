import React, { useState } from 'react';
import { ArrowLeft, Star, Sparkles, Check, Lock, Gift, Shirt } from 'lucide-react';
import { ChildProfile, RewardItem } from '../types';
import { storage } from '../services/storage';
import { sound } from '../services/sound';
import { Mascot } from './Mascot';

interface TreasureVaultProps {
  profile: ChildProfile;
  onBack: () => void;
  onProfileUpdated: (profile: ChildProfile) => void;
}

export const TreasureVault: React.FC<TreasureVaultProps> = ({
  profile,
  onBack,
  onProfileUpdated,
}) => {
  const [rewards, setRewards] = useState<RewardItem[]>(() => storage.getRewards());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUnlock = (item: RewardItem) => {
    if (profile.stars < item.cost) {
      sound.playTryAgain();
      const msg = `Minh An cần thêm ${item.cost - profile.stars} ⭐ để mở khóa món quà này! Hãy chăm học để nhận thêm sao nhé!`;
      setToastMessage(msg);
      sound.speak(msg);
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const success = storage.unlockReward(item.id);
    if (success) {
      sound.playCorrect();
      sound.playStar();
      const updatedRewards = storage.getRewards();
      setRewards(updatedRewards);
      const updatedProfile = storage.getProfile();
      onProfileUpdated(updatedProfile);

      const msg = `Chúc mừng Minh An đã mở khóa thành công ${item.name}! 🎉`;
      setToastMessage(msg);
      sound.speak(msg);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleEquip = (item: RewardItem) => {
    sound.playPop();
    const isEquipped = profile.equippedAccessory === item.id;
    const newEquipped = isEquipped ? undefined : item.id;
    storage.setEquippedAccessory(newEquipped);
    const updated = storage.getProfile();
    onProfileUpdated(updated);

    const msg = isEquipped
      ? `Đã cất ${item.name} vào rương!`
      : `Đã đeo ${item.name} cho ${profile.name}! Đẹp lắm nè! 🌸`;
    setToastMessage(msg);
    sound.speak(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            sound.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-pink-200 text-pink-600 font-bold text-sm shadow-xs hover:bg-pink-50 transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-1.5 rounded-full text-base font-bold shadow-xs">
          <Star className="w-5 h-5 text-amber-500 fill-amber-400 animate-spin" />
          <span>{profile.stars} Ngôi sao</span>
        </div>
      </div>

      {/* Banner / Mascot Preview */}
      <div className="bg-gradient-to-r from-pink-100 via-purple-50 to-pink-50 rounded-[32px] border border-pink-100 p-5 sm:p-6 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-pink-200 rounded-full text-xs font-bold text-pink-600 mb-2">
            <Gift className="w-3.5 h-3.5" />
            <span>KHO BÁU CỦA MINH AN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#4A4A4A] tracking-tight">
            Phòng Thử Đồ & Đổi Quà 🎀
          </h2>
          <p className="text-gray-500 font-medium text-xs sm:text-sm mt-1">
            Dùng sao kiếm được từ các bài toán để làm điệu cho bạn thú cưng nhé!
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-[24px] border border-pink-100 shadow-sm flex items-center gap-3">
          <Mascot
            mascot={profile.mascot}
            equippedAccessory={profile.equippedAccessory}
            size="md"
            showSpeechBubble={false}
          />
          <div className="text-left">
            <span className="text-xs text-gray-400 font-medium">Đang mặc:</span>
            <div className="text-sm font-bold text-pink-600">
              {rewards.find((r) => r.id === profile.equippedAccessory)?.name || 'Chưa trang trí'}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-bold rounded-2xl text-center animate-bounce shadow-sm">
          {toastMessage}
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((item) => {
          const isEquipped = profile.equippedAccessory === item.id;
          const canAfford = profile.stars >= item.cost;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-[32px] border p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between ${
                item.unlocked
                  ? isEquipped
                    ? 'border-pink-300 bg-pink-50/30 ring-2 ring-pink-100'
                    : 'border-emerald-200 hover:border-emerald-300'
                  : 'border-pink-100 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-4xl sm:text-5xl">{item.emoji}</span>
                  {item.unlocked ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Đã sở hữu</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{item.cost} Sao</span>
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-[#4A4A4A] text-base sm:text-lg">{item.name}</h3>
                <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100">
                {item.unlocked ? (
                  <button
                    onClick={() => handleEquip(item)}
                    className={`w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                      isEquipped
                        ? 'bg-pink-500 text-white shadow-xs'
                        : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200'
                    }`}
                  >
                    <Shirt className="w-4 h-4" />
                    <span>{isEquipped ? 'ĐANG ĐEO (Bấm để cất)' : 'ĐEO CHO THÚ CƯNG'}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnlock(item)}
                    className={`w-full py-2.5 px-4 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                      canAfford
                        ? 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-md'
                        : 'bg-gray-100 text-gray-400 border border-gray-200'
                    }`}
                  >
                    {canAfford ? (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>MỞ KHÓA BẰNG {item.cost} ⭐</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>CẦN {item.cost} ⭐</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
