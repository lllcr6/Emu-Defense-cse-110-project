// Stage dimensions
export const STAGE_WIDTH = 800;
export const STAGE_HEIGHT = 700;

// Game settings
export const GAME_DURATION = 60; // seconds

export const STARTING_EMU_COUNT = 1000

export const PLAYER_SPEED = 100 // pixels per second
export const EMU_SPEED = 40
export const EMU_WALK_RANDOMIZATION = 0.025;
export const PLANTER_HEIGHT = 20;
export const PLANTER_WIDTH = 40;
export const ONE_OVER_ROOT_TWO = 1 / Math.sqrt(2);

// HUD layout constants
export const HUD_HEIGHT = 80; // Height of the HUD banner
export const GAME_AREA_Y = HUD_HEIGHT; // Game area starts below HUD
export const GAME_AREA_HEIGHT = STAGE_HEIGHT - HUD_HEIGHT; // Available game area height

// Type-safe inventory items (using object with as const for erasableSyntaxOnly)
export const GameItem = {
    Money: "money",
    Crop: "crop",
    Mine: "mine",
    Egg: "egg",
    BarbedWire: "barbed_wire",
    Sandbag: "sandbag",
    MachineGun: "machine_gun",
} as const;

export type GameItem = typeof GameItem[keyof typeof GameItem];

// Morning market pricing, split by direction so buy and sell values stay obvious.
export const MORNING_MARKET_PRICES = {
    buy: {
        [GameItem.Crop]: 10,
    },
    sell: {
        [GameItem.Crop]: 3,
        [GameItem.Egg]: 35,
    },
} as const;

export const CROP_BUY_COST = MORNING_MARKET_PRICES.buy[GameItem.Crop];
export const CROP_SELL_PRICE = MORNING_MARKET_PRICES.sell[GameItem.Crop];
export const EGG_SELL_PRICE = MORNING_MARKET_PRICES.sell[GameItem.Egg];

// Harvested crops are turned into 5 new crop seeds.
export const CROP_HARVEST_REWARD = 5;
