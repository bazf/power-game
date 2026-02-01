import { useDroppable } from "@dnd-kit/core";
import PropTypes from "prop-types";

export default function EnergySlot({ id, children }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={`flex h-28 items-center justify-center rounded-2xl border-2 border-dashed transition ${isOver ? "border-accentBlue bg-blue-50" : "border-slate-200 bg-slate-50"
                }`}
        >
            {children ?? <span className="text-xs text-slate-400">Слот</span>}
        </div>
    );
}

EnergySlot.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.node,
};
