import { useEffect, useState } from "react";
import Card from "../common/Card.jsx";
import ControlSlider from "./ControlSlider.jsx";
import TemperatureGraph from "./TemperatureGraph.jsx";
import { useGameStore } from "../../store/gameStore.js";
import { audioEngine } from "../../utils/audioEngine.js";

export default function ReactorControl() {
    const screen3 = useGameStore((state) => state.screen3);
    const setReactorControls = useGameStore((state) => state.setReactorControls);
    const tickTemperature = useGameStore((state) => state.tickTemperature);
    const [history, setHistory] = useState([{ label: "0", value: screen3.temperature }]);

    useEffect(() => {
        const interval = setInterval(() => {
            tickTemperature();
        }, 800);
        return () => clearInterval(interval);
    }, [tickTemperature]);

    useEffect(() => {
        setHistory((prev) => {
            const next = [...prev, { label: String(prev.length + 1), value: screen3.temperature }];
            return next.slice(-20);
        });
        if (screen3.temperature >= 700) {
            audioEngine.playAlarm();
        }
    }, [screen3.temperature]);

    return (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <Card>
                <div className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-semibold">Керування Реактором</h2>
                        <p className="text-sm text-slate-500">
                            Мета: стабілізувати температуру в безпечному діапазоні 300–700°C.
                            Менше стрижнів → більше тепла. Більше води → сильніше охолодження.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <ControlSlider
                            label="Стрижні керування"
                            value={screen3.controlRods}
                            accent="#1E3A8A"
                            onChange={(value) => setReactorControls({ controlRods: value })}
                        />
                        <ControlSlider
                            label="Подача води"
                            value={screen3.waterSupply}
                            accent="#10B981"
                            onChange={(value) => setReactorControls({ waterSupply: value })}
                        />
                        <div className="rounded-2xl bg-slate-50 px-6 py-4 text-center">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Температура</p>
                            <p className="text-3xl font-semibold text-accentOrange">
                                {Math.round(screen3.temperature)}°C
                            </p>
                            {screen3.temperature < 300 && (
                                <p className="text-sm font-semibold text-slate-500">
                                    Нижче робочого діапазону
                                </p>
                            )}
                            {screen3.temperature >= 700 && (
                                <p className="text-sm font-semibold text-accentOrange">
                                    ⚠️ КРИТИЧНА ТЕМПЕРАТУРА!
                                </p>
                            )}
                            {screen3.isStable && (
                                <p className="text-sm font-semibold text-accentGreen">
                                    Стабільний режим
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
            <Card>
                <h3 className="text-lg font-semibold">Температура реактора</h3>
                <TemperatureGraph data={history} />
            </Card>
        </div>
    );
}
