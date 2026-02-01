import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SLOTS, SHIELD_MATERIALS, GAME_CONFIG, DEMAND_CURVE, ENERGY_SOURCES } from "../utils/constants.js";
import { calculateEmissions, calculateProtection } from "../utils/calculations.js";

const initialShieldMaterial = SHIELD_MATERIALS[0]?.id ?? "lead";
const defaultTimerDurationMs = 180000;

const initialState = {
    mode: null,
    screen1: {
        slots: [...DEFAULT_SLOTS],
        totalEmissions: 0,
    },
    screen2: {
        selectedMaterialId: initialShieldMaterial,
        thickness: 0,
        protectionLevel: 0,
        hostMaterialId: initialShieldMaterial,
        hostThickness: 0,
        testResult: null,
    },
    screen3: {
        controlRods: 50,
        waterSupply: 50,
        temperature: 320,
        isStable: true,
    },
    settings: {
        volume: 0.4,
        muted: false,
        timerEnabled: true,
    },
    game: {
        phase: "setup", // "setup" | "running" | "warning" | "ended"
        outcome: null, // "win" | "lose" | null
        failureReason: null, // "blackout" | "meltdown" | "emissions" | null
        score: 0,
        currentDemandMW: GAME_CONFIG.BASE_DEMAND_MW,
        currentHour: 8,
        blackoutCountdown: null, // seconds remaining in warning
    },
};

