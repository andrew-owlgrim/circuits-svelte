import { CircuitElement } from '../CircuitElement';

import Drawer from '../../core/drawer/Drawer';
import gameContext from '../gameContext';

export default class ButtonElement extends CircuitElement {
	isPressed: boolean = false;
	activated: boolean = false;
	private nextActivated = false;

	constructor(size: number) {
		super(size);
		this.type = 'button';
		this.drawer = (ctx) => drawButton({ ctx, size: this.size.x });
	}

	prepareUpdate() {
		this.nextActivated = this.isPressed;
	}

	applyUpdate() {
		this.activated = this.nextActivated;
	}
}

type DrawButtonOptions = {
	ctx: CanvasRenderingContext2D;
	size: number;
};

function drawButton({ ctx, size }: DrawButtonOptions) {
	const tile = Drawer.create('circle', {
		radius: size / 2,
		fill: true,
		fillStyle: gameContext.colors.bg,
		stroke: true,
		strokeStyle: gameContext.colors.border,
		lineWidth: 1.5
	});
	const button = Drawer.create('circle', {
		radius: size / 3,
		fill: true,
		fillStyle: gameContext.colors.bg,
		stroke: true,
		strokeStyle: gameContext.colors.gray,
		lineWidth: 1.5
	});
	Drawer.draw(ctx, [tile, button]);
}
