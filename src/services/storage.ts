import { Attempt, ChildProfile, MascotType, RewardItem, SkillId, SkillProgressMap } from '../types';
import { INITIAL_PROFILE, INITIAL_REWARDS, INITIAL_SKILL_PROGRESS, STICKER_COLLECTION } from '../data/initialData';

const STORAGE_KEYS = {
  PROFILE: 'minh_an_math_profile_v2',
  SKILLS: 'minh_an_math_skills_v2',
  ATTEMPTS: 'minh_an_math_attempts_v2',
  REWARDS: 'minh_an_math_rewards_v2',
  STICKERS: 'minh_an_math_stickers_v2',
};

// Clean legacy v1 test keys on initial launch if v2 does not exist yet
try {
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.removeItem('minh_an_math_profile_v1');
    localStorage.removeItem('minh_an_math_skills_v1');
    localStorage.removeItem('minh_an_math_attempts_v1');
    localStorage.removeItem('minh_an_math_rewards_v1');
    localStorage.removeItem('minh_an_math_stickers_v1');
  }
} catch (e) {
  // Ignore in sandboxed storage
}

class StorageService {
  private profileListeners: ((profile: ChildProfile) => void)[] = [];
  private skillsListeners: ((skills: SkillProgressMap) => void)[] = [];

  // Get Child Profile
  public getProfile(): ChildProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Storage read error for profile:', e);
    }
    return { ...INITIAL_PROFILE };
  }

  // Save Child Profile
  public saveProfile(profile: ChildProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      this.profileListeners.forEach((fn) => fn(profile));
    } catch (e) {
      console.warn('Storage write error for profile:', e);
    }
  }

  // Subscribe to profile changes
  public onProfileChange(callback: (profile: ChildProfile) => void): () => void {
    this.profileListeners.push(callback);
    return () => {
      this.profileListeners = this.profileListeners.filter((fn) => fn !== callback);
    };
  }

  // Get Skills Progress
  public getSkills(): SkillProgressMap {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SKILLS);
      if (data) {
        const parsed = JSON.parse(data);
        return { ...INITIAL_SKILL_PROGRESS, ...parsed };
      }
    } catch (e) {
      console.warn('Storage read error for skills:', e);
    }
    return { ...INITIAL_SKILL_PROGRESS };
  }

  // Save Skills Progress
  public saveSkills(skills: SkillProgressMap): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
      this.skillsListeners.forEach((fn) => fn(skills));
    } catch (e) {
      console.warn('Storage write error for skills:', e);
    }
  }

  // Subscribe to skill changes
  public onSkillsChange(callback: (skills: SkillProgressMap) => void): () => void {
    this.skillsListeners.push(callback);
    return () => {
      this.skillsListeners = this.skillsListeners.filter((fn) => fn !== callback);
    };
  }

  // Record an attempt and automatically adjust skill mastery
  public recordAttempt(attempt: Attempt): void {
    try {
      const attempts = this.getAttempts();
      attempts.push(attempt);
      localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts.slice(-300)));

      // Update skill mastery dynamically
      const skills = this.getSkills();
      const skill = skills[attempt.skillId];
      if (skill) {
        if (attempt.isCorrect) {
          skill.correctCount += 1;
        } else {
          skill.wrongCount += 1;
        }
        const total = skill.correctCount + skill.wrongCount;
        skill.masteryScore = total > 0 ? Math.min(100, Math.round((skill.correctCount / total) * 100)) : 0;
        skill.lastPracticed = 'Vừa xong';
        this.saveSkills(skills);
      }

      // Update profile stats
      const profile = this.getProfile();
      profile.totalQuestionsSolved = (profile.totalQuestionsSolved || 0) + 1;
      this.saveProfile(profile);
    } catch (e) {
      console.warn('Record attempt error:', e);
    }
  }

  // Get all attempts
  public getAttempts(): Attempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Storage read error for attempts:', e);
    }
    return [];
  }

  // Add stars to profile
  public addStars(amount: number): number {
    const profile = this.getProfile();
    profile.stars = (profile.stars || 0) + amount;
    // Calculate level: Level 1 (0-19), Level 2 (20-39), Level 3 (40-59), etc.
    const calculatedLevel = Math.max(1, Math.floor(profile.stars / 20) + 1);
    if (calculatedLevel !== profile.level) {
      profile.level = calculatedLevel;
    }
    this.saveProfile(profile);
    return profile.stars;
  }

  // Update streak if needed
  public checkDailyStreak(): number {
    const profile = this.getProfile();
    const today = new Date().toISOString().split('T')[0];
    if (!profile.dailyStreakHistory) {
      profile.dailyStreakHistory = [];
    }

    if (!profile.dailyStreakHistory.includes(today)) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const hadYesterday = profile.dailyStreakHistory.includes(yesterday);
      
      profile.dailyStreakHistory.push(today);
      if (hadYesterday || profile.streak === 0) {
        profile.streak = (profile.streak || 0) + 1;
      } else {
        profile.streak = 1;
      }
      profile.lastActiveDate = today;
      this.saveProfile(profile);
    }
    return profile.streak;
  }

  // Update mascot
  public setMascot(mascot: MascotType): void {
    const profile = this.getProfile();
    profile.mascot = mascot;
    this.saveProfile(profile);
  }

  // Equip accessory
  public setEquippedAccessory(accessoryId?: string): void {
    const profile = this.getProfile();
    profile.equippedAccessory = accessoryId;
    this.saveProfile(profile);
  }

  // Get rewards
  public getRewards(): RewardItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REWARDS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Storage read error for rewards:', e);
    }
    return [...INITIAL_REWARDS];
  }

  // Unlock reward
  public unlockReward(rewardId: string): boolean {
    const profile = this.getProfile();
    const rewards = this.getRewards();
    const target = rewards.find((r) => r.id === rewardId);

    if (!target || target.unlocked || profile.stars < target.cost) {
      return false;
    }

    profile.stars -= target.cost;
    target.unlocked = true;
    target.unlockedAt = 'Hôm nay';

    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
    this.saveProfile(profile);
    return true;
  }

  // Get Stickers
  public getStickers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STICKERS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Storage read error for stickers:', e);
    }
    return [...STICKER_COLLECTION];
  }

  // Unlock sticker
  public unlockSticker(stickerId: string): void {
    const stickers = this.getStickers();
    const target = stickers.find((s: any) => s.id === stickerId);
    if (target && !target.unlocked) {
      target.unlocked = true;
      localStorage.setItem(STORAGE_KEYS.STICKERS, JSON.stringify(stickers));
    }
  }

  // Reset to initial clean zero state
  public resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
    localStorage.removeItem(STORAGE_KEYS.REWARDS);
    localStorage.removeItem(STORAGE_KEYS.STICKERS);
    this.profileListeners.forEach((fn) => fn({ ...INITIAL_PROFILE }));
    this.skillsListeners.forEach((fn) => fn({ ...INITIAL_SKILL_PROGRESS }));
  }
}

export const storage = new StorageService();
