/**
 * MorningEventsScreenModel - Encapsulates shop pricing and simple rules
 */
import { GameItem, MORNING_MARKET_PRICES } from "../../constants.ts";

export class MorningEventsScreenModel {
    private cropBuyCost = MORNING_MARKET_PRICES.buy[GameItem.Crop];
    private cropSellPrice = MORNING_MARKET_PRICES.sell[GameItem.Crop];

    getCropBuyCost(): number { return this.cropBuyCost; }
    getCropSellPrice(): number { return this.cropSellPrice; }
}
