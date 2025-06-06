import { Entity } from '$lib/circuits-game/game-engine';
import { Layers } from '../types';

export default class GridEntity extends Entity {
	constructor(tileSize: number, gridSize: number) {
		super();
		this.size = { x: tileSize * gridSize, y: tileSize * gridSize };
		this.view.layer = Layers.Grid;
		this.view.drawer = (ctx) => {
			drawGrid({ ctx, tileSize, gridSize, color: '#ffffff33', lineWidth: 1 });
		};
	}
}

type GridDrawerOptions = {
	ctx: CanvasRenderingContext2D;
	tileSize: number;
	gridSize: number;
	color?: string;
	lineWidth?: number;
};

function drawGrid({ ctx, tileSize, gridSize, color = '#444', lineWidth = 1 }: GridDrawerOptions) {
	const totalSize = gridSize * tileSize;
	const halfSize = totalSize / 2;

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
