/**
 * audioEngine.ts
 * Pure Web Audio API synthesis — no external files required.
 * Each start function creates its own AudioContext and returns a stop() closure.
 *
 * Route-to-destination variants allow mixing audio into a MediaStreamDestination
 * for video recording (connectToDestination functions).
 */

// ── Noise buffer generators ───────────────────────────────────────────────────

function createWhiteNoiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const frameCount = sampleRate * seconds;
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createBrownNoiseBuffer(ctx: AudioContext, seconds = 2): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const frameCount = sampleRate * seconds;
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  let maxVal = 0.001;
  for (let i = 0; i < frameCount; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    const sample = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
    data[i] = sample;
    if (Math.abs(sample) > maxVal) maxVal = Math.abs(sample);
  }
  // Normalize
  for (let i = 0; i < frameCount; i++) {
    data[i] /= maxVal;
  }
  return buffer;
}

// ── Nature sound synthesis ────────────────────────────────────────────────────

export function startNatureSound(type: string, volume: number): () => void {
  const ctx = new (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  )();
  const masterGain = ctx.createGain();
  masterGain.gain.value = volume;
  masterGain.connect(ctx.destination);

  const stopFns: (() => void)[] = [];

  switch (type) {
    case "Rain": {
      // White noise → bandpass filter → gain
      const src = ctx.createBufferSource();
      src.buffer = createWhiteNoiseBuffer(ctx, 3);
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1200;
      filter.Q.value = 0.8;

      src.connect(filter);
      filter.connect(masterGain);
      src.start();
      stopFns.push(() => src.stop());
      break;
    }

    case "Campfire": {
      // Brown noise → lowpass → gain + slow crackle LFO
      const src = ctx.createBufferSource();
      src.buffer = createBrownNoiseBuffer(ctx, 3);
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 600;

      // Crackle: slow random amplitude modulation
      const crackleGain = ctx.createGain();
      crackleGain.gain.value = 0.85;

      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.8;
      lfo.type = "sawtooth";
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.15;
      lfo.connect(lfoGain);
      lfoGain.connect(crackleGain.gain);

      src.connect(filter);
      filter.connect(crackleGain);
      crackleGain.connect(masterGain);
      src.start();
      lfo.start();
      stopFns.push(() => {
        src.stop();
        lfo.stop();
      });
      break;
    }

    case "Forest / Birds": {
      // Base: filtered white noise (bandpass 800 Hz)
      const src = ctx.createBufferSource();
      src.buffer = createWhiteNoiseBuffer(ctx, 3);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 800;
      filter.Q.value = 1.5;
      src.connect(filter);
      filter.connect(masterGain);
      src.start();
      stopFns.push(() => src.stop());

      // Periodic bird chirps
      let chirpTimeout: ReturnType<typeof setTimeout>;
      const scheduleChirp = () => {
        const delay = 2000 + Math.random() * 3000;
        chirpTimeout = setTimeout(() => {
          if (ctx.state === "closed") return;
          const chirpOsc = ctx.createOscillator();
          const chirpGain = ctx.createGain();
          chirpOsc.type = "sine";
          const startFreq = 800 + Math.random() * 800;
          const endFreq = startFreq + 200 + Math.random() * 600;
          chirpOsc.frequency.setValueAtTime(startFreq, ctx.currentTime);
          chirpOsc.frequency.linearRampToValueAtTime(
            endFreq,
            ctx.currentTime + 0.15,
          );
          chirpOsc.frequency.linearRampToValueAtTime(
            startFreq + 100,
            ctx.currentTime + 0.3,
          );
          chirpGain.gain.setValueAtTime(0, ctx.currentTime);
          chirpGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.05);
          chirpGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
          chirpOsc.connect(chirpGain);
          chirpGain.connect(masterGain);
          chirpOsc.start(ctx.currentTime);
          chirpOsc.stop(ctx.currentTime + 0.35);
          scheduleChirp();
        }, delay);
      };
      scheduleChirp();
      stopFns.push(() => clearTimeout(chirpTimeout));
      break;
    }

    case "Ocean Waves": {
      // White noise → lowpass → gain modulated by slow LFO
      const src = ctx.createBufferSource();
      src.buffer = createWhiteNoiseBuffer(ctx, 4);
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 400;

      const waveGain = ctx.createGain();
      waveGain.gain.value = 0.6;

      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.12;
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = 0.4;
      lfo.connect(lfoDepth);
      lfoDepth.connect(waveGain.gain);

      src.connect(filter);
      filter.connect(waveGain);
      waveGain.connect(masterGain);
      src.start();
      lfo.start();
      stopFns.push(() => {
        src.stop();
        lfo.stop();
      });
      break;
    }

    case "Thunder Storm": {
      // Rain layer
      const rainSrc = ctx.createBufferSource();
      rainSrc.buffer = createWhiteNoiseBuffer(ctx, 3);
      rainSrc.loop = true;
      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = "bandpass";
      rainFilter.frequency.value = 1000;
      rainFilter.Q.value = 0.7;
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.7;
      rainSrc.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(masterGain);
      rainSrc.start();
      stopFns.push(() => rainSrc.stop());

      // Low rumble (brown noise)
      const rumbleSrc = ctx.createBufferSource();
      rumbleSrc.buffer = createBrownNoiseBuffer(ctx, 3);
      rumbleSrc.loop = true;
      const rumbleFilter = ctx.createBiquadFilter();
      rumbleFilter.type = "lowpass";
      rumbleFilter.frequency.value = 200;
      const rumbleGain = ctx.createGain();
      rumbleGain.gain.value = 0.5;
      rumbleSrc.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(masterGain);
      rumbleSrc.start();
      stopFns.push(() => rumbleSrc.stop());

      // Occasional thunder bursts
      let thunderTimeout: ReturnType<typeof setTimeout>;
      const scheduleThunder = () => {
        const delay = 6000 + Math.random() * 10000;
        thunderTimeout = setTimeout(() => {
          if (ctx.state === "closed") return;
          const tGain = ctx.createGain();
          tGain.gain.setValueAtTime(0, ctx.currentTime);
          tGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.1);
          tGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
          const tFilter = ctx.createBiquadFilter();
          tFilter.type = "lowpass";
          tFilter.frequency.value = 150;
          const tSrc = ctx.createBufferSource();
          tSrc.buffer = createBrownNoiseBuffer(ctx, 3);
          tSrc.connect(tFilter);
          tFilter.connect(tGain);
          tGain.connect(masterGain);
          tSrc.start(ctx.currentTime);
          tSrc.stop(ctx.currentTime + 2.5);
          scheduleThunder();
        }, delay);
      };
      scheduleThunder();
      stopFns.push(() => clearTimeout(thunderTimeout));
      break;
    }

    case "Flowing River": {
      // Pink-ish noise: bandpass around 600 Hz + slight tremolo
      const src = ctx.createBufferSource();
      src.buffer = createWhiteNoiseBuffer(ctx, 3);
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 600;
      filter.Q.value = 2;

      const tremoloGain = ctx.createGain();
      tremoloGain.gain.value = 0.75;

      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.25;
      lfo.connect(lfoGain);
      lfoGain.connect(tremoloGain.gain);

      src.connect(filter);
      filter.connect(tremoloGain);
      tremoloGain.connect(masterGain);
      src.start();
      lfo.start();
      stopFns.push(() => {
        src.stop();
        lfo.stop();
      });
      break;
    }

    case "Wind": {
      // White noise → lowpass with sweeping frequency automation
      const src = ctx.createBufferSource();
      src.buffer = createWhiteNoiseBuffer(ctx, 3);
      src.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;

      // Automate filter frequency to sweep between 500–2000 Hz
      const sweepCycle = 4;
      const now = ctx.currentTime;
      for (let i = 0; i < 60; i++) {
        const t = now + i * sweepCycle;
        filter.frequency.setValueAtTime(500, t);
        filter.frequency.linearRampToValueAtTime(2000, t + sweepCycle / 2);
        filter.frequency.linearRampToValueAtTime(500, t + sweepCycle);
      }

      src.connect(filter);
      filter.connect(masterGain);
      src.start();
      stopFns.push(() => src.stop());
      break;
    }

    default:
      // Silence / None
      break;
  }

  return () => {
    for (const fn of stopFns) fn();
    ctx.close().catch(() => {});
  };
}

