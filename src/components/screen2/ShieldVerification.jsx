import { useState } from "react";
import Card from "../common/Card.jsx";
import Button from "../common/Button.jsx";
import { SHIELD_MATERIALS } from "../../utils/constants.js";
import { calculateProtection } from "../../utils/calculations.js";
import { useGameStore } from "../../store/gameStore.js";
import RadiationBeam from "./RadiationBeam.jsx";
import { audioEngine } from "../../utils/audioEngine.js";
import QrScannerModal from "../qr/QrScannerModal.jsx";
import { decodePayload } from "../../utils/qrPayload.js";

export default function ShieldVerification() {
    const screen2 = useGameStore((state) => state.screen2);
    const setShieldHostInputs = useGameStore((state) => state.setShieldHostInputs);
    const runShieldTest = useGameStore((state) => state.runShieldTest);
    const [scannerOpen, setScannerOpen] = useState(false);
    const [scanError, setScanError] = useState("");
    const [manualCode, setManualCode] = useState("");

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

    const applyPayload = (payload) => {
        if (payload?.type !== "shield") {
            setScanError("Невірний QR-код для екранування.");
            return false;
        }
        setShieldHostInputs({
            hostMaterialId: payload.materialId,
            hostThickness: Number(payload.thickness) || 0,
        });
        setScanError("");
        return true;
    };

    const handleScan = (text) => {
        const payload = decodePayload(text);
        const ok = applyPayload(payload);
        if (ok) {
            audioEngine.playClick();
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
                    <div className="flex flex-wrap gap-2">
                        <Button variant="danger" onClick={handleTest}>
                            ПОЧАТИ ТЕСТ
                        </Button>
                        <Button variant="ghost" onClick={() => setScannerOpen(true)}>
                            Сканувати QR
                        </Button>
                    </div>
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Або вставте код вручну:</p>
                        <textarea
                            className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs"
                            rows={2}
                            value={manualCode}
                            onChange={(event) => setManualCode(event.target.value)}
                        />
                        <div className="mt-2 flex gap-2">
                            <Button
                                variant="ghost"
                                onClick={() => handleScan(manualCode.trim())}
                            >
                                Імпортувати
                            </Button>
                            <Button variant="ghost" onClick={() => setManualCode("")}>Очистити</Button>
                        </div>
                    </div>
                    {scanError && <p className="text-sm text-accentOrange">{scanError}</p>}
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
            <QrScannerModal
                open={scannerOpen}
                onClose={() => setScannerOpen(false)}
                onResult={handleScan}
            />
        </div>
    );
}
