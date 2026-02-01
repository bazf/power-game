import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_SLOTS, SHIELD_MATERIALS } from "../utils/constants.js";
import { calculateEmissions, calculateProtection } from "../utils/calculations.js";

const initialShieldMaterial = SHIELD_MATERIALS[0]?.id ?? "lead";

export const useGameStore = create(
    persist(
        (set, get) => ({
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
            resetAll: () =>
                set({
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
                }),
        }),
        {
            name: "energy-control-center",
            version: 1,
        }
    )
);
