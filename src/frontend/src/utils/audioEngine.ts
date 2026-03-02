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

// ── Shared synthesis helpers ──────────────────────────────────────────────────

/** Schedule bird chirp events (used by Forest/Birds, Morning Dew, Jungle) */
function scheduleBirdChirps(
  ctx: AudioContext,
  masterGain: GainNode,
  minDelay: number,
  maxDelay: number,
  freqMin: number,
  freqMax: number,
  gainPeak: number,
): () => void {
  let timeout: ReturnType<typeof setTimeout>;
  const schedule = () => {
    const delay = minDelay + Math.random() * (maxDelay - minDelay);
    timeout = setTimeout(() => {
      if (ctx.state === "closed") return;
      const chirpOsc = ctx.createOscillator();
      const chirpGain = ctx.createGain();
      chirpOsc.type = "sine";
      const startFreq = freqMin + Math.random() * (freqMax - freqMin);
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
      chirpGain.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + 0.05);
      chirpGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      chirpOsc.connect(chirpGain);
      chirpGain.connect(masterGain);
      chirpOsc.start(ctx.currentTime);
      chirpOsc.stop(ctx.currentTime + 0.35);
      schedule();
    }, delay);
  };
  schedule();
  return () => clearTimeout(timeout);
}

/** Schedule sparse drip events (used by Cave Drips) */
function scheduleDrips(ctx: AudioContext, masterGain: GainNode): () => void {
  let timeout: ReturnType<typeof setTimeout>;
  const schedule = () => {
    const delay = 1500 + Math.random() * 2500;
    timeout = setTimeout(() => {
      if (ctx.state === "closed") return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay_ = ctx.createDelay(0.5);
      const feedback = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 600 + Math.random() * 300;
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      delay_.delayTime.value = 0.18;
      feedback.gain.value = 0.3;
      osc.connect(gain);
      gain.connect(masterGain);
      gain.connect(delay_);
      delay_.connect(feedback);
      feedback.connect(delay_);
      delay_.connect(masterGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
      schedule();
    }, delay);
  };
  schedule();
  return () => clearTimeout(timeout);
}

/** Schedule Tibetan bowl resonances */
function scheduleTibetanBowls(
  ctx: AudioContext,
  masterGain: GainNode,
): () => void {
  let timeout: ReturnType<typeof setTimeout>;
  const harmonics = [220, 440, 660, 1100];
  const schedule = () => {
    const delay = 3000 + Math.random() * 5000;
    timeout = setTimeout(() => {
      if (ctx.state === "closed") return;
      const decayTime = 5 + Math.random() * 3;
      for (const freq of harmonics) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.18 / harmonics.length, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + decayTime,
        );
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + decayTime + 0.1);
      }
      schedule();
    }, delay);
  };
  // Fire one immediately
  const initialDelay = 200;
  timeout = setTimeout(() => {
    if (ctx.state === "closed") return;
    const decayTime = 6;
    for (const freq of harmonics) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18 / harmonics.length, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + decayTime,
      );
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + decayTime + 0.1);
    }
    schedule();
  }, initialDelay);
  return () => clearTimeout(timeout);
}

/** Schedule occasional high desert chirps */
function scheduleDesertChirps(
  ctx: AudioContext,
  masterGain: GainNode,
): () => void {
  let timeout: ReturnType<typeof setTimeout>;
  const schedule = () => {
    const delay = 5000 + Math.random() * 7000;
    timeout = setTimeout(() => {
      if (ctx.state === "closed") return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 2000 + Math.random() * 2000;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
      schedule();
    }, delay);
  };
  schedule();
  return () => clearTimeout(timeout);
}

// ── Core sound builder (used by both startNatureSound and connectNatureSoundToCtx) ──

