import type { Vector } from '../coreUtils';

export function textureDrawer(
	ctx: CanvasRenderingContext2D,
	size: Vector,
	texture: HTMLImageElement
) {
	ctx.drawImage(texture, -size.x / 2, -size.y / 2, size.x, size.y);
}

export function rectangleDrawer(ctx: CanvasRenderingContext2D, size: Vector, color = '#ffffff') {
	ctx.save();
	ctx.strokeStyle = color;
	ctx.strokeRect(-size.x / 2, -size.y / 2, size.x, size.y);
	ctx.restore();
}
