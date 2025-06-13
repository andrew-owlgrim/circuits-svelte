import type { Shape, ShapeType } from './Drawer';

export class CircleShape implements Shape {
	type: ShapeType = 'circle';
	x = 0;
	y = 0;
	radius: number = 50;
	rotation = 0; // Не обязателен, но пусть будет
	fill = false;
	stroke = true;
	fillStyle = 'black';
	strokeStyle = 'black';
	lineWidth = 1;
	lineJoin: CanvasLineJoin = 'miter';

	constructor(options: Partial<CircleShape> = {}) {
		Object.assign(this, options);
	}
}

export function drawCircle(ctx: CanvasRenderingContext2D, shape: CircleShape) {
	const {
		x,
		y,
		radius,
		rotation = 0,
		fill = false,
		fillStyle = 'black',
		stroke = true,
		strokeStyle = 'black',
		lineWidth = 1,
		lineJoin = 'miter'
	} = shape;

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);
	ctx.beginPath();
	ctx.arc(0, 0, radius, 0, Math.PI * 2);

	ctx.lineJoin = lineJoin;
	ctx.lineWidth = lineWidth;

	if (fill) {
		ctx.fillStyle = fillStyle;
		ctx.fill();
	}

	if (stroke) {
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
	}

	ctx.restore();
}