export const useGameStore = create(
    persist(
        (set, get) => ({
            ...initialState,
            timer: {
                durationMs: defaultTimerDurationMs,
                remainingMs: defaultTimerDurationMs,
                isRunning: false,
                endsAt: null,
            },
            qr: {
                lastScan: null,
                error: null,
            },
            setMode: (mode) => set({ mode }),
            setSlots: (slots) => {
                const totalEmissions = calculateEmissions(slots);
                set({ screen1: { ...get().screen1, slots, totalEmissions } });
            },
            setShieldInputs: (payload) => {
                const next = { ...get().screen2, ...payload };
                next.protectionLevel = calculateProtection(
                    next.selectedMaterialId,
                    next.thickness
                );
                set({ screen2: next });
            },
            runShieldTest: () => {
                const { hostMaterialId, hostThickness } = get().screen2;
                const protection = calculateProtection(hostMaterialId, hostThickness);
                const testResult = protection >= 99 ? "success" : "fail";
                set({
                    screen2: {
                        ...get().screen2,
                        testResult,
                    },
                });
            },
            setShieldHostInputs: (payload) => {
                set({ screen2: { ...get().screen2, ...payload, testResult: null } });
            },
            setReactorControls: (payload) => {
                const next = { ...get().screen3, ...payload };
                const clampPercent = (v) => Math.min(100, Math.max(0, Number(v)));
                if (payload.controlRods !== undefined) {
                    next.controlRods = clampPercent(payload.controlRods);
                }
                if (payload.waterSupply !== undefined) {
                    next.waterSupply = clampPercent(payload.waterSupply);
                }
                set({ screen3: next });
            },
            tickTemperature: () => {
                const { controlRods, waterSupply, temperature } = get().screen3;

                // Simple but intuitive model:
                // - Fewer rods (lower %) => more reactivity => more heat
                // - More water => more cooling, stronger when temperature is above ambient
                const ambient = 280;
                const rodsOut = (100 - controlRods) / 100; // 0..1
                const reactivity = Math.pow(rodsOut, 1.6); // emphasize high-power region
                const heatInput = 1.8 + reactivity * 14; // °C per tick

                const coolingStrength = (waterSupply / 100) * 0.22; // per-tick fraction of (T-ambient)
                const cooling = coolingStrength * Math.max(0, temperature - ambient);

                const drift = (Math.random() - 0.5) * 0.4; // tiny noise for “live” feel
                const nextTemp = Math.max(200, temperature + heatInput - cooling + drift);

                const isStable = nextTemp >= 300 && nextTemp < 700;

                set({
                    screen3: {
                        ...get().screen3,
                        temperature: nextTemp,
                        isStable,
                    },
                });
            },
            setSettings: (payload) => {
                set({ settings: { ...get().settings, ...payload } });
            },
            setTimerDuration: (durationMs) => {
                const nextDuration = Math.max(30000, Number(durationMs));
                set({
                    timer: {
                        ...get().timer,
                        durationMs: nextDuration,
                        remainingMs: nextDuration,
                        isRunning: false,
                        endsAt: null,
                    },
                });
            },
            startTimer: () => {
                const { timer } = get();
                if (timer.isRunning) return;
                const now = Date.now();
                const remaining = timer.remainingMs ?? timer.durationMs;
                set({
                    timer: {
                        ...timer,
                        isRunning: true,
                        endsAt: now + remaining,
                        remainingMs: remaining,
                    },
                });
            },
            pauseTimer: () => {
                const { timer } = get();
                if (!timer.isRunning || !timer.endsAt) return;
                const remaining = Math.max(0, timer.endsAt - Date.now());
                set({
                    timer: {
                        ...timer,
                        isRunning: false,
                        endsAt: null,
                        remainingMs: remaining,
                    },
                });
            },
            resetTimer: () => {
                const { timer } = get();
                set({
                    timer: {
                        ...timer,
                        isRunning: false,
                        endsAt: null,
                        remainingMs: timer.durationMs,
                    },
                });
            },
            tickTimer: () => {
                const { timer } = get();
                if (!timer.isRunning || !timer.endsAt) return;
                const remaining = Math.max(0, timer.endsAt - Date.now());
                if (remaining === 0) {
                    set({
                        timer: {
                            ...timer,
                            isRunning: false,
                            endsAt: null,
                            remainingMs: 0,
                        },
                    });
                    return;
                }
                set({
                    timer: {
                        ...timer,
                        remainingMs: remaining,
                    },
                });
            },
            setQrScanResult: (payload) => {
                set({ qr: { ...get().qr, lastScan: payload, error: null } });
            },
            setQrError: (message) => {
                set({ qr: { ...get().qr, error: message } });
            },

            // === Game mechanics ===
            calculateEffectiveSupply: () => {
                const { slots } = get().screen1;
                return slots.reduce((sum, id) => {
                    if (!id) return sum;
                    const source = ENERGY_SOURCES.find((s) => s.id === id);
                    if (!source) return sum;
                    return sum + (source.capacity * source.reliability) / 100;
                }, 0);
            },

            startGame: () => {
                set({
                    game: {
                        phase: "running",
                        outcome: null,
                        failureReason: null,
                        score: 0,
                        currentDemandMW: GAME_CONFIG.BASE_DEMAND_MW,
                        currentHour: 8,
                        blackoutCountdown: null,
                    },
                });
                get().startTimer();
            },

            tickGame: () => {
                const state = get();
                if (state.game.phase !== "running" && state.game.phase !== "warning") return;

                // Update demand based on hour
                const hourIndex = state.game.currentHour % 24;
                const demandMultiplier = DEMAND_CURVE[hourIndex];
                const currentDemandMW = Math.round(GAME_CONFIG.BASE_DEMAND_MW * demandMultiplier);

                // Calculate effective supply
                const effectiveSupply = get().calculateEffectiveSupply();
                const coverage = currentDemandMW > 0 ? effectiveSupply / currentDemandMW : 1;

                // Check for meltdown
                if (state.screen3.temperature >= GAME_CONFIG.MELTDOWN_TEMP) {
                    set({
                        game: {
                            ...state.game,
                            phase: "ended",
                            outcome: "lose",
                            failureReason: "meltdown",
                            score: state.game.score + GAME_CONFIG.PENALTY_MELTDOWN,
                        },
                    });
                    return;
                }

                // Check blackout warning (10 sec countdown)
                if (coverage < GAME_CONFIG.BLACKOUT_THRESHOLD) {
                    if (state.game.phase === "warning") {
                        const countdown = (state.game.blackoutCountdown ?? GAME_CONFIG.BLACKOUT_WARNING_SEC) - 1;
                        if (countdown <= 0) {
                            // Blackout!
                            set({
                                game: {
                                    ...state.game,
                                    phase: "ended",
                                    outcome: "lose",
                                    failureReason: "blackout",
                                    score: state.game.score + GAME_CONFIG.PENALTY_BLACKOUT,
                                    blackoutCountdown: 0,
                                },
                            });
                            return;
                        }
                        set({
                            game: {
                                ...state.game,
                                currentDemandMW,
                                blackoutCountdown: countdown,
                            },
                        });
                    } else {
                        // Start warning
                        set({
                            game: {
                                ...state.game,
                                phase: "warning",
                                currentDemandMW,
                                blackoutCountdown: GAME_CONFIG.BLACKOUT_WARNING_SEC,
                            },
                        });
                    }
                    return;
                }

                // Recovery from warning if coverage restored
                if (state.game.phase === "warning" && coverage >= GAME_CONFIG.BLACKOUT_THRESHOLD) {
                    set({
                        game: {
                            ...state.game,
                            phase: "running",
                            blackoutCountdown: null,
                            currentDemandMW,
                        },
                    });
                }

                // Normal tick: add score, advance hour
                const nextHour = (state.game.currentHour + 1) % 24;
                const scoreGain = state.screen3.isStable ? GAME_CONFIG.POINTS_PER_SECOND_STABLE : 0;

                set({
                    game: {
                        ...state.game,
                        currentDemandMW,
                        currentHour: nextHour,
                        score: state.game.score + scoreGain,
                    },
                });
            },

            checkWinConditions: () => {
                const state = get();
                const effectiveSupply = get().calculateEffectiveSupply();
                const demand = state.game.currentDemandMW;
                const coverage = demand > 0 ? (effectiveSupply / demand) * 100 : 0;

                const { slots } = state.screen1;
                let totalCap = 0;
                let weightedSum = 0;
                slots.forEach((id) => {
                    if (!id) return;
                    const source = ENERGY_SOURCES.find((s) => s.id === id);
                    if (source) {
                        totalCap += source.capacity;
                        weightedSum += source.capacity * source.reliability;
                    }
                });
                const reliability = totalCap > 0 ? weightedSum / totalCap : 0;

                const won =
                    coverage >= GAME_CONFIG.MIN_COVERAGE &&
                    reliability >= GAME_CONFIG.MIN_RELIABILITY &&
                    state.screen1.totalEmissions <= GAME_CONFIG.MAX_EMISSIONS &&
                    state.screen3.isStable;

                let finalScore = state.game.score;
                if (won) {
                    if (state.screen1.totalEmissions < 200) finalScore += GAME_CONFIG.BONUS_LOW_EMISSIONS;
                    if (reliability >= 80) finalScore += GAME_CONFIG.BONUS_HIGH_RELIABILITY;
                }

                set({
                    game: {
                        ...state.game,
                        phase: "ended",
                        outcome: won ? "win" : "lose",
                        failureReason: won ? null : "conditions_not_met",
                        score: finalScore,
                    },
                });
            },

            endGame: (outcome, reason) => {
                set({
                    game: {
                        ...get().game,
                        phase: "ended",
                        outcome,
                        failureReason: reason ?? null,
                    },
                });
            },

            resetAll: () => {
                set({
                    ...initialState,
                    timer: {
                        durationMs: defaultTimerDurationMs,
                        remainingMs: defaultTimerDurationMs,
                        isRunning: false,
                        endsAt: null,
                    },
                    qr: {
                        lastScan: null,
                        error: null,
                    },
                    game: { ...initialState.game },
                });
                if (typeof localStorage !== "undefined") {
                    localStorage.removeItem("energy-control-center");
                }
            },
        }),
        {
            name: "energy-control-center",
            version: 3,
            partialize: (state) => ({
                mode: state.mode,
                screen1: state.screen1,
                screen2: state.screen2,
                screen3: state.screen3,
                settings: state.settings,
                game: state.game,
            }),
            migrate: (persistedState) => {
                const nextState = { ...initialState, ...persistedState };
                nextState.settings = {
                    ...initialState.settings,
                    ...persistedState?.settings,
                };
                return nextState;
            },
        }
    )
);
