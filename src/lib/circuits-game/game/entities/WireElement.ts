import { CircuitElement } from './CircuitElement';

import texture from '../../assets/textures/wire.svg';

export default class WireElement extends CircuitElement {
	directions: boolean[] = [false, false, false, false];

	constructor(size: number) {
		super(size);
		this.type = 'wire';

		this.view.drawer = (ctx) =>
			drawWire({ ctx, size: this.size, directions: this.directions, color: '#ff444488' });
	}
}

// Drawer

type DrawWireOptions = {
	ctx: CanvasRenderingContext2D;
	size: { x: number; y: number };
	directions: boolean[]; // [up, right, down, left]
	color?: string;
	lineWidth?: number;
};

export function drawWire({
	ctx,
	size,
	directions,
	color = '#ffffff',
	lineWidth = 2
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

	ctx.beginPath();

	// Центральная точка
	ctx.moveTo(center.x, center.y);

	for (let i = 0; i < 4; i++) {
		if (directions[i]) {
			ctx.moveTo(center.x, center.y);
			ctx.lineTo(points[i].x, points[i].y);
		}
	}

	ctx.stroke();
	ctx.restore();
}
