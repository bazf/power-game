import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { audioEngine } from "../../utils/audioEngine.js";
import { useGameStore } from "../../store/gameStore.js";
import Button from "../common/Button.jsx";

export default function Header({ subtitle }) {
    const settings = useGameStore((state) => state.settings);
    const setSettings = useGameStore((state) => state.setSettings);
    const resetAll = useGameStore((state) => state.resetAll);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        audioEngine.setVolume(settings.volume);
        if (settings.muted) {
            audioEngine.mute();
        } else {
            audioEngine.unmute();
        }
    }, [settings]);

    return (
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white px-6 py-4 shadow-card">
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accentBlue">Центр Керування Енергією</p>
                <h1 className="text-2xl font-semibold">{subtitle}</h1>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setOpen((prev) => !prev)}>
                    Налаштування
                </Button>
                {open && (
                    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                        <label className="flex items-center gap-3">
                            <span className="min-w-[110px]">Гучність</span>
                            <input
                                className="w-32"
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={settings.volume}
                                onChange={(event) =>
                                    setSettings({ volume: Number(event.target.value) })
                                }
                            />
                        </label>
                        <label className="flex items-center gap-3">
                            <span className="min-w-[110px]">Звук</span>
                            <input
                                type="checkbox"
                                checked={!settings.muted}
                                onChange={(event) => setSettings({ muted: !event.target.checked })}
                            />
                        </label>
                        <button
                            type="button"
                            onClick={resetAll}
                            className="self-start text-[11px] uppercase tracking-[0.25em] text-slate-400 transition hover:text-accentOrange"
                        >
                            Reset System
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

Header.propTypes = {
    subtitle: PropTypes.string.isRequired,
};