function buildNatureSound(
  type: string,
  volume: number,
  ctx: AudioContext,
  outputNode: AudioNode,
): () => void {
  const masterGain = ctx.createGain();
  masterGain.gain.value = volume;
  masterGain.connect(outputNode);

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
      stopFns.push(
        scheduleBirdChirps(ctx, masterGain, 2000, 3000, 800, 1600, 0.4),
      );
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
      // Low rumble
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
      // Thunder bursts
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

    // ── 10 New Sounds ─────────────────────────────────────────────────────────

    case "Night Crickets": {
      // Multiple slightly detuned oscillators at 3000–6000 Hz with 8 Hz LFO pulse
      const freqs = [3200, 3400, 3800, 4200, 4800, 5400];
      for (const baseFreq of freqs) {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = baseFreq + (Math.random() - 0.5) * 200;
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.06;
        // LFO for cricket pulse rhythm ~8 Hz
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 7.5 + Math.random() * 1.5;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.055;
        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);
        osc.connect(gainNode);
        gainNode.connect(masterGain);
        osc.start();
        lfo.start();
        stopFns.push(() => {
          osc.stop();
          lfo.stop();
        });
      }
      break;
    }

    case "Deep Space": {
      // Low drone 40–60 Hz sine + filtered brown noise with heavy lowpass
      const droneOsc = ctx.createOscillator();
      droneOsc.type = "sine";
      droneOsc.frequency.value = 48;
      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.35;
      // Slow amplitude LFO (0.05 Hz)
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.2;
      lfo.connect(lfoGain);
      lfoGain.connect(droneGain.gain);
      droneOsc.connect(droneGain);
      droneGain.connect(masterGain);
      droneOsc.start();
      lfo.start();
      // Brown noise through heavy lowpass
      const noiseSrc = ctx.createBufferSource();
      noiseSrc.buffer = createBrownNoiseBuffer(ctx, 4);
      noiseSrc.loop = true;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.value = 80;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.2;
      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noiseSrc.start();
      stopFns.push(() => {
        droneOsc.stop();
        lfo.stop();
        noiseSrc.stop();
      });
      break;
    }

    case "Cave Drips": {
      // Sparse random drip events with reverb-like comb filter
      const ambientNoise = ctx.createBufferSource();
      ambientNoise.buffer = createWhiteNoiseBuffer(ctx, 3);
      ambientNoise.loop = true;
      const ambientFilter = ctx.createBiquadFilter();
      ambientFilter.type = "highpass";
      ambientFilter.frequency.value = 2000;
      const ambientGain = ctx.createGain();
      ambientGain.gain.value = 0.015;
      ambientNoise.connect(ambientFilter);
      ambientFilter.connect(ambientGain);
      ambientGain.connect(masterGain);
      ambientNoise.start();
      stopFns.push(() => ambientNoise.stop());
      stopFns.push(scheduleDrips(ctx, masterGain));
      break;
    }

    case "Tibetan Bowls": {
      // Rich harmonic resonance with slow decay
      stopFns.push(scheduleTibetanBowls(ctx, masterGain));
      break;
    }

    case "Waterfall": {
      // Broadband white noise through gentle lowpass + high-shelf boost
      const src = ctx.createBufferSource();
      src.buffer = createWhiteNoiseBuffer(ctx, 3);
      src.loop = true;
      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = "lowpass";
      lpFilter.frequency.value = 2500;
      const hsFilter = ctx.createBiquadFilter();
      hsFilter.type = "highshelf";
      hsFilter.frequency.value = 1800;
      hsFilter.gain.value = 4;
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.85;
      src.connect(lpFilter);
      lpFilter.connect(hsFilter);
      hsFilter.connect(gainNode);
      gainNode.connect(masterGain);
      src.start();
      stopFns.push(() => src.stop());
      break;
    }

    case "Morning Dew": {
      // Very quiet; sparse bird chirps (4–8s) + faint wind breath
      const windSrc = ctx.createBufferSource();
      windSrc.buffer = createWhiteNoiseBuffer(ctx, 3);
      windSrc.loop = true;
      const windFilter = ctx.createBiquadFilter();
      windFilter.type = "lowpass";
      windFilter.frequency.value = 400;
      const windGain = ctx.createGain();
      windGain.gain.value = 0.08;
      windSrc.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(masterGain);
      windSrc.start();
      stopFns.push(() => windSrc.stop());
      stopFns.push(
        scheduleBirdChirps(ctx, masterGain, 4000, 8000, 1000, 2200, 0.25),
      );
      break;
    }

    case "Storm at Sea": {
      // Heavy ocean waves + rain noise + occasional deep thunder
      // Ocean waves
      const waveSrc = ctx.createBufferSource();
      waveSrc.buffer = createWhiteNoiseBuffer(ctx, 4);
      waveSrc.loop = true;
      const waveFilter = ctx.createBiquadFilter();
      waveFilter.type = "lowpass";
      waveFilter.frequency.value = 300;
      const waveGain = ctx.createGain();
      waveGain.gain.value = 0.7;
      const waveLfo = ctx.createOscillator();
      waveLfo.type = "sine";
      waveLfo.frequency.value = 0.08;
      const waveLfoDepth = ctx.createGain();
      waveLfoDepth.gain.value = 0.5;
      waveLfo.connect(waveLfoDepth);
      waveLfoDepth.connect(waveGain.gain);
      waveSrc.connect(waveFilter);
      waveFilter.connect(waveGain);
      waveGain.connect(masterGain);
      waveSrc.start();
      waveLfo.start();
      stopFns.push(() => {
        waveSrc.stop();
        waveLfo.stop();
      });
      // Rain
      const rainSrc = ctx.createBufferSource();
      rainSrc.buffer = createWhiteNoiseBuffer(ctx, 3);
      rainSrc.loop = true;
      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = "bandpass";
      rainFilter.frequency.value = 1500;
      rainFilter.Q.value = 0.6;
      const rainGain = ctx.createGain();
      rainGain.gain.value = 0.4;
      rainSrc.connect(rainFilter);
      rainFilter.connect(rainGain);
      rainGain.connect(masterGain);
      rainSrc.start();
      stopFns.push(() => rainSrc.stop());
      // Deep thunder
      let seaThunderTimeout: ReturnType<typeof setTimeout>;
      const scheduleSeaThunder = () => {
        const delay = 5000 + Math.random() * 8000;
        seaThunderTimeout = setTimeout(() => {
          if (ctx.state === "closed") return;
          const tGain = ctx.createGain();
          tGain.gain.setValueAtTime(0, ctx.currentTime);
          tGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.15);
          tGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
          const tFilter = ctx.createBiquadFilter();
          tFilter.type = "lowpass";
          tFilter.frequency.value = 120;
          const tSrc = ctx.createBufferSource();
          tSrc.buffer = createBrownNoiseBuffer(ctx, 4);
          tSrc.connect(tFilter);
          tFilter.connect(tGain);
          tGain.connect(masterGain);
          tSrc.start(ctx.currentTime);
          tSrc.stop(ctx.currentTime + 3.2);
          scheduleSeaThunder();
        }, delay);
      };
      scheduleSeaThunder();
      stopFns.push(() => clearTimeout(seaThunderTimeout));
      break;
    }

    case "Sacred Silence": {
      // Barely perceptible 40 Hz drone at very low gain, slow 0.02 Hz LFO
      const droneOsc = ctx.createOscillator();
      droneOsc.type = "sine";
      droneOsc.frequency.value = 40;
      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.05;
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.02;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.03;
      lfo.connect(lfoGain);
      lfoGain.connect(droneGain.gain);
      droneOsc.connect(droneGain);
      droneGain.connect(masterGain);
      droneOsc.start();
      lfo.start();
      stopFns.push(() => {
        droneOsc.stop();
        lfo.stop();
      });
      break;
    }

    case "Jungle": {
      // Dense background: two bird chirp streams + insect hum + rustling
      stopFns.push(
        scheduleBirdChirps(ctx, masterGain, 1500, 3500, 400, 800, 0.3),
      );
      stopFns.push(
        scheduleBirdChirps(ctx, masterGain, 2000, 4000, 900, 2000, 0.28),
      );
      // Insect hum (square wave ~200 Hz low gain through bandpass)
      const insectOsc = ctx.createOscillator();
      insectOsc.type = "square";
      insectOsc.frequency.value = 200;
      const insectFilter = ctx.createBiquadFilter();
      insectFilter.type = "bandpass";
      insectFilter.frequency.value = 200;
      insectFilter.Q.value = 5;
      const insectGain = ctx.createGain();
      insectGain.gain.value = 0.04;
      insectOsc.connect(insectFilter);
      insectFilter.connect(insectGain);
      insectGain.connect(masterGain);
      insectOsc.start();
      stopFns.push(() => insectOsc.stop());
      // Rustling (white noise bandpass ~1500 Hz)
      const rustleSrc = ctx.createBufferSource();
      rustleSrc.buffer = createWhiteNoiseBuffer(ctx, 3);
      rustleSrc.loop = true;
      const rustleFilter = ctx.createBiquadFilter();
      rustleFilter.type = "bandpass";
      rustleFilter.frequency.value = 1500;
      rustleFilter.Q.value = 3;
      const rustleGain = ctx.createGain();
      rustleGain.gain.value = 0.12;
      rustleSrc.connect(rustleFilter);
      rustleFilter.connect(rustleGain);
      rustleGain.connect(masterGain);
      rustleSrc.start();
      stopFns.push(() => rustleSrc.stop());
      break;
    }

    case "Desert Wind": {
      // Sweeping lowpass white noise (200–800 Hz over ~8s cycles) + sparse high chirps
      const src = ctx.createBufferSource();
      src.buffer = createWhiteNoiseBuffer(ctx, 4);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 400;
      const sweepCycle = 8;
      const now = ctx.currentTime;
      for (let i = 0; i < 120; i++) {
        const t = now + i * sweepCycle;
        filter.frequency.setValueAtTime(200, t);
        filter.frequency.linearRampToValueAtTime(800, t + sweepCycle / 2);
        filter.frequency.linearRampToValueAtTime(200, t + sweepCycle);
      }
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.55;
      src.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(masterGain);
      src.start();
      stopFns.push(() => src.stop());
      stopFns.push(scheduleDesertChirps(ctx, masterGain));
      break;
    }

    default:
      // Silence / None
      break;
  }

  return () => {
    for (const fn of stopFns) fn();
  };
}

