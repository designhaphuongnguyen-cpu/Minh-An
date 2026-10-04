import React, { useState, useEffect } from 'react';
import { ChildProfile, NavigationPage, SkillId, SkillProgressMap } from './types';
import { storage } from './services/storage';
import { sound } from './services/sound';
import { Header } from './components/Header';
import { Onboarding } from './components/Onboarding';
import { HomeDashboard } from './components/HomeDashboard';
import { TodayLesson } from './components/TodayLesson';
import { TopicPractice } from './components/TopicPractice';
import { DailyChallenge } from './components/DailyChallenge';
import { MathGamesHub } from './components/MathGamesHub';
import { TreasureVault } from './components/TreasureVault';
import { StickerAlbum } from './components/StickerAlbum';
import { ParentDashboard } from './components/ParentDashboard';
import { ParentPinModal } from './components/ParentPinModal';

export default function App() {
  const [profile, setProfile] = useState<ChildProfile>(() => storage.getProfile());
  const [skills, setSkills] = useState<SkillProgressMap>(() => storage.getSkills());
  const [currentPage, setCurrentPage] = useState<NavigationPage>(() =>
    profile.completedOnboarding ? 'home' : 'onboarding'
  );
  const [isParentPinOpen, setIsParentPinOpen] = useState(false);
  const [practiceSkillId, setPracticeSkillId] = useState<SkillId | undefined>(undefined);
  const [practiceSubject, setPracticeSubject] = useState<'all' | 'math' | 'english' | 'vietnamese'>('all');

  // Subscribe to storage updates
  useEffect(() => {
    const unsubProfile = storage.onProfileChange((newProfile) => {
      setProfile({ ...newProfile });
    });
    const unsubSkills = storage.onSkillsChange((newSkills) => {
      setSkills({ ...newSkills });
    });
    return () => {
      unsubProfile();
      unsubSkills();
    };
  }, []);

  // Update sound service on profile changes
  useEffect(() => {
    sound.setSoundEnabled(profile.soundEnabled);
    sound.setVoiceEnabled(profile.voiceEnabled);
  }, [profile.soundEnabled, profile.voiceEnabled]);

  const handleToggleSound = () => {
    const nextSound = !profile.soundEnabled;
    sound.setSoundEnabled(nextSound);
    sound.setVoiceEnabled(nextSound);
    if (nextSound) sound.playPop();

    const updated = { ...profile, soundEnabled: nextSound, voiceEnabled: nextSound };
    storage.saveProfile(updated);
    setProfile(updated);
  };

  const handleNavigate = (page: NavigationPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSubject = (subject: 'math' | 'english' | 'vietnamese') => {
    setPracticeSubject(subject);
    setPracticeSkillId(undefined);
    setCurrentPage('practice-topics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePracticeSpecificSkill = (skillId: string) => {
    setPracticeSkillId(skillId as SkillId);
    setPracticeSubject('all');
    setCurrentPage('practice-topics');
  };

  const handleResetData = () => {
    const freshProfile = storage.getProfile();
    const freshSkills = storage.getSkills();
    setProfile(freshProfile);
    setSkills(freshSkills);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-[#FFF8FA] text-[#4A4A4A] flex flex-col font-sans selection:bg-pink-200">
      {/* Top App Header (Visible across all main views except initial onboarding) */}
      {currentPage !== 'onboarding' && (
        <Header
          profile={profile}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenParentPin={() => setIsParentPinOpen(true)}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* Main App Content View Router */}
      <main className="flex-1 pb-8">
        {currentPage === 'onboarding' && (
          <Onboarding
            onComplete={() => {
              setProfile(storage.getProfile());
              setCurrentPage('home');
            }}
          />
        )}

        {currentPage === 'home' && (
          <HomeDashboard
            profile={profile}
            skills={skills}
            onNavigate={handleNavigate}
            onSelectSubject={handleSelectSubject}
            onOpenParentPin={() => setIsParentPinOpen(true)}
          />
        )}

        {currentPage === 'learn-today' && (
          <TodayLesson
            profile={profile}
            onBack={() => handleNavigate('home')}
            onGoTreasure={() => handleNavigate('treasure')}
            onGoHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'practice-topics' && (
          <TopicPractice
            profile={profile}
            skills={skills}
            initialSkillId={practiceSkillId}
            initialSubject={practiceSubject}
            onBack={() => {
              setPracticeSkillId(undefined);
              setPracticeSubject('all');
              handleNavigate('home');
            }}
          />
        )}

        {currentPage === 'daily-challenge' && (
          <DailyChallenge
            onBack={() => handleNavigate('home')}
            onFinished={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'math-games' && (
          <MathGamesHub
            onBack={() => handleNavigate('home')}
            onGameComplete={() => {
              setProfile(storage.getProfile());
            }}
          />
        )}

        {currentPage === 'treasure' && (
          <TreasureVault
            profile={profile}
            onBack={() => handleNavigate('home')}
            onProfileUpdated={(up) => setProfile(up)}
          />
        )}

        {currentPage === 'album' && (
          <StickerAlbum onBack={() => handleNavigate('home')} />
        )}

        {currentPage === 'parents' && (
          <ParentDashboard
            profile={profile}
            skills={skills}
            onBack={() => handleNavigate('home')}
            onPracticeSkill={handlePracticeSpecificSkill}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Footer matching Sleek Interface specification */}
      <footer className="h-16 px-6 sm:px-10 flex items-center justify-between border-t border-pink-100 bg-white/70 backdrop-blur-xs text-[#8A8A8A] text-xs font-semibold">
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleSound}
            className="flex items-center gap-2 hover:text-pink-600 transition-colors cursor-pointer"
          >
            <span className="text-base">{profile.soundEnabled ? '🔊' : '🔇'}</span>
            <span className="font-bold">
              Âm thanh: {profile.soundEnabled ? 'Bật' : 'Tắt'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">Toán 1 Cùng Minh An 🌸</span>
          <button
            onClick={() => setIsParentPinOpen(true)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>👨‍👩‍👧</span>
            <span>DÀNH CHO BỐ MẸ (PIN)</span>
          </button>
        </div>
      </footer>

      {/* Parent PIN Modal Protection */}
      <ParentPinModal
        isOpen={isParentPinOpen}
        onClose={() => setIsParentPinOpen(false)}
        onSuccess={() => {
          setIsParentPinOpen(false);
          handleNavigate('parents');
        }}
      />
    </div>
  );
}
