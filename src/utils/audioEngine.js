let audioContext;
let masterGain;
let geigerInterval;
let isMuted = false;
let volumeLevel = 0.4;

const getContext = () => {
    if (!audioContext) {
        audioContext = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
        masterGain = audioContext.createGain();
        masterGain.gain.value = volumeLevel;
        masterGain.connect(audioContext.destination);
    }
    return audioContext;
};

const connectNode = (node) => {
    if (!masterGain) {
        getContext();
    }
    node.connect(masterGain);
};

const safeStart = (node) => {
    const ctx = getContext();
    if (ctx.state === "suspended") {
        ctx.resume();
    }
    node.start();
};

const playTone = (frequency, duration = 0.08, type = "sine") => {
    if (isMuted) return;
    const ctx = getContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = 0.15;
    oscillator.connect(gain);
    connectNode(gain);
    safeStart(oscillator);
    oscillator.stop(ctx.currentTime + duration);
};

const playNoiseBurst = (duration = 0.02) => {
    if (isMuted) return;
    const ctx = getContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
        data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = 0.12;
    source.connect(gain);
    connectNode(gain);
    safeStart(source);
    source.stop(ctx.currentTime + duration);
};

export const audioEngine = {
    playClick() {
        playTone(800, 0.05);
    },
    playSuccess() {
        if (isMuted) return;
        const ctx = getContext();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.value = 0.18;
        oscillator.connect(gain);
        connectNode(gain);
        safeStart(oscillator);
        oscillator.stop(ctx.currentTime + 0.35);
    },
    playAlarm() {
        if (isMuted) return;
        const ctx = getContext();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "square";
        oscillator.frequency.value = 440;
        gain.gain.value = 0.2;
        oscillator.connect(gain);
        connectNode(gain);
        safeStart(oscillator);
        const switchTime = ctx.currentTime + 0.2;
        oscillator.frequency.setValueAtTime(880, switchTime);
        oscillator.stop(ctx.currentTime + 0.5);
    },
    startGeigerCounter() {
        if (geigerInterval) return;
        geigerInterval = setInterval(() => {
            playNoiseBurst(0.015);
        }, 220);
    },
    stopGeigerCounter() {
        if (geigerInterval) {
            clearInterval(geigerInterval);
            geigerInterval = null;
        }
    },
    setVolume(level) {
        volumeLevel = Math.min(1, Math.max(0, level));
        if (masterGain) {
            masterGain.gain.value = volumeLevel;
        }
    },
    mute() {
        isMuted = true;
        if (masterGain) {
            masterGain.gain.value = 0;
        }
    },
    unmute() {
        isMuted = false;
        if (masterGain) {
            masterGain.gain.value = volumeLevel;
        }
    },
};
