import Konva from "konva";
import type { DefenseType } from "./DefenseModel.ts";
import barbedSrc from "../../../assets/barbed.png";
import sandbagSrc from "../../../assets/sandbag.png";
import gunSrc from "../../../assets/gun.png";

const DEFENSE_SIZE = 30; // Size for most defenses

const loadImage = (src: string): HTMLImageElement => {
	if (typeof Image !== "undefined") {
		const img = new Image();
		img.src = src;
		return img;
	}
	// Fallback for non-browser environments (like tests)
	const img = { src, complete: false, onload: null } as unknown as HTMLImageElement;
	return img;
};

const defenseImages: Partial<Record<DefenseType, HTMLImageElement>> = {
	barbed_wire: loadImage(barbedSrc),
	sandbag: loadImage(sandbagSrc),
	machine_gun: loadImage(gunSrc),
	// Mine handled separately
};

export class DefenseView {
	private defense: Konva.Group;
	private durabilityText: Konva.Text | null = null;
	private durabilityBarBg: Konva.Rect | null = null;
	private durabilityBarFill: Konva.Rect | null = null;

	constructor(group: Konva.Group, type: DefenseType, x: number, y: number) {
		this.defense = new Konva.Group({
			x,
			y,
		});

		this.createVisual(type);
		group.add(this.defense);
	}

	private createVisual(type: DefenseType): void {
		if (type === "mine") return;

		const image = defenseImages[type];
		if (image) {
			const konvaImage = new Konva.Image({
				x: 0,
				y: 0,
				width: DEFENSE_SIZE,
				height: DEFENSE_SIZE,
				image: image,
			});
			this.defense.add(konvaImage);

			if (!image.complete) {
				image.onload = () => {
					konvaImage.getLayer()?.batchDraw();
				};
			}
		}

		if (type === "machine_gun") {
			this.durabilityText = new Konva.Text({
				x: -10,
				y: -24,
				width: 50,
				text: "50/50",
				fontSize: 10,
				fontFamily: "Arial",
				fill: "#fff7db",
				align: "center",
				listening: false,
			});
			this.durabilityBarBg = new Konva.Rect({
				x: -5,
				y: -12,
				width: 40,
				height: 5,
				fill: "rgba(0, 0, 0, 0.45)",
				cornerRadius: 3,
				listening: false,
			});
			this.durabilityBarFill = new Konva.Rect({
				x: -5,
				y: -12,
				width: 40,
				height: 5,
				fill: "#f0c04c",
				cornerRadius: 3,
				listening: false,
			});
			this.defense.add(this.durabilityBarBg);
			this.defense.add(this.durabilityBarFill);
			this.defense.add(this.durabilityText);
		}
	}

	getView(): Konva.Group {
		return this.defense;
	}

	remove(): void {
		this.defense.remove();
	}

	setPosition(x: number, y: number): void {
		this.defense.x(x);
		this.defense.y(y);
	}

	updateDurability(current: number, max: number): void {
		if (!this.durabilityText || !this.durabilityBarFill) {
			return;
		}
		const ratio = Math.max(0, Math.min(1, current / Math.max(1, max)));
		this.durabilityText.text(`${Math.ceil(current)}/${max}`);
		this.durabilityBarFill.width(40 * ratio);
		this.durabilityBarFill.fill(ratio > 0.5 ? "#f0c04c" : ratio > 0.25 ? "#ff8a3d" : "#d94b4b");
		this.defense.getLayer()?.batchDraw();
	}

	showMuzzleFlash(targetX: number, targetY: number): void {
		const flash = new Konva.Circle({
			x: 15,
			y: 12,
			radius: 6,
			fill: "#ffd166",
			opacity: 0.95,
			listening: false,
		});
		const tracer = new Konva.Line({
			points: [15, 12, targetX - this.defense.x(), targetY - this.defense.y()],
			stroke: "#fff3b0",
			strokeWidth: 2,
			lineCap: "round",
			opacity: 0.9,
			listening: false,
		});
		this.defense.add(tracer);
		this.defense.add(flash);
		flash.moveToTop();
		this.defense.getLayer()?.batchDraw();

		flash.to({ scaleX: 1.8, scaleY: 1.8, opacity: 0, duration: 0.12 });
		tracer.to({ opacity: 0, duration: 0.16 });

		window.setTimeout(() => {
			flash.destroy();
			tracer.destroy();
			this.defense.getLayer()?.batchDraw();
		}, 180);
	}
}
