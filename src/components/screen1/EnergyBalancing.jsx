import {
    DndContext,
    PointerSensor,
    useDroppable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { useMemo } from "react";
import { useGameStore } from "../../store/gameStore.js";
import { ENERGY_SOURCES, SLOT_IDS } from "../../utils/constants.js";
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
    const { setNodeRef: setDockRef, isOver: isOverDock } = useDroppable({ id: "dock" });

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

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
            <Card>
                <h3 className="text-lg font-semibold">Викиди CO₂ (кг/МВт·год)</h3>
                <p className="text-sm text-slate-500">Загалом: {totalEmissions} кг/МВт·год</p>
                <EmissionsChart data={chartData} />
            </Card>
        </div>
    );
}
