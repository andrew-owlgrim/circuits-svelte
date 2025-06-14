import { CircuitElement } from '../CircuitElement';

import Drawer from '../../core/drawer/Drawer';
import gameContext from '../gameContext';
import { clearFlag, hasFlag, setFlag } from '$lib/circuits-game/utils/bitUtils';
import { StateFlags as sf } from '../gameUtils';

export default class ButtonElement extends CircuitElement {
	public pressedFlag = 0b0010_0000;

	constructor(size: number) {
		super(size);
		this.type = 'button';
		this.state = sf.Up | sf.Down | sf.Left | sf.Right;
		this.drawer = (ctx) =>
			drawButton({
				ctx,
				size: this.size.x,
				pressed: hasFlag(this.state, this.pressedFlag)
			});
	}

	prepareUpdate() {
		this.nextState = hasFlag(this.state, this.pressedFlag)
			? setFlag(this.state, sf.Output)
			: clearFlag(this.state, sf.Output);
	}

	applyUpdate() {
		this.state = this.nextState;
	}
}

type DrawButtonOptions = {
	ctx: CanvasRenderingContext2D;
	size: number;
	pressed: boolean;
};

function drawButton({ ctx, size, pressed }: DrawButtonOptions) {
	const bgColor = gameContext.colors.bg;
	const borderColor = gameContext.colors.border;
	const buttonColor = pressed ? gameContext.colors.grayDark : gameContext.colors.gray;

	const tile = Drawer.create('circle', {
		radius: size / 2,
		fill: true,
		fillStyle: bgColor,
		stroke: true,
		strokeStyle: borderColor,
		lineWidth: 1.5
	});

	const button = Drawer.create('circle', {
		radius: size / 3,
		fill: true,
		fillStyle: bgColor,
		stroke: true,
		strokeStyle: buttonColor,
		lineWidth: 1.5
	});

	Drawer.draw(ctx, [tile, button]);
}
