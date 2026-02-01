import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function EnergyCard({ source }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: source.id,
        data: { sourceId: source.id },
    });

    const style = {
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
            : undefined,
    };

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-card transition ${isDragging ? "opacity-60" : "opacity-100"
                }`}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{source.name}</h3>
                <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: source.color }}
                />
            </div>
            <p className="text-xs text-slate-500">CO₂: {source.co2Emissions} кг/МВт·год</p>
        </motion.div>
    );
}

EnergyCard.propTypes = {
    source: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        co2Emissions: PropTypes.number.isRequired,
        color: PropTypes.string.isRequired,
    }).isRequired,
};
