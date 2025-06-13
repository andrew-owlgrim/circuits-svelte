import type { Shape, ShapeType } from './Drawer';

export class LineShape implements Shape {
	type: ShapeType = 'line';
	x = 0;
	y = 0;
	x2 = 100;
	y2 = 0;
	rotation = 0;
	stroke = true;
	strokeStyle = 'black';
	lineWidth = 1;
	lineJoin: CanvasLineJoin = 'miter';
	lineCap: CanvasLineCap = 'butt';

	constructor(options: Partial<LineShape> = {}) {
		Object.assign(this, options);
	}
}

export function drawLine(ctx: CanvasRenderingContext2D, shape: LineShape) {
	const {
		x,
		y,
		x2,
		y2,
		rotation = 0,
		stroke = true,
		strokeStyle = 'black',
		lineWidth = 1,
		lineJoin = 'miter',
		lineCap = 'butt'
	} = shape;

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);

	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(x2 - x, y2 - y);

	ctx.lineJoin = lineJoin;
	ctx.lineCap = lineCap;
	ctx.lineWidth = lineWidth;

	if (stroke) {
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
	}

	ctx.restore();
}
