/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class TempleAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambienceGain: GainNode | null = null;
  private isMuted: boolean = false;
  private activeAmbienceNodes: { [key: string]: AudioNode[] } = {};

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambienceGain = this.ctx.createGain();
      this.ambienceGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.ambienceGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Authentic wooden fish strike (实木中空木鱼笃笃声)
   */
  public playWoodenFish(pitchModifier = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Wood transient pop
    const baseFreq = 620 * pitchModifier;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq * 1.4, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, t + 0.015);

    // Bandpass resonant wood chamber
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(baseFreq, t);
    filter.Q.setValueAtTime(8, t);

    // Strike envelope
    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  /**
   * Resonant bronze temple bell (灵隐古铜大钟)
   */
  public playTempleBell() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Ancient bronze bell partials (inharmonic overtone series)
    const partials = [
      { freq: 172, gain: 0.6, decay: 7.0 },  // deep hum fundamental
      { freq: 284, gain: 0.5, decay: 5.5 },  // strike note
      { freq: 412, gain: 0.35, decay: 4.0 }, // tierce
      { freq: 618, gain: 0.25, decay: 3.0 }, // quint
      { freq: 940, gain: 0.15, decay: 1.8 }, // nominal
    ];

    partials.forEach(p => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.freq, t);
      // subtle pitch bend at strike
      osc.frequency.exponentialRampToValueAtTime(p.freq * 0.995, t + p.decay);

      gain.gain.setValueAtTime(p.gain, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + p.decay);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + p.decay + 0.1);
    });
  }

  /**
   * Sandalwood prayer bead click (檀木佛珠相碰清响)
   */
  public playBeadClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    const randomPitch = 1200 + Math.random() * 300;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(randomPitch, t);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, t);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  /**
   * Zen singing bowl chime (清净铜磬)
   */
  public playSingingBowl() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, t); // 528Hz Solfeggio miracle tone / peace

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(530, t); // gentle binaural shimmer

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc2.start(t);
    osc.stop(t + 4.6);
    osc2.stop(t + 4.6);
  }

  /**
   * Ambient soundscapes (流水、风鸣、梵唱低吟)
   */
  public startAmbienceTrack(type: 'stream' | 'chant' | 'wind') {
    this.stopAmbience();
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.ambienceGain) return;

    const nodes: AudioNode[] = [];
    const t = this.ctx.currentTime;

    if (type === 'stream') {
      // Pink/Brown noise water stream synthesis
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, t);
      filter.Q.setValueAtTime(1.5, t);

      const streamGain = this.ctx.createGain();
      streamGain.gain.setValueAtTime(0.18, t);

      noise.connect(filter);
      filter.connect(streamGain);
      streamGain.connect(this.ambienceGain);

      noise.start();
      nodes.push(noise, filter, streamGain);
    } else if (type === 'chant') {
      // Harmonic drone chant chord (C-G-C rich gentle meditative pad)
      const freqs = [130.81, 196.00, 261.63, 329.63];
      freqs.forEach(f => {
        if (!this.ctx || !this.ambienceGain) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.06, t);
        osc.connect(g);
        g.connect(this.ambienceGain);
        osc.start();
        nodes.push(osc, g);
      });
    } else {
      // Wind & subtle chime tone
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(432, t);
      g.gain.setValueAtTime(0.04, t);
      osc.connect(g);
      g.connect(this.ambienceGain);
      osc.start();
      nodes.push(osc, g);
    }

    this.activeAmbienceNodes[type] = nodes;
  }

  public stopAmbience() {
    Object.values(this.activeAmbienceNodes).forEach(nodeList => {
      nodeList.forEach(n => {
        try {
          if ('stop' in n && typeof (n as AudioScheduledSourceNode).stop === 'function') {
            (n as AudioScheduledSourceNode).stop();
          }
          n.disconnect();
        } catch {
          // ignore
        }
      });
    });
    this.activeAmbienceNodes = {};
  }
}

export const templeAudio = new TempleAudioSynthesizer();
