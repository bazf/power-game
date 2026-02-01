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

// Game configuration
export const GAME_CONFIG = {
    // Demand targets
    BASE_DEMAND_MW: 2000,
    PEAK_DEMAND_MW: 3000,

    // Win conditions
    MIN_RELIABILITY: 70,
    MAX_EMISSIONS: 400,
    MIN_COVERAGE: 100,

    // Failure thresholds
    BLACKOUT_THRESHOLD: 0.8,
    BLACKOUT_WARNING_SEC: 10,
    MELTDOWN_TEMP: 800,

    // Scoring
    POINTS_PER_SECOND_STABLE: 1,
    BONUS_LOW_EMISSIONS: 100,
    BONUS_HIGH_RELIABILITY: 50,
    PENALTY_BLACKOUT: -200,
    PENALTY_MELTDOWN: -500,
};

// Predictable 24-hour demand curve (multiplier of BASE_DEMAND_MW)
export const DEMAND_CURVE = [
    0.6, 0.55, 0.5, 0.5, 0.55, 0.7,     // 00:00-05:00 (night)
    0.85, 1, 0.95, 0.9, 0.85, 0.9,      // 06:00-11:00 (morning peak)
    0.85, 0.8, 0.85, 0.9, 1, 0.95,      // 12:00-17:00 (afternoon)
    0.9, 0.85, 0.8, 0.75, 0.7, 0.65,    // 18:00-23:00 (evening)
];
