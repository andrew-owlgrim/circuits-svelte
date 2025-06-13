import { CircuitElement } from '../CircuitElement';
import Drawer from '../../core/drawer/Drawer';
import type { Direction } from '../gameUtils';
import gameContext from '../gameContext';

export default class DisplayElement extends CircuitElement {
	constructor(bodySize: number) {
		super(bodySize);
		this.type = 'display';

		this.drawer = (ctx) => drawDisplay({ ctx, size: bodySize });
	}

	prepareUpdate(): void {}

	applyUpdate(): void {}
}

type drawDisplayOptions = {
	ctx: CanvasRenderingContext2D;
	size: number;
};

export function drawDisplay({ ctx, size }: drawDisplayOptions) {
	const tile = Drawer.create('polygon', {
		radius: size * 0.55,
		sides: 4,
		fill: true,
		fillStyle: gameContext.colors.bg,
		stroke: true,
		strokeStyle: gameContext.colors.border,
		lineWidth: 1.5,
		cornerRadius: size / 8
	});

	const display = Drawer.create('rect', {
		width: size * 0.75,
		height: size * 0.75,
		fill: true,
		fillStyle: gameContext.colors.brightBlue,
		stroke: true,
		strokeStyle: gameContext.colors.brightBlueDark,
		lineWidth: 1.5,
		cornerRadius: size / 8
	});

	Drawer.draw(ctx, [tile, display]);
}
