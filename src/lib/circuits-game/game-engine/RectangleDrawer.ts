import type { DrawerProps, Vector } from './types';

type RectangleDrawerProps = DrawerProps & {
	size: Vector;
	color: string; // hex format, e.g. "#FF0000"
};

export function RectangleDrawer({ context, position, size, color }: RectangleDrawerProps) {
	context.save();
	context.strokeStyle = color;
	context.strokeRect(position.x, position.y, size.x, size.y);
	context.restore();
}
