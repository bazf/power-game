export const ENERGY_SOURCES = [
    {
        id: "nuclear",
        name: "АЕС",
        co2Emissions: 12,
        capacity: 1000,
        reliability: 92,
        color: "#2563EB",
    },
    {
        id: "coal",
        name: "ТЕС",
        co2Emissions: 820,
        capacity: 800,
        reliability: 88,
        color: "#DC2626",
    },
    {
        id: "solar",
        name: "СЕС",
        co2Emissions: 45,
        capacity: 350,
        reliability: 40,
        color: "#F59E0B",
    },
    {
        id: "wind",
        name: "ВЕС",
        co2Emissions: 11,
        capacity: 420,
        reliability: 55,
        color: "#10B981",
    },
    {
        id: "hydro",
        name: "ГЕС",
        co2Emissions: 24,
        capacity: 600,
        reliability: 75,
        color: "#0EA5E9",
    },
];

export const SHIELD_MATERIALS = [
    {
        id: "lead",
        name: "Свинець",
        density: 11.34,
        halfValueLayer: 1.2,
        cost: 5,
    },
    {
        id: "concrete",
        name: "Бетон",
        density: 2.3,
        halfValueLayer: 6.6,
        cost: 2,
    },
    {
        id: "steel",
        name: "Сталь",
        density: 7.9,
        halfValueLayer: 3.1,
        cost: 4,
    },
    {
        id: "water",
        name: "Вода",
        density: 1,
        halfValueLayer: 8.5,
        cost: 1,
    },
];

export const DEFAULT_SLOTS = new Array(5).fill(null);
export const SLOT_IDS = ["slot-0", "slot-1", "slot-2", "slot-3", "slot-4"];
