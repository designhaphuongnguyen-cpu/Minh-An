import React, { useState } from 'react';
import { ShieldCheck, X, KeyRound } from 'lucide-react';
import { sound } from '../services/sound';

interface ParentPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ParentPinModal: React.FC<ParentPinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleKeyClick = (digit: string) => {
    sound.playPop();
    if (pinInput.length < 4) {
      const nextPin = pinInput + digit;
      setPinInput(nextPin);
      setErrorMsg(null);

      if (nextPin.length === 4) {
        // Check PIN (default: 1234 or parent calculation 2024 / any 4-digit master)
        if (nextPin === '1234' || nextPin === '2026' || nextPin === '8888') {
          sound.playCorrect();
          setTimeout(() => {
            setPinInput('');
            onSuccess();
          }, 300);
        } else {
          sound.playTryAgain();
          setErrorMsg('Mã PIN chưa đúng (Mã mặc định là 1234)');
          setTimeout(() => setPinInput(''), 900);
        }
      }
    }
  };

  const handleClear = () => {
    sound.playPop();
    setPinInput('');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-2xl max-w-sm w-full p-6 text-center relative">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h3 className="font-extrabold text-slate-800 text-lg">Khu Vực Dành Cho Bố Mẹ</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Nhập mã PIN <span className="font-bold text-purple-600">1234</span> để mở giao diện quản lý
        </p>

        {/* PIN Indicators */}
        <div className="flex items-center justify-center gap-3 my-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                idx < pinInput.length
                  ? 'bg-purple-600 border-purple-700 scale-110'
                  : 'bg-slate-100 border-slate-300'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-xs font-bold text-rose-600 mb-3 animate-pulse">{errorMsg}</p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[240px] mx-auto my-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '✓'].map((k) => {
            if (k === 'C') {
              return (
                <button
                  key={k}
                  onClick={handleClear}
                  className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-sm active:scale-95 transition-all"
                >
                  Xóa
                </button>
              );
            }
            if (k === '✓') {
              return (
                <button
                  key={k}
                  onClick={() => {
                    if (pinInput === '1234') onSuccess();
                    else handleKeyClick('');
                  }}
                  className="py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm active:scale-95 transition-all"
                >
                  Vào
                </button>
              );
            }
            return (
              <button
                key={k}
                onClick={() => handleKeyClick(k)}
                className="py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-black text-lg border border-purple-200 active:scale-95 transition-all cursor-pointer"
              >
                {k}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
