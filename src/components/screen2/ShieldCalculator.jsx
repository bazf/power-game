import { useMemo, useState } from "react";
import Card from "../common/Card.jsx";
import { SHIELD_MATERIALS } from "../../utils/constants.js";
import { useGameStore } from "../../store/gameStore.js";
import Button from "../common/Button.jsx";
import { audioEngine } from "../../utils/audioEngine.js";
import QrCodePanel from "../qr/QrCodePanel.jsx";
import { encodePayload } from "../../utils/qrPayload.js";

export default function ShieldCalculator() {
    const screen2 = useGameStore((state) => state.screen2);
    const setShieldInputs = useGameStore((state) => state.setShieldInputs);
    const [showQr, setShowQr] = useState(false);

    const qrValue = useMemo(
        () =>
            encodePayload({
                type: "shield",
                materialId: screen2.selectedMaterialId,
                thickness: screen2.thickness,
            }),
        [screen2.selectedMaterialId, screen2.thickness]
    );

    const handleChange = (payload) => {
        setShieldInputs(payload);
        audioEngine.playClick();
    };

    return (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card>
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl font-semibold">Лабораторія Екранування</h2>
                        <p className="text-sm text-slate-500">
                            Оберіть матеріал і товщину, щоб досягнути 99% захисту.
                        </p>
                    </div>
                    <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold">Оберіть матеріал захисту</span>
                        <select
                            className="rounded-xl border border-slate-200 bg-white px-4 py-2"
                            value={screen2.selectedMaterialId}
                            onChange={(event) => handleChange({ selectedMaterialId: event.target.value })}
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
                            value={screen2.thickness}
                            onChange={(event) =>
                                handleChange({ thickness: Number(event.target.value) })
                            }
                        />
                    </label>
                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm">Рівень захисту</p>
                        <p className="text-3xl font-semibold text-accentBlue">
                            {screen2.protectionLevel}%
                        </p>
                        {screen2.protectionLevel >= 99 ? (
                            <p className="text-sm font-semibold text-accentGreen">Комбінація успішна</p>
                        ) : (
                            <p className="text-sm text-slate-500">Потрібно 99%</p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="success" onClick={() => audioEngine.playSuccess()}>
                            Підтвердити
                        </Button>
                        <Button variant="ghost" onClick={() => setShowQr((prev) => !prev)}>
                            {showQr ? "Сховати QR" : "Показати QR"}
                        </Button>
                    </div>
                </div>
            </Card>
            {showQr && (
                <QrCodePanel
                    title="Рішення для мультиборду"
                    subtitle="Покажіть QR або передайте код викладачу"
                    value={qrValue}
                />
            )}
        </div>
    );
}
