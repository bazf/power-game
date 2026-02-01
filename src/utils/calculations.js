import { ENERGY_SOURCES, SHIELD_MATERIALS } from "./constants.js";

export const getSourceById = (id) => ENERGY_SOURCES.find((item) => item.id === id);

export const getMaterialById = (id) => SHIELD_MATERIALS.find((item) => item.id === id);

export const calculateProtection = (materialId, thickness) => {
    const material = getMaterialById(materialId);
    if (!material || thickness <= 0) {
        return 0;
    }
    const ratio = thickness / material.halfValueLayer;
    const protection = 1 - Math.pow(0.5, ratio);
    return Math.min(100, Math.max(0, Math.round(protection * 100)));
};

export const calculateEmissions = (slotIds) => {
    return slotIds.reduce((sum, id) => {
        if (!id) {
            return sum;
        }
        const source = getSourceById(id);
        return sum + (source?.co2Emissions ?? 0);
    }, 0);
};
