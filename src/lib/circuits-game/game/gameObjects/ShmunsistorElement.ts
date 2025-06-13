import type { Vector } from '../../core';
import { Direction, getAngle, getDelta } from '../gameUtils';

import { CircuitElement } from '../CircuitElement';
import gameContext from '../gameContext';
import Drawer from '../../core/drawer/Drawer';

export default class ShmunsistorElement extends CircuitElement {
	direction: Direction = Direction.Up;
	invert: boolean = false;

	constructor(bodySize: number) {
		super(bodySize);
		this.type = 'shmunsistor';

		this.drawer = (ctx) =>
			drawShmunsistor({ ctx, size: this.size.x, direction: this.direction, invert: this.invert });
	}

	prepareUpdate(neighbors: Record<Direction, CircuitElement | null>): void {}

	applyUpdate(): void {}
}

// Drawer

type DrawShmunsistorOptions = {
	ctx: CanvasRenderingContext2D;
	size: number;
	direction: Direction;
	invert: boolean;
};

export function drawShmunsistor({ ctx, size, direction, invert }: DrawShmunsistorOptions) {
	const angle = getAngle(direction);
	const delta = getDelta(direction);

	const tile = Drawer.create('rect', {
		width: size,
		height: size,
		fill: true,
		fillStyle: gameContext.colors.bg,
		stroke: true,
		strokeStyle: gameContext.colors.border,
		lineWidth: 1.5,
		cornerRadius: size / 8
	});

	const triangle = Drawer.create('polygon', {
		x: -(delta.x * size) / 32,
		y: -(delta.y * size) / 32,
		radius: size * 0.3,
		rotation: angle,
		fill: invert,
		fillStyle: gameContext.colors.inactive,
		stroke: true,
		strokeStyle: gameContext.colors.inactive,
		lineWidth: 3,
		cornerRadius: size / 8
	});

	Drawer.draw(ctx, [tile, triangle]);
}
