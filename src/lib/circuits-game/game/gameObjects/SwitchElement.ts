import { CircuitElement } from '../CircuitElement';

import Drawer from '../../core/drawer/Drawer';
import gameContext from '../gameContext';

export default class SwitchElement extends CircuitElement {
	activated: boolean = false;
	private nextActivated = false;

	constructor(size: number) {
		super(size);
		this.type = 'switch';
		this.drawer = (ctx) => drawButton({ ctx, size: this.size.x, enabled: this.activated });
	}

	prepareUpdate() {
		this.nextActivated = this.activated;
	}

	applyUpdate() {
		this.activated = this.nextActivated;
	}
}

type DrawButtonOptions = {
	ctx: CanvasRenderingContext2D;
	size: number;
	enabled: boolean;
};

function drawButton({ ctx, size, enabled }: DrawButtonOptions) {
	// const tile = Drawer.create('circle', {
	// 	radius: size / 2,
	// 	fill: true,
	// 	fillStyle: gameContext.colors.bg,
	// 	stroke: true,
	// 	strokeStyle: gameContext.colors.border,
	// 	lineWidth: 1.5
	// });
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
	const border = Drawer.create('rect', {
		width: size * 0.8,
		height: size * 0.55,
		strokeStyle: gameContext.colors.gray,
		lineWidth: 1.5,
		cornerRadius: size * 0.25,
		fill: true,
		fillStyle: gameContext.colors.bg
	});
	const offset = size * 0.15;
	const handle = Drawer.create('rect', {
		x: enabled ? offset : -offset,
		width: size * 0.3,
		height: size * 0.3,
		fill: true,
		fillStyle: gameContext.colors.gray,
		stroke: false,
		cornerRadius: size * 0.15
	});
	Drawer.draw(ctx, [tile, border, handle]);
}
