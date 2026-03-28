import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants"; 

export class GameIntroView {
  private group: Konva.Group; 
  private textNode: Konva.Text | null = null;

  constructor() {
    this.group = new Konva.Group({
        visible: false, // Default to hidden
    });
  }

  // method to return the root Konva Group
  getGroup(): Konva.Group {
      return this.group;
  }

  // methods for visibility
  show(): void {
      this.group.show();
      this.group.getLayer()?.draw();
  }

  hide(): void {
      this.group.hide();
      this.group.getLayer()?.draw();
  }

  renderPage(text: string, isLastPage: boolean, currentPage: number, totalPages: number): void {
    const { title, body } = this.parsePageContent(text);
    const progressRatio = (currentPage + 1) / totalPages;

    this.group.destroyChildren(); // Clear previous content

    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: STAGE_WIDTH, y: STAGE_HEIGHT },
      fillLinearGradientColorStops: [0, "#13211f", 0.5, "#20473d", 1, "#7a5d2c"],
    });
    this.group.add(background);

    const overlay = new Konva.Rect({
      x: 0,
      y: 0,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
      fill: "rgba(8, 12, 10, 0.34)",
    });
    this.group.add(overlay);

    const sunGlow = new Konva.Circle({
      x: STAGE_WIDTH - 120,
      y: 110,
      radius: 120,
      fillRadialGradientStartPoint: { x: 0, y: 0 },
      fillRadialGradientStartRadius: 10,
      fillRadialGradientEndPoint: { x: 0, y: 0 },
      fillRadialGradientEndRadius: 120,
      fillRadialGradientColorStops: [0, "rgba(255, 215, 128, 0.55)", 1, "rgba(255, 215, 128, 0)"],
      listening: false,
    });
    this.group.add(sunGlow);

    const panelShadow = new Konva.Rect({
      x: 72,
      y: 74,
      width: STAGE_WIDTH - 144,
      height: STAGE_HEIGHT - 148,
      fill: "rgba(0, 0, 0, 0.22)",
      cornerRadius: 26,
      listening: false,
    });
    this.group.add(panelShadow);

    const panel = new Konva.Rect({
      x: 60,
      y: 60,
      width: STAGE_WIDTH - 144,
      height: STAGE_HEIGHT - 148,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: 0, y: STAGE_HEIGHT - 148 },
      fillLinearGradientColorStops: [0, "#f0e5c7", 1, "#d3c09a"],
      stroke: "#6c5330",
      strokeWidth: 2,
      cornerRadius: 26,
    });
    this.group.add(panel);

    const progressTrack = new Konva.Rect({
      x: 100,
      y: 90,
      width: STAGE_WIDTH - 240,
      height: 8,
      fill: "rgba(80, 58, 25, 0.22)",
      cornerRadius: 999,
      listening: false,
    });
    this.group.add(progressTrack);

    const progressFill = new Konva.Rect({
      x: 100,
      y: 90,
      width: (STAGE_WIDTH - 240) * progressRatio,
      height: 8,
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: STAGE_WIDTH - 240, y: 0 },
      fillLinearGradientColorStops: [0, "#8f2d1f", 1, "#d98933"],
      cornerRadius: 999,
      listening: false,
    });
    this.group.add(progressFill);

    const chapterTag = new Konva.Text({
      x: 100,
      y: 115,
      width: 220,
      text: isLastPage ? "FIELD MANUAL" : "HISTORICAL BRIEFING",
      fontSize: 14,
      fontStyle: "bold",
      fontFamily: "Georgia",
      fill: "#8b5a2b",
      letterSpacing: 2,
    });
    this.group.add(chapterTag);

    const divider = new Konva.Line({
      points: [100, 146, STAGE_WIDTH - 140, 146],
      stroke: "rgba(94, 66, 32, 0.35)",
      strokeWidth: 2,
      listening: false,
    });
    this.group.add(divider);

    const titleNode = new Konva.Text({
      x: 100,
      y: 160,
      width: STAGE_WIDTH - 320,
      text: title,
      fontSize: 30,
      fontStyle: "bold",
      fontFamily: "Georgia",
      fill: "#2f2114",
      lineHeight: 1.08,
    });
    this.group.add(titleNode);

    this.textNode = new Konva.Text({
      x: 104,
      y: 248,
      width: STAGE_WIDTH - 330,
      text: body,
      fontSize: 19,
      fontFamily: "Georgia",
      fill: "#3f3022",
      align: "left",
      lineHeight: 1.42,
    });
    this.group.add(this.textNode);

    const accentPanel = new Konva.Rect({
      x: STAGE_WIDTH - 180,
      y: 170,
      width: 78,
      height: 170,
      fill: "rgba(102, 60, 26, 0.08)",
      stroke: "rgba(102, 60, 26, 0.2)",
      strokeWidth: 1,
      cornerRadius: 18,
      listening: false,
    });
    this.group.add(accentPanel);

    for (let i = 0; i < totalPages; i++) {
      const dot = new Konva.Circle({
        x: STAGE_WIDTH - 142,
        y: 202 + i * 18,
        radius: i === currentPage ? 6 : 4,
        fill: i === currentPage ? "#8f2d1f" : "rgba(143, 45, 31, 0.25)",
        stroke: i === currentPage ? "#f2ddae" : undefined,
        strokeWidth: i === currentPage ? 1.5 : 0,
        listening: false,
      });
      this.group.add(dot);
    }

    const pageIndicator = new Konva.Text({
      x: STAGE_WIDTH - 208,
      y: 362,
      width: 152,
      text: `${currentPage + 1} / ${totalPages}`,
      fontSize: 20,
      fontStyle: "bold",
      fontFamily: "Georgia",
      fill: "#7c3326",
      align: "center",
    });
    this.group.add(pageIndicator);

    const promptPanel = new Konva.Rect({
      x: 100,
      y: STAGE_HEIGHT - 138,
      width: STAGE_WIDTH - 240,
      height: 46,
      fill: "rgba(55, 33, 15, 0.1)",
      stroke: "rgba(55, 33, 15, 0.16)",
      strokeWidth: 1,
      cornerRadius: 18,
    });
    this.group.add(promptPanel);

    const spaceKey = new Konva.Text({
      x: 122,
      y: STAGE_HEIGHT - 124,
      width: 130,
      text: isLastPage ? "[ SPACE ]" : "[ SPACE ] NEXT",
      fontSize: 15,
      fontStyle: "bold",
      fontFamily: "Arial",
      fill: "#17342e",
      align: "center",
    });
    this.group.add(spaceKey);

    const escKey = new Konva.Text({
      x: STAGE_WIDTH - 258,
      y: STAGE_HEIGHT - 124,
      width: 130,
      text: "[ ESC ] SKIP",
      fontSize: 15,
      fontStyle: "bold",
      fontFamily: "Arial",
      fill: "#17342e",
      align: "center",
    });
    this.group.add(escKey);

    const instruction = new Konva.Text({
      x: 258,
      y: STAGE_HEIGHT - 124,
      width: STAGE_WIDTH - 520,
      text: isLastPage ? "Deploy to the farm and begin the defense." : "Continue through the briefing or skip straight into the game.",
      fontSize: 13,
      fontFamily: "Georgia",
      fill: "#4b3a2b",
      align: "center",
      lineHeight: 1.15,
    });
    this.group.add(instruction);

    this.group.getLayer()?.draw();
  }

  destroy(): void {
    this.group.destroy();
  }

  private parsePageContent(text: string): { title: string; body: string } {
    const [titleLine, ...rest] = text.split("\n").filter((line) => line.trim().length > 0);
    return {
      title: titleLine ?? "",
      body: rest.join("\n\n"),
    };
  }
}
