import { drawCircle, CircleShape } from './CircleShape';
import { drawFreeShape, FreeShape } from './FreeShape';
import { drawLine, LineShape } from './LineShape';
import { drawPolygon, PolygonShape } from './Polygon';
import { RectShape, drawRect } from './RectShape';
import { drawStar, StarShape } from './StarShape';

export type ShapeType = 'rect' | 'circle' | 'line' | 'polygon' | 'star' | 'free';

interface ShapeMap {
	rect: RectShape;
	circle: CircleShape;
	line: LineShape;
	polygon: PolygonShape;
	star: StarShape;
	free: FreeShape;
}

const shapeConstructors: {
	[K in ShapeType]: new (options: Partial<ShapeMap[K]>) => ShapeMap[K];
} = {
	rect: RectShape,
	circle: CircleShape,
	line: LineShape,
	polygon: PolygonShape,
	star: StarShape,
	free: FreeShape
};

const shapeDrawers: {
	[K in ShapeType]: (ctx: CanvasRenderingContext2D, shape: ShapeMap[K]) => void;
} = {
	rect: drawRect,
	circle: drawCircle,
	line: drawLine,
	polygon: drawPolygon,
	star: drawStar,
	free: drawFreeShape
};

export interface Shape {
	type: ShapeType;
	x: number;
	y: number;
	rotation?: number;
	fill?: boolean;
	fillStyle?: string;
	stroke?: boolean;
	strokeStyle?: string;
	lineWidth?: number;
	lineJoin?: CanvasLineJoin;
	lineCap?: CanvasLineCap;
	cornerRadius?: number;
}

export default class Drawer {
	static create<T extends ShapeType>(type: T, options: Partial<ShapeMap[T]> = {}): ShapeMap[T] {
		return new shapeConstructors[type](options);
	}

	static draw(ctx: CanvasRenderingContext2D, shape: Shape | Shape[]) {
		if (Array.isArray(shape)) {
			for (const s of shape) this.drawSingle(ctx, s);
		} else {
			this.drawSingle(ctx, shape);
		}
	}

	private static drawSingle(ctx: CanvasRenderingContext2D, shape: Shape) {
		const drawer = shapeDrawers[shape.type as ShapeType];
		if (drawer) drawer(ctx, shape as any);
		else console.warn(`No drawer for shape type "${shape.type}"`);
	}
}
