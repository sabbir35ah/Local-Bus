/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioManager {
  private ctx: AudioContext | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineSubOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;

  public sfxEnabled: boolean = true;
  public voiceEnabled: boolean = false;
  public engineVolume: number = 0.35;
  public sfxVolume: number = 0.7;

  private isEngineRunning: boolean = false;
  private hornCooldown: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public initOnUserAction(): void {
    const ctx = this.getContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  /**
   * Start procedural diesel engine rumble
   */
  public startEngine(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx || this.isEngineRunning) return;

    try {
      this.engineOsc = ctx.createOscillator();
      this.engineSubOsc = ctx.createOscillator();
      this.engineFilter = ctx.createBiquadFilter();
      this.engineGain = ctx.createGain();

      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.setValueAtTime(38, ctx.currentTime);

      this.engineSubOsc.type = 'triangle';
      this.engineSubOsc.frequency.setValueAtTime(19, ctx.currentTime);

      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.setValueAtTime(140, ctx.currentTime);
      this.engineFilter.Q.setValueAtTime(3, ctx.currentTime);

      this.engineGain.gain.setValueAtTime(this.engineVolume, ctx.currentTime);

      this.engineOsc.connect(this.engineFilter);
      this.engineSubOsc.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(ctx.destination);

      this.engineOsc.start();
      this.engineSubOsc.start();
      this.isEngineRunning = true;
    } catch {
      // Fallback if audio fails
    }
  }

  /**
   * Update engine RPM pitch and filter based on bus speed (0 - 120 km/h)
   */
  public updateEngineSpeed(speedKmH: number, isAccelerating: boolean): void {
    if (!this.isEngineRunning || !this.ctx || !this.engineOsc || !this.engineSubOsc || !this.engineFilter) return;

    const ctx = this.ctx;
    const speedRatio = Math.min(1.2, speedKmH / 100);
    const targetFreq = 38 + speedRatio * 52 + (isAccelerating ? 8 : 0);
    const targetFilter = 140 + speedRatio * 320 + (isAccelerating ? 60 : 0);

    const now = ctx.currentTime;
    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.1);
    this.engineSubOsc.frequency.setTargetAtTime(targetFreq * 0.5, now, 0.1);
    this.engineFilter.frequency.setTargetAtTime(targetFilter, now, 0.1);
  }

  public stopEngine(): void {
    if (!this.isEngineRunning) return;
    try {
      this.engineOsc?.stop();
      this.engineSubOsc?.stop();
      this.engineOsc?.disconnect();
      this.engineSubOsc?.disconnect();
      this.engineGain?.disconnect();
    } catch {
      // Ignore cleanup error
    }
    this.isEngineRunning = false;
  }

  /**
   * Play Air Brake release hiss
   */
  public playAirBrake(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.12));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, ctx.currentTime);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(this.sfxVolume * 0.5, ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch {
      // Audio fallback
    }
  }

  /**
   * Play Dhaka Bus Legendary Horn (Classic, Musical, or Staccato)
   */
  public playHorn(type: 'classic' | 'musical' | 'staccato' = 'classic'): boolean {
    if (!this.sfxEnabled || this.hornCooldown) return false;
    const ctx = this.getContext();
    if (!ctx) return false;

    this.hornCooldown = true;
    setTimeout(() => {
      this.hornCooldown = false;
    }, 700);

    const now = ctx.currentTime;

    if (type === 'classic') {
      // Powerful twin air horn blast (440Hz + 554.37Hz)
      const freqs = [440, 554.37];
      freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.02, now + 0.45);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.45, now + 0.04);
        gain.gain.setValueAtTime(this.sfxVolume * 0.45, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.52);
      });
    } else if (type === 'musical') {
      // 4-note Dhaka musical air horn fanfare
      const notes = [
        { f: 440, t: 0, d: 0.1 },
        { f: 554, t: 0.11, d: 0.1 },
        { f: 659, t: 0.22, d: 0.12 },
        { f: 880, t: 0.36, d: 0.28 }
      ];

      notes.forEach(({ f, t, d }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0, now + t);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.4, now + t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } else {
      // Staccato triple blast
      const blasts = [0, 0.14, 0.28];
      blasts.forEach(t => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(466, now + t);
        osc2.frequency.setValueAtTime(587, now + t);

        gain.gain.setValueAtTime(0, now + t);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.4, now + t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.09);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now + t);
        osc2.start(now + t);
        osc1.stop(now + t + 0.1);
        osc2.stop(now + t + 0.1);
      });
    }

    return true;
  }

  /**
   * Metallic collision crash sound
   */
  public playCrash(severity: 'light' | 'heavy' = 'light'): void {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = severity === 'heavy' ? 0.6 : 0.3;

    // Noise component
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * (severity === 'heavy' ? 0.2 : 0.08)));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(severity === 'heavy' ? 800 : 1600, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(this.sfxVolume * (severity === 'heavy' ? 0.9 : 0.5), now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // Detuned metallic hit clang
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(severity === 'heavy' ? 95 : 190, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + duration);

    oscGain.gain.setValueAtTime(this.sfxVolume * (severity === 'heavy' ? 0.8 : 0.4), now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Cash / Fare coin chimes
   */
  public playCoinChime(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [987.77, 1318.51, 1567.98]; // B5, E6, G6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.35, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  }

  /**
   * Passenger whistle / stop bell
   */
  public playPassengerBoard(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(659, now);
    osc.frequency.setValueAtTime(880, now + 0.1);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.38);
  }

  /**
   * Near miss swish sound
   */
  public playNearMiss(): void {
    if (!this.sfxEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.3);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.35, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }
}

export const soundManager = new AudioManager();
