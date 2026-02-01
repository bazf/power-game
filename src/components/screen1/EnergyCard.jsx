import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import PropTypes from "prop-types";

export default function EnergyCard({ source }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: source.id,
        data: { sourceId: source.id },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        touchAction: "none",
        cursor: isDragging ? "grabbing" : "grab",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`select-none rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-card
                transition-all duration-150 ease-out
                hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
                ${isDragging ? "opacity-60 shadow-xl z-50" : "opacity-100"}`}
        >
            <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{source.name}</h3>
                <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: source.color }}
                />
            </div>
            <p className="text-xs text-slate-500">
                {source.capacity} МВт · {source.reliability}%
            </p>
            <p className="text-[10px] text-slate-400">CO₂: {source.co2Emissions} кг/МВт·год</p>
        </div>
    );
}

EnergyCard.propTypes = {
    source: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        co2Emissions: PropTypes.number.isRequired,
        capacity: PropTypes.number.isRequired,
        reliability: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
    }).isRequired,
};
