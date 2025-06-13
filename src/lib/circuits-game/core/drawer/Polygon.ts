import type { Shape, ShapeType } from './Drawer';

export class PolygonShape implements Shape {
	type: ShapeType = 'polygon';
	x = 0;
	y = 0;
	radius: number = 50;
	sides: number = 3;
	rotation = 0;
	fill = false;
	stroke = true;
	fillStyle = 'black';
	strokeStyle = 'black';
	lineWidth = 1;
	lineJoin: CanvasLineJoin = 'miter';
	cornerRadius: number = 0;

	constructor(options: Partial<PolygonShape> = {}) {
		Object.assign(this, options);
	}

	get points(): [number, number][] {
		const pts: [number, number][] = [];
		const angleStep = (2 * Math.PI) / this.sides;
		const angleOffset = -Math.PI / 2; // Сдвиг, чтобы первая вершина смотрела вверх
		for (let i = 0; i < this.sides; i++) {
			const angle = i * angleStep + angleOffset;
			pts.push([Math.cos(angle) * this.radius, Math.sin(angle) * this.radius]);
		}
		return pts;
	}
}

// Вспомогательная функция для скругления углов полигона
function roundedPolygonPath(
	ctx: CanvasRenderingContext2D,
	points: [number, number][],
	radius: number
) {
	const len = points.length;
	if (len < 2) return;

	for (let i = 0; i < len; i++) {
		const p0 = points[(i - 1 + len) % len];
		const p1 = points[i];
		const p2 = points[(i + 1) % len];

		const v1x = p1[0] - p0[0];
		const v1y = p1[1] - p0[1];
		const v2x = p2[0] - p1[0];
		const v2y = p2[1] - p1[1];

		const len1 = Math.hypot(v1x, v1y);
		const len2 = Math.hypot(v2x, v2y);

		const r = Math.min(radius, len1 / 2, len2 / 2);

		const startX = p1[0] - (v1x / len1) * r;
		const startY = p1[1] - (v1y / len1) * r;
		const endX = p1[0] + (v2x / len2) * r;
		const endY = p1[1] + (v2y / len2) * r;

		if (i === 0) {
			ctx.moveTo(startX, startY);
		} else {
			ctx.lineTo(startX, startY);
		}

		ctx.quadraticCurveTo(p1[0], p1[1], endX, endY);
	}
	ctx.closePath();
}

export function drawPolygon(ctx: CanvasRenderingContext2D, shape: PolygonShape) {
	const {
		x,
		y,
		rotation = 0,
		fill = false,
		fillStyle = 'black',
		stroke = true,
		strokeStyle = 'black',
		lineWidth = 1,
		lineJoin = 'miter',
		cornerRadius = 0
	} = shape;

	const points = shape.points;
	if (!points || points.length < 2) return;

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);

	ctx.beginPath();
	if (cornerRadius > 0) {
		roundedPolygonPath(ctx, points, cornerRadius);
	} else {
		ctx.moveTo(points[0][0], points[0][1]);
		for (let i = 1; i < points.length; i++) {
			ctx.lineTo(points[i][0], points[i][1]);
		}
		ctx.closePath();
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
