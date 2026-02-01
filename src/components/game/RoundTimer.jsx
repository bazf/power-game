import { useEffect, useMemo, useRef } from "react";
import PropTypes from "prop-types";
import Button from "../common/Button.jsx";
import Card from "../common/Card.jsx";
import { useGameStore } from "../../store/gameStore.js";

const DURATION_OPTIONS = [60, 90, 120, 180, 240];

const formatMs = (ms) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export default function RoundTimer({ compact }) {
    const settings = useGameStore((state) => state.settings);
    const timer = useGameStore((state) => state.timer);
    const game = useGameStore((state) => state.game);
    const startGame = useGameStore((state) => state.startGame);
    const startTimer = useGameStore((state) => state.startTimer);
    const pauseTimer = useGameStore((state) => state.pauseTimer);
    const resetTimer = useGameStore((state) => state.resetTimer);
    const tickTimer = useGameStore((state) => state.tickTimer);
    const tickGame = useGameStore((state) => state.tickGame);
    const checkWinConditions = useGameStore((state) => state.checkWinConditions);
    const setTimerDuration = useGameStore((state) => state.setTimerDuration);
    const prevRemainingRef = useRef(timer.remainingMs);

    // Timer tick (fast - 250ms)
    useEffect(() => {
        if (!settings.timerEnabled) return undefined;
        const interval = setInterval(() => {
            tickTimer();
        }, 250);
        return () => clearInterval(interval);
    }, [settings.timerEnabled, tickTimer]);

    // Game tick (1 second) - only when game is running or in warning
    useEffect(() => {
        if (!settings.timerEnabled || !timer.isRunning) return undefined;
        if (game.phase !== "running" && game.phase !== "warning") return undefined;

        const interval = setInterval(() => {
            tickGame();
        }, 1000);
        return () => clearInterval(interval);
    }, [settings.timerEnabled, timer.isRunning, game.phase, tickGame]);

    // Check when timer ends - trigger win condition check
    useEffect(() => {
        if (prevRemainingRef.current > 0 && timer.remainingMs === 0 && game.phase !== "ended") {
            checkWinConditions();
        }
        prevRemainingRef.current = timer.remainingMs;
    }, [timer.remainingMs, game.phase, checkWinConditions]);

    const remainingLabel = useMemo(() => formatMs(timer.remainingMs), [timer.remainingMs]);

    if (!settings.timerEnabled) {
        return null;
    }

    const isGameActive = game.phase === "running" || game.phase === "warning";
    const isGameEnded = game.phase === "ended";

    const handleStart = () => {
        if (game.phase === "setup" || game.phase === "ended") {
            startGame();
        } else {
            startTimer();
        }
    };

    return (
        <Card className={compact ? "flex flex-wrap items-center justify-between gap-4" : ""}>
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Таймер раунду</p>
                <p className={`text-3xl font-semibold ${timer.remainingMs <= 10000 ? "text-accentOrange" : "text-ink"}`}>
                    {remainingLabel}
                </p>
                {isGameActive && (
                    <p className="text-xs text-slate-500">Година: {game.currentHour}:00</p>
                )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {!isGameActive && !isGameEnded && (
                    <select
                        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"
                        value={Math.round(timer.durationMs / 1000)}
                        onChange={(event) => setTimerDuration(Number(event.target.value) * 1000)}
                    >
                        {DURATION_OPTIONS.map((seconds) => (
                            <option key={seconds} value={seconds}>
                                {seconds / 60} хв
                            </option>
                        ))}
                    </select>
                )}
                {timer.isRunning && !isGameEnded ? (
                    <Button variant="ghost" onClick={pauseTimer}>
                        Пауза
                    </Button>
                ) : (
                    <Button onClick={handleStart} disabled={isGameEnded && timer.remainingMs === 0}>
                        {isGameEnded ? "Новий раунд" : game.phase === "setup" ? "Старт гри" : "Продовжити"}
                    </Button>
                )}
                <Button variant="ghost" onClick={resetTimer}>
                    Скинути таймер
                </Button>
            </div>
        </Card>
    );
}

RoundTimer.propTypes = {
    compact: PropTypes.bool,
};
