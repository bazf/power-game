import {
    DndContext,
    PointerSensor,
    TouchSensor,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { useMemo } from "react";
import { useGameStore } from "../../store/gameStore.js";
import { ENERGY_SOURCES, SLOT_IDS, GAME_CONFIG } from "../../utils/constants.js";
import { getSourceById } from "../../utils/calculations.js";
import EnergyCard from "./EnergyCard.jsx";
import EnergySlot from "./EnergySlot.jsx";
import EmissionsChart from "./EmissionsChart.jsx";
import Card from "../common/Card.jsx";
import { audioEngine } from "../../utils/audioEngine.js";

export default function EnergyBalancing() {
    const slots = useGameStore((state) => state.screen1.slots);
    const totalEmissions = useGameStore((state) => state.screen1.totalEmissions);
    const setSlots = useGameStore((state) => state.setSlots);
    const game = useGameStore((state) => state.game);
    const { setNodeRef: setDockRef, isOver: isOverDock } = useDroppable({ id: "dock" });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
    );

    // Calculate total capacity and effective supply
    const { totalCapacity, effectiveSupply, weightedReliability } = useMemo(() => {
        let cap = 0;
        let eff = 0;
        let weightedSum = 0;
        slots.forEach((id) => {
            if (!id) return;
            const source = getSourceById(id);
            if (source) {
                cap += source.capacity;
                eff += (source.capacity * source.reliability) / 100;
                weightedSum += source.capacity * source.reliability;
            }
        });
        return {
            totalCapacity: cap,
            effectiveSupply: Math.round(eff),
            weightedReliability: cap > 0 ? Math.round(weightedSum / cap) : 0,
        };
    }, [slots]);

    const demand = game?.currentDemandMW ?? GAME_CONFIG.BASE_DEMAND_MW;
    const coverage = demand > 0 ? Math.round((effectiveSupply / demand) * 100) : 0;
    const isBlackoutWarning = coverage < GAME_CONFIG.BLACKOUT_THRESHOLD * 100;
    const isDeficit = effectiveSupply < demand;

    const handleDragEnd = ({ active, over }) => {
        if (!over) return;
        const overId = over.id;
        const activeId = active.id;
        if (!activeId) return;

        if (overId === "dock") {
            const originIndex = slots.indexOf(activeId);
            if (originIndex >= 0) {
                const nextSlots = [...slots];
                nextSlots[originIndex] = null;
                setSlots(nextSlots);
                audioEngine.playClick();
            }
            return;
        }

        if (!String(overId).startsWith("slot-")) return;

        const targetIndex = Number(String(overId).replace("slot-", ""));
        if (Number.isNaN(targetIndex)) return;

        const nextSlots = [...slots];
        const originIndex = slots.indexOf(activeId);
        const targetSlotId = slots[targetIndex];

        if (originIndex >= 0 && originIndex !== targetIndex) {
            nextSlots[originIndex] = targetSlotId ?? null;
        }

        nextSlots[targetIndex] = activeId;
        setSlots(nextSlots);
        audioEngine.playClick();
    };

    const chartData = useMemo(() => {
        return slots.map((slotId, index) => {
            const source = slotId ? getSourceById(slotId) : null;
            return {
                label: `Слот ${index + 1}`,
                value: source?.co2Emissions ?? 0,
            };
        });
    }, [slots]);

    const usedIds = new Set(slots.filter(Boolean));

    return (
        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
            <Card>
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">Балансування Енергосистеми</h2>
                        <p className="text-sm text-slate-500">
                            Перетягніть джерела енергії у слоти для створення оптимального енергоміксу.
                        </p>
                    </div>
                    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                            {SLOT_IDS.map((slotKey, index) => {
                                const slotId = slots[index];
                                const source = slotId ? getSourceById(slotId) : null;
                                return (
                                    <EnergySlot key={slotKey} id={slotKey}>
                                        {source ? <EnergyCard source={source} /> : null}
                                    </EnergySlot>
                                );
                            })}
                        </div>
                        <div className="mt-6">
                            <h3 className="text-sm font-semibold text-slate-500">Палуба</h3>
                            <div
                                ref={setDockRef}
                                className="mt-3 grid gap-3 md:grid-cols-5"
                                id="dock"
                                style={isOverDock ? { backgroundColor: "#E2E8F0", borderRadius: "16px", padding: "8px" } : undefined}
                            >
                                {ENERGY_SOURCES.filter((source) => !usedIds.has(source.id)).map(
                                    (source) => (
                                        <div key={source.id}>
                                            <EnergyCard source={source} />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </DndContext>
                </div>
            </Card>
            <div className="flex flex-col gap-6">
                {/* Demand vs Supply panel */}
                <Card>
                    <h3 className="text-lg font-semibold">Попит / Постачання</h3>
                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Попит:</span>
                            <span className="font-bold">{demand} МВт</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Потужність:</span>
                            <span className="font-bold">{totalCapacity} МВт</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Ефективна (× надійність):</span>
                            <span className={`font-bold ${isDeficit ? "text-red-600" : "text-green-600"}`}>
                                {effectiveSupply} МВт
                            </span>
                        </div>
                        {/* Progress bar */}
                        <div className="relative h-6 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                                className={`absolute left-0 top-0 h-full transition-all duration-300 ${isBlackoutWarning ? "bg-red-500 animate-pulse" : isDeficit ? "bg-amber-500" : "bg-green-500"}`}
                                style={{ width: `${Math.min(coverage, 100)}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
                                {coverage}%
                            </div>
                            {/* Threshold marker at 80% */}
                            <div
                                className="absolute top-0 h-full w-0.5 bg-red-700"
                                style={{ left: `${GAME_CONFIG.BLACKOUT_THRESHOLD * 100}%` }}
                                title="Поріг блекауту (80%)"
                            />
                        </div>
                        <p className={`text-xs ${isBlackoutWarning ? "text-red-600 font-bold" : "text-slate-500"}`}>
                            {isBlackoutWarning
                                ? "⚠ Критичний дефіцит! Додайте потужність!"
                                : isDeficit
                                    ? "Невеликий дефіцит. Рекомендуємо збільшити потужність."
                                    : "✓ Попит задоволено"}
                        </p>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Надійність: <strong className={weightedReliability < GAME_CONFIG.MIN_RELIABILITY ? "text-amber-600" : "text-green-600"}>{weightedReliability}%</strong></span>
                            <span>Ціль: ≥{GAME_CONFIG.MIN_RELIABILITY}%</span>
                        </div>
                    </div>
                </Card>
                <Card>
                    <h3 className="text-lg font-semibold">Викиди CO₂ (кг/МВт·год)</h3>
                    <p className={`text-sm ${totalEmissions > GAME_CONFIG.MAX_EMISSIONS ? "text-red-600 font-bold" : "text-slate-500"}`}>
                        Загалом: {totalEmissions} / {GAME_CONFIG.MAX_EMISSIONS} кг/МВт·год
                    </p>
                    <EmissionsChart data={chartData} />
                </Card>
            </div>
        </div>
    );
}
