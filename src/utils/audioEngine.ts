/**
 * Web Audio API synthesizer for wedding ambience and sound effects
 * Plays romantic/shehnai melodies, blessing chimes, temple bells, fireworks, wax seal break, card flips, and scratch sounds.
 */

class WeddingAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private melodyTimeout: number | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playWeddingMusic(): boolean {
    this.init();
    if (!this.ctx || this.isPlaying) return false;
    this.isPlaying = true;

    const t = this.ctx.currentTime;
    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, t);
    masterGain.gain.exponentialRampToValueAtTime(0.2, t + 2);
    masterGain.connect(this.ctx.destination);
    this.gainNode = masterGain;

    // Tampura harmonic drone
    const baseFreq = 146.83; // D3
    [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 0.75].forEach((freq, idx) => {
      if (!this.ctx || !this.gainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);

      // Low frequency modulation
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.1, t);
      lfoGain.gain.setValueAtTime(0.8, t);
      lfo.connect(osc.frequency);
      lfo.start(t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450 + idx * 80, t);
      gain.gain.setValueAtTime(0.04 / (idx + 1), t);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);
      osc.start(t);
    });

    // Indian Classical / Romantic flute-sitar raga scale: D, E, F#, G#, A, B, C#, D5
    const ragaScale = [293.66, 329.63, 369.99, 415.3, 440.0, 493.88, 554.37, 587.33];
    let noteIdx = 0;

    const playMelodyNote = () => {
      if (!this.isPlaying || !this.ctx || !this.gainNode) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const melodySequence = [0, 2, 4, 3, 2, 4, 5, 7, 6, 4, 2, 0, 1, 2, 4, 0];
      const freq = ragaScale[melodySequence[noteIdx % melodySequence.length]];
      noteIdx++;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.01, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.7);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.8, now);
      filter.Q.setValueAtTime(2.5, now);

      const duration = 1.2 + Math.random() * 0.8;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.09, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + duration);

      const nextDelay = duration * 800 + Math.random() * 600;
      this.melodyTimeout = window.setTimeout(playMelodyNote, nextDelay);
    };

    playMelodyNote();
    return true;
  }

  public stopWeddingMusic() {
    if (!this.isPlaying || !this.ctx) return;
    this.isPlaying = false;
    if (this.melodyTimeout) {
      clearTimeout(this.melodyTimeout);
      this.melodyTimeout = null;
    }
    if (this.gainNode) {
      const t = this.ctx.currentTime;
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 1);
      setTimeout(() => {
        if (this.ctx && !this.isPlaying) {
          this.ctx.close().then(() => {
            this.ctx = null;
          });
        }
      }, 1100);
    }
  }

  public toggleMusic(): boolean {
    if (this.isPlaying) {
      this.stopWeddingMusic();
      return false;
    } else {
      return this.playWeddingMusic();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public playBlessingChime() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [587.33, 739.99, 880, 1174.66, 1479.98].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.08);
      gain.gain.setValueAtTime(0.07, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 1.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 1.2);
    });
  }

  public playFireworkSound() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(150, t + 0.4);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  public playScratchSound() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120 + Math.random() * 60, t);
    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  public playCardFlipSound() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const length = Math.floor(this.ctx.sampleRate * 0.18);
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length * 0.4));
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(450, t + 0.15);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    source.start(t);
  }

  public playTempleBellSound() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [
      { f: 880, g: 0.12, decay: 2.2 },
      { f: 1760, g: 0.06, decay: 1.4 },
      { f: 2640, g: 0.03, decay: 0.8 },
      { f: 3520, g: 0.015, decay: 0.5 },
    ].forEach((harm) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(harm.f, t);
      gain.gain.setValueAtTime(harm.g, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + harm.decay);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + harm.decay);
    });
  }

  public playWaxSealSound() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  public playChurchChimesSound() {
    this.init();
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    [
      { f: 329.63, delay: 0, decay: 3.5, gain: 0.15 },
      { f: 415.3, delay: 0.25, decay: 3.2, gain: 0.13 },
      { f: 493.88, delay: 0.5, decay: 3.0, gain: 0.12 },
      { f: 659.25, delay: 0.75, decay: 4.0, gain: 0.16 },
    ].forEach((note) => {
      if (!this.ctx) return;
      const noteTime = t + note.delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, noteTime);
      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.exponentialRampToValueAtTime(note.gain, noteTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + note.decay);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(noteTime);
      osc.stop(noteTime + note.decay);
    });
  }
}

export const audioEngine = new WeddingAudioEngine();