// ── Nature sound synthesis ────────────────────────────────────────────────────

export function startNatureSound(type: string, volume: number): () => void {
  const ctx = new (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext
  )();

  const stop = buildNatureSound(type, volume, ctx, ctx.destination);

  return () => {
    stop();
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
  return buildNatureSound(type, volume, ctx, dest);
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

/**
 * Connect a frequency tone to BOTH a destination node AND return an AnalyserNode
 * for visualization. Returns [stopFn, analyserNode].
 */
export function connectFrequencyToneWithAnalyser(
  hz: number,
  waveform: OscillatorType,
  volume: number,
  ctx: AudioContext,
  dest: AudioNode,
): [() => void, AnalyserNode] {
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;

  const gainNode = ctx.createGain();
  gainNode.gain.value = volume;

  const osc = ctx.createOscillator();
  osc.type = waveform;
  osc.frequency.value = hz;
  osc.connect(gainNode);
  gainNode.connect(analyser);
  analyser.connect(dest);
  osc.start();

  return [() => osc.stop(), analyser];
}

/**
 * Connect a nature sound to BOTH a destination node AND return an AnalyserNode
 * for visualization.
 */
export function connectNatureSoundWithAnalyser(
  type: string,
  volume: number,
  ctx: AudioContext,
  dest: AudioNode,
): [() => void, AnalyserNode] {
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.connect(dest);

  // Build sound into the analyser (analyser acts as the output node)
  const stopFn = buildNatureSound(type, volume, ctx, analyser);
  return [stopFn, analyser];
}
