import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ControlSlider({ label, value, onChange, accent }) {
    const trackRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const clamp = (next) => Math.min(100, Math.max(0, next));

    const setFromClientY = useCallback(
        (clientY) => {
            const element = trackRef.current;
            if (!element) return;
            const rect = element.getBoundingClientRect();
            const y = clientY - rect.top;
            const ratio = 1 - y / rect.height;
            const nextValue = clamp(Math.round(ratio * 100));
            onChange(nextValue);
        },
        [onChange]
    );

    const onPointerDown = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
        setFromClientY(event.clientY);
    };

    // Use document-level events for reliable drag tracking
    useEffect(() => {
        if (!isDragging) return;

        const handleMove = (event) => {
            event.preventDefault();
            setFromClientY(event.clientY);
        };

        const handleUp = () => {
            setIsDragging(false);
        };

        document.addEventListener("pointermove", handleMove);
        document.addEventListener("pointerup", handleUp);
        document.addEventListener("pointercancel", handleUp);

        return () => {
            document.removeEventListener("pointermove", handleMove);
            document.removeEventListener("pointerup", handleUp);
            document.removeEventListener("pointercancel", handleUp);
        };
    }, [isDragging, setFromClientY]);

    const fillPercent = value;

    return (
        <div className="flex flex-col items-center gap-3">
            <span className="text-sm font-semibold">{label}</span>
            <div className="relative flex h-52 items-center">
                <div
                    ref={trackRef}
                    onPointerDown={onPointerDown}
                    className="relative h-52 w-10 cursor-pointer rounded-full bg-slate-200"
                    style={{ touchAction: "none" }}
                >
                    {/* Hidden input for accessibility only - no pointer events */}
                    <input
                        type="range"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(event) => onChange(clamp(Number(event.target.value)))}
                        aria-label={label}
                        tabIndex={-1}
                        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                    />
                    <div
                        className="pointer-events-none absolute bottom-0 left-0 right-0 rounded-full"
                        style={{
                            height: `${fillPercent}%`,
                            backgroundColor: accent ?? "#1E3A8A",
                            opacity: 0.35,
                        }}
                    />
                    <div
                        className="pointer-events-none absolute left-1/2 h-8 w-8 -translate-x-1/2 rounded-full border border-slate-200 bg-white shadow"
                        style={{
                            bottom: `calc(${fillPercent}% - 16px)`,
                            boxShadow: isDragging
                                ? "0 12px 30px rgba(15, 23, 42, 0.25)"
                                : undefined,
                        }}
                    />
                </div>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold">{value}%</span>
        </div>
    );
}

ControlSlider.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    accent: PropTypes.string,
};
