// Web Audio API & Vietnamese / English Text-to-Speech Engine for Minh An App

export type SpeechLang = 'vi-VN' | 'en-US' | 'vi' | 'en';

export interface SpeakOptions {
  lang?: SpeechLang;
  pitch?: number;
  rate?: number;
}

class SoundService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private voiceEnabled: boolean = true;
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user touch/interaction
    this.initVoices();
  }

  private initVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const load = () => {
        try {
          const list = window.speechSynthesis.getVoices();
          if (list && list.length > 0) {
            this.voices = list;
            this.voicesLoaded = true;
          }
        } catch (e) {
          console.warn('Could not retrieve speech voices:', e);
        }
      };

      load();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = load;
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  public isSoundEnabled() {
    return this.soundEnabled;
  }

  public isVoiceEnabled() {
    return this.voiceEnabled;
  }

  // Pleasant cheerful chime for correct answer
  public playCorrect() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio

      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.001, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.35);
      });
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Gentle encouraging boing/pop for retry (warm, non-punitive)
  public playTryAgain() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Star sound
  public playStar() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.2);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Tap button pop
  public playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Balloon pop sound
  public playBalloonPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Victory fanfare for completing lesson/challenge
  public playVictory() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [
        { f: 523.25, d: 0.12 }, // C5
        { f: 659.25, d: 0.12 }, // E5
        { f: 783.99, d: 0.12 }, // G5
        { f: 1046.5, d: 0.35 }, // C6
      ];

      let t = now;
      notes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + n.d);

        t += n.d;
      });
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Helper to find the best Vietnamese voice
  private getVietnameseVoice(): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) {
      this.initVoices();
    }
    const viVoices = this.voices.filter(
      (v) =>
        v.lang.toLowerCase().includes('vi') ||
        v.lang.toLowerCase().includes('vn') ||
        v.name.toLowerCase().includes('viet')
    );

    // Prioritize natural/online voices if available
    const preferred = viVoices.find(
      (v) =>
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('hoaimy') ||
        v.name.toLowerCase().includes('mai') ||
        v.name.toLowerCase().includes('linh') ||
        v.name.toLowerCase().includes('nam')
    );

    return preferred || viVoices[0] || null;
  }

  // Helper to find an English voice
  private getEnglishVoice(): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) {
      this.initVoices();
    }
    const enVoices = this.voices.filter(
      (v) => v.lang.toLowerCase().startsWith('en') || v.name.toLowerCase().includes('english')
    );

    const preferred = enVoices.find(
      (v) =>
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('natural') ||
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('jenny') ||
        v.name.toLowerCase().includes('zira') ||
        v.lang.toLowerCase() === 'en-us'
    );

    return preferred || enVoices[0] || null;
  }

  /**
   * Primary Speak method:
   * By default, ALWAYS uses Vietnamese voice (vi-VN) for all prompts, questions, instructions, and mascot feedback.
   * Only uses English voice when specifically requested (e.g. for English vocab or phonics practice).
   */
  public speak(text: string, options?: SpeakOptions | SpeechLang) {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop ongoing speech

      // Clean emojis, icons, and special symbols
      const cleaned = text
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/[⭐🌸🐰🐱🐻🦊🎉💡🔥🏆🎁✏️📚🎮🥕🚂🎈🍎🍓🍪🪙🇬🇧🇻🇳📐🎨🧩📖🅰️]/g, '')
        .replace(/[*_~`]/g, '')
        .trim();

      if (!cleaned) return;

      const opts: SpeakOptions = typeof options === 'string' ? { lang: options } : options || {};
      const isEnglish = opts.lang === 'en' || opts.lang === 'en-US';

      const utterance = new SpeechSynthesisUtterance(cleaned);

      if (isEnglish) {
        // Explicitly English voice for English vocabulary/letters only
        utterance.lang = 'en-US';
        utterance.rate = opts.rate ?? 0.85; // Clear pace for 6yo child
        utterance.pitch = opts.pitch ?? 1.1;

        const enVoice = this.getEnglishVoice();
        if (enVoice) {
          utterance.voice = enVoice;
        }
      } else {
        // ALWAYS Vietnamese voice for everything else (Math, Vietnamese reading, Mascot, UI, etc.)
        utterance.lang = 'vi-VN';
        utterance.rate = opts.rate ?? 0.95; // Friendly warm pace for Vietnamese 1st grader
        utterance.pitch = opts.pitch ?? 1.15;

        const viVoice = this.getVietnameseVoice();
        if (viVoice) {
          utterance.voice = viVoice;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS error:', e);
    }
  }

  // Explicit helper to speak in Vietnamese
  public speakVietnamese(text: string) {
    this.speak(text, { lang: 'vi-VN' });
  }

  // Explicit helper to speak English words (for English subject cards only)
  public speakEnglish(text: string) {
    this.speak(text, { lang: 'en-US' });
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const sound = new SoundService();

