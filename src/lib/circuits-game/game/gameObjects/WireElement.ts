import { CircuitElement } from '../CircuitElement';
import gameContext from '../gameContext';
import { Layers, type Direction } from '../gameUtils';

export default class WireElement extends CircuitElement {
	directions: boolean[] = [false, false, false, false];
	bridge: boolean = false;

	constructor(size: number) {
		super(size);
		this.type = 'wire';
		this.layer = Layers.Wires;
		this.drawer = (ctx) =>
			drawWire({
				ctx,
				size: this.size,
				directions: this.directions,
				bridge: this.bridge,
				color: gameContext.colors.inactive
			});
	}

	prepareUpdate(neighbors: Record<Direction, CircuitElement | null>): void {}

	applyUpdate(): void {}
}

// Drawer

type DrawWireOptions = {
	ctx: CanvasRenderingContext2D;
	size: { x: number; y: number };
	directions: boolean[]; // [up, right, down, left]
	color?: string;
	lineWidth?: number;
	bridge?: boolean;
};

export function drawWire({
	ctx,
	size,
	directions,
	color = '#ffffff',
	lineWidth = 3,
	bridge = false
}: DrawWireOptions) {
	const halfW = size.x / 2;
	const halfH = size.y / 2;

	ctx.save();
	ctx.strokeStyle = color;
	ctx.lineWidth = lineWidth;
	ctx.lineCap = 'round';

	const center = { x: 0, y: 0 };
	const points = [
		{ x: 0, y: -halfH }, // up
		{ x: halfW, y: 0 }, // right
		{ x: 0, y: halfH }, // down
		{ x: -halfW, y: 0 } // left
	];

	const activeCount = directions.filter(Boolean).length;

	if (bridge && directions.every(Boolean)) {
		// Мост
		const shortLength = halfW * 0.5;

		ctx.beginPath();
		// Горизонтальные короткие линии
		ctx.moveTo(-halfW, 0);
		ctx.lineTo(-halfW + shortLength, 0);

		ctx.moveTo(halfW, 0);
		ctx.lineTo(halfW - shortLength, 0);

		// Вертикальная длинная линия
		ctx.moveTo(0, -halfH);
		ctx.lineTo(0, halfH);

		ctx.stroke();
	} else {
		// Стандартные соединения
		ctx.beginPath();
		for (let i = 0; i < 4; i++) {
			if (directions[i]) {
				ctx.moveTo(center.x, center.y);
				ctx.lineTo(points[i].x, points[i].y);
			}
		}
		ctx.stroke();

		if (activeCount <= 1) {
			// Рисуем кружочек в центре
			ctx.beginPath();
			ctx.arc(center.x, center.y, lineWidth * 1.5, 0, Math.PI * 2);
			ctx.fillStyle = color;
			ctx.fill();
		}
	}

	ctx.restore();
}