// ── Frequency tone generator ──────────────────────────────────────────────────

export function startFrequencyTone(
  hz: number,
  waveform: OscillatorType,
  volume: number,
): () => void {
  const ctx = new (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  )();
  const gainNode = ctx.createGain();
  gainNode.gain.value = volume;
  gainNode.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = waveform;
  osc.frequency.value = hz;
  osc.connect(gainNode);
  osc.start();

  return () => {
    osc.stop();
    ctx.close().catch(() => {});
  };
}

// ── Route-to-destination variants (for video recording) ──────────────────────

/**
 * Connect a nature sound generator to an existing AudioContext's destination node
 * (used for recording). Returns a stop function.
 */
export function connectNatureSoundToCtx(
  type: string,
  volume: number,
  ctx: AudioContext,
  dest: AudioNode,
): () => void {
  const masterGain = ctx.createGain();
  masterGain.gain.value = volume;
  masterGain.connect(dest);

  const stopFns: (() => void)[] = [];

  switch (type) {
    case "Rain": {
      const src = ctx.createBufferSource();
      src.buffer = createWhiteNoiseBuffer(ctx, 3);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1200;
      filter.Q.value = 0.8;
      src.connect(filter);
      filter.connect(masterGain);
      src.start();
      stopFns.push(() => src.stop());
      break;
    }
    case "Campfire": {
      const src = ctx.createBufferSource();
      src.buffer = createBrownNoiseBuffer(ctx, 3);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 600;
      const crackleGain = ctx.createGain();
      crackleGain.gain.value = 0.85;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.8;
      lfo.type = "sawtooth";
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.15;
      lfo.connect(lfoGain);
      lfoGain.connect(crackleGain.gain);
      src.connect(filter);
      filter.connect(crackleGain);
      crackleGain.connect(masterGain);
      src.start();
      lfo.start();
      stopFns.push(() => {
        src.stop();
        lfo.stop();
      });
      break;
    }
    case "Forest / Birds": {
      const src = ctx.createBufferSource();
      src.buffer = createWhiteNoiseBuffer(ctx, 3);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 800;
      filter.Q.value = 1.5;
      src.connect(filter);
      filter.connect(masterGain);
      src.start();
      stopFns.push(() => src.stop());
      break;
    }
    case "Ocean Waves": {
      const src = ctx.createBufferSource();
      src.buffer = createWhiteNoiseBuffer(ctx, 4);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 400;
      const waveGain = ctx.createGain();
      waveGain.gain.value = 0.6;
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.12;
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = 0.4;
      lfo.connect(lfoDepth);
      lfoDepth.connect(waveGain.gain);
      src.connect(filter);
      filter.connect(waveGain);
      waveGain.connect(masterGain);
      src.start();
      lfo.start();
      stopFns.push(() => {
        src.stop();
        lfo.stop();
      });
      break;
    }
    case "Thunder Storm": {
      const rainSrc = ctx.createBufferSource();
      rainSrc.buffer = createWhiteNoiseBuffer(ctx, 3);
      rainSrc.loop = true;
      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = "bandpass";
      rainFilter.frequency.value = 1000;
      rainFilter.Q.value = 0.7;
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.7;
      rainSrc.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(masterGain);
      rainSrc.start();
      stopFns.push(() => rainSrc.stop());
      break;
    }
    case "Flowing River": {
      const src = ctx.createBufferSource();
      src.buffer = createWhiteNoiseBuffer(ctx, 3);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 600;
      filter.Q.value = 2;
      const tremoloGain = ctx.createGain();
      tremoloGain.gain.value = 0.75;
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 3;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.25;
      lfo.connect(lfoGain);
      lfoGain.connect(tremoloGain.gain);
      src.connect(filter);
      filter.connect(tremoloGain);
      tremoloGain.connect(masterGain);
      src.start();
      lfo.start();
      stopFns.push(() => {
        src.stop();
        lfo.stop();
      });
      break;
    }
    case "Wind": {
      const src = ctx.createBufferSource();
      src.buffer = createWhiteNoiseBuffer(ctx, 3);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;
      const sweepCycle = 4;
      const now = ctx.currentTime;
      for (let i = 0; i < 60; i++) {
        const t = now + i * sweepCycle;
        filter.frequency.setValueAtTime(500, t);
        filter.frequency.linearRampToValueAtTime(2000, t + sweepCycle / 2);
        filter.frequency.linearRampToValueAtTime(500, t + sweepCycle);
      }
      src.connect(filter);
      filter.connect(masterGain);
      src.start();
      stopFns.push(() => src.stop());
      break;
    }
    default:
      break;
  }

  return () => {
    for (const fn of stopFns) fn();
  };
}

/**
 * Connect a frequency tone oscillator to an existing AudioContext destination node.
 * Returns a stop function.
 */
export function connectFrequencyToneToCtx(
  hz: number,
  waveform: OscillatorType,
  volume: number,
  ctx: AudioContext,
  dest: AudioNode,
): () => void {
  const gainNode = ctx.createGain();
  gainNode.gain.value = volume;
  gainNode.connect(dest);

  const osc = ctx.createOscillator();
  osc.type = waveform;
  osc.frequency.value = hz;
  osc.connect(gainNode);
  osc.start();

  return () => {
    osc.stop();
  };
}
