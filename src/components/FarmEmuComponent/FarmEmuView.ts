import Konva from "konva";
import emuSrc from "../../../assets/Emu.png";

const createImage = (src: string): HTMLImageElement => {
	if (typeof Image !== "undefined") {
		const image = new Image();
		image.src = src;
		return image;
	}

	const fallback = document.createElement("img") as HTMLImageElement;
	fallback.src = src;
	return fallback;
};

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class FarmEmuView {
	private emu: Konva.Image | null = null;
	private readonly parentGroup: Konva.Group;
	private readonly healthBarBg: Konva.Rect;
	private readonly healthBarFill: Konva.Rect;
	private readonly healthText: Konva.Text;

	constructor(group: Konva.Group, startX: number, startY: number, onClick: () => void) {
		this.parentGroup = group;
		const sprite = createImage(emuSrc);
		this.emu = new Konva.Image({
			x: startX,
			y: startY,
			width: 36,
			height: 36,
			image: sprite,
		});

		if (!sprite.complete) {
			sprite.onload = () => {
				this.emu?.image(sprite);
				this.emu?.getLayer()?.batchDraw();
			};
		}

		this.emu.on("click", onClick);
		group.add(this.emu);

		this.healthBarBg = new Konva.Rect({
			x: startX - 4,
			y: startY - 18,
			width: 44,
			height: 6,
			fill: "rgba(0, 0, 0, 0.45)",
			cornerRadius: 3,
			listening: false,
		});
		this.healthBarFill = new Konva.Rect({
			x: startX - 4,
			y: startY - 18,
			width: 44,
			height: 6,
			fill: "#d64545",
			cornerRadius: 3,
			listening: false,
		});
		this.healthText = new Konva.Text({
			x: startX - 6,
			y: startY - 34,
			width: 48,
			text: "100",
			fontSize: 10,
			fontFamily: "Arial",
			fill: "#fff4f4",
			align: "center",
			listening: false,
		});
		group.add(this.healthBarBg);
		group.add(this.healthBarFill);
		group.add(this.healthText);
	}

	/**
	 * Move the player a certain distance in a cardinal vector
	 *
	 * @param dx
	 * @param dy
	 */
	moveDelta(dx: number, dy: number): void {
		if (!this.emu) return;
		this.emu.x(this.emu.x() + dx);
		this.emu.y(this.emu.y() + dy);
		this.syncHealthUi();
	}

	getView(): Konva.Image | null {
		return this.emu;
	}

	updateHealth(currentHealth: number, maxHealth: number): void {
		const clampedMax = Math.max(1, maxHealth);
		const ratio = Math.max(0, Math.min(1, currentHealth / clampedMax));
		this.healthBarFill.width(44 * ratio);
		this.healthBarFill.fill(ratio > 0.5 ? "#5cb85c" : ratio > 0.25 ? "#f0ad4e" : "#d64545");
		this.healthText.text(`${Math.ceil(currentHealth)} HP`);
		this.syncHealthUi();
		this.parentGroup.getLayer()?.batchDraw();
	}

	showBloodSplatter(): void {
		if (!this.emu) return;

		const centerX = this.emu.x() + this.emu.width() / 2;
		const centerY = this.emu.y() + this.emu.height() / 2;
		const splatter = new Konva.Group({ listening: false });

		for (let i = 0; i < 7; i++) {
			const angle = (Math.PI * 2 * i) / 7;
			const distance = 6 + Math.random() * 14;
			const droplet = new Konva.Circle({
				x: centerX + Math.cos(angle) * distance,
				y: centerY + Math.sin(angle) * distance,
				radius: 2 + Math.random() * 4,
				fill: i % 2 === 0 ? "#a10f1a" : "#d6222f",
				opacity: 0.9,
			});
			splatter.add(droplet);
			droplet.to({
				x: droplet.x() + Math.cos(angle) * 8,
				y: droplet.y() + Math.sin(angle) * 8,
				scaleX: 0.6,
				scaleY: 0.6,
				opacity: 0,
				duration: 0.22,
			});
		}

		this.parentGroup.add(splatter);
		splatter.moveToTop();
		this.parentGroup.getLayer()?.batchDraw();
		window.setTimeout(() => {
			splatter.destroy();
			this.parentGroup.getLayer()?.batchDraw();
		}, 260);
	}

	removeFromGroup(): void{
		this.emu?.remove();
		this.healthBarBg.remove();
		this.healthBarFill.remove();
		this.healthText.remove();
		this.parentGroup.getLayer()?.batchDraw();
	}

	private syncHealthUi(): void {
		if (!this.emu) return;
		const baseX = this.emu.x() - 4;
		const baseY = this.emu.y() - 18;
		this.healthBarBg.position({ x: baseX, y: baseY });
		this.healthBarFill.position({ x: baseX, y: baseY });
		this.healthText.position({ x: this.emu.x() - 6, y: this.emu.y() - 34 });
	}
}
