/**
 * GameScreenModel - Manages game state
 */
export class FarmEmuModel {
	private health = 100;
	private readonly maxHealth = 100;
	private damage = 20;

	private onKill: () => void;

	constructor(onKill: () => void) {
		this.onKill = onKill
	}

	/**
	 * Reset game state for a new game
	 */
	decrementHealth(amount: number): void {
		this.health = Math.max(0, this.health - amount);
		if (this.health < 1) {
			this.onKill();
		}
	}

	getHealth(): number {
		return this.health;
	}

	getMaxHealth(): number {
		return this.maxHealth;
	}

	getDamage(): number {
		return this.damage;
	}
}
