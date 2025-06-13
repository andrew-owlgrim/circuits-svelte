import { DefaultSceneObject } from '$lib/circuits-game/core';
import gameContext from '../gameContext';
import { Layers } from '../gameUtils';

export default class Grid extends DefaultSceneObject {
	constructor(tileSize: number, gridSize: number) {
		super();
		this.size = { x: tileSize * gridSize, y: tileSize * gridSize };
		this.layer = Layers.Grid;
		this.drawer = (ctx) => {
			drawGrid({ ctx, tileSize, gridSize });
		};
	}
}

type GridDrawerOptions = {
	ctx: CanvasRenderingContext2D;
	tileSize: number;
	gridSize: number;
};

function drawGrid({ ctx, tileSize, gridSize }: GridDrawerOptions) {
	const totalSize = gridSize * tileSize;
	const halfSize = totalSize / 2;
	const color = gameContext.colors.border,
		lineWidth = 1;

	ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.setLineDash([4, 8]); // пунктир: 2px линия, 2px пробел

	// Вертикальные линии
	for (let x = -halfSize; x <= halfSize; x += tileSize) {
		ctx.beginPath();
		ctx.moveTo(x, -halfSize);
		ctx.lineTo(x, halfSize);
		ctx.stroke();
	}

	// Горизонтальные линии
	for (let y = -halfSize; y <= halfSize; y += tileSize) {
		ctx.beginPath();
		ctx.moveTo(-halfSize, y);
		ctx.lineTo(halfSize, y);
		ctx.stroke();
	}

	ctx.restore();
}
