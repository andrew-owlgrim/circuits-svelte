import type { Shape, ShapeType } from './Drawer';

export class RectShape implements Shape {
	type: ShapeType = 'rect';
	x = 0;
	y = 0;
	width: number = 100;
	height: number = 100;
	rotation = 0;
	fill = false;
	stroke = true;
	fillStyle = 'black';
	strokeStyle = 'black';
	lineWidth = 1;
	lineJoin: CanvasLineJoin = 'miter';
	cornerRadius: number = 0;

	constructor(options: Partial<RectShape> = {}) {
		Object.assign(this, options);
	}
}

export function drawRect(ctx: CanvasRenderingContext2D, shape: RectShape) {
	const {
		x,
		y,
		width,
		height,
		rotation = 0,
		cornerRadius = 0,
		fill = false,
		fillStyle = 'black',
		stroke = true,
		strokeStyle = 'black',
		lineWidth = 1,
		lineJoin = 'miter'
	} = shape;

	const r = Math.min(cornerRadius, width / 2, height / 2);

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);

	ctx.beginPath();

	if (r > 0) {
		// Скруглённый прямоугольник
		ctx.moveTo(-width / 2 + r, -height / 2);
		ctx.lineTo(width / 2 - r, -height / 2);
		ctx.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + r);
		ctx.lineTo(width / 2, height / 2 - r);
		ctx.quadraticCurveTo(width / 2, height / 2, width / 2 - r, height / 2);
		ctx.lineTo(-width / 2 + r, height / 2);
		ctx.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - r);
		ctx.lineTo(-width / 2, -height / 2 + r);
		ctx.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + r, -height / 2);
	} else {
		// Обычный прямоугольник
		ctx.rect(-width / 2, -height / 2, width, height);
	}

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
