import Card from "../common/Card.jsx";
import Button from "../common/Button.jsx";
import { SHIELD_MATERIALS } from "../../utils/constants.js";
import { calculateProtection } from "../../utils/calculations.js";
import { useGameStore } from "../../store/gameStore.js";
import RadiationBeam from "./RadiationBeam.jsx";
import { audioEngine } from "../../utils/audioEngine.js";

export default function ShieldVerification() {
    const screen2 = useGameStore((state) => state.screen2);
    const setShieldHostInputs = useGameStore((state) => state.setShieldHostInputs);
    const runShieldTest = useGameStore((state) => state.runShieldTest);

    const handleTest = () => {
        const protection = calculateProtection(screen2.hostMaterialId, screen2.hostThickness);
        const success = protection >= 99;
        runShieldTest();
        if (success) {
            audioEngine.playSuccess();
        } else {
            audioEngine.playAlarm();
        }
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <Card>
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">Лабораторія Екранування</h2>
                        <p className="text-sm text-slate-500">
                            Встановіть параметри з розрахунків учнів і натисніть "ПОЧАТИ ТЕСТ".
                        </p>
                    </div>
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold">Матеріал</span>
                        <select
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2"
                            value={screen2.hostMaterialId}
                            onChange={(event) => setShieldHostInputs({ hostMaterialId: event.target.value })}
                        >
                            {SHIELD_MATERIALS.map((material) => (
                                <option key={material.id} value={material.id}>
                                    {material.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold">Товщина (см)</span>
                        <input
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2"
                            type="number"
                            min="0"
                            step="0.5"
                            value={screen2.hostThickness}
                            onChange={(event) =>
                                setShieldHostInputs({ hostThickness: Number(event.target.value) })
                            }
                        />
                    </label>
                    <Button variant="danger" onClick={handleTest}>
                        ПОЧАТИ ТЕСТ
                    </Button>
                    {screen2.testResult && (
                        <p
                            className={`text-sm font-semibold ${screen2.testResult === "success" ? "text-accentGreen" : "text-accentOrange"
                                }`}
                        >
                            {screen2.testResult === "success"
                                ? "ЗАХИСТ ПІДТВЕРДЖЕНО"
                                : "ПРОМЕНІ ПРОЙШЛИ"}
                        </p>
                    )}
                </div>
            </Card>
            <Card>
                <RadiationBeam status={screen2.testResult} />
            </Card>
        </div>
    );
}
