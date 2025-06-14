import { CircuitElement } from '../CircuitElement';
import Drawer from '../../core/drawer/Drawer';
import { OppositeMasks, StateFlags, type Direction } from '../gameUtils';
import gameContext from '../gameContext';
import { clearFlag, hasFlag } from '$lib/circuits-game/utils/bitUtils';

export default class DisplayElement extends CircuitElement {
	activeFlag = 0b0010_0000;

	constructor(bodySize: number) {
		super(bodySize);
		this.type = 'display';
		this.state = 0b1111;
		this.drawer = (ctx) =>
			drawDisplay({ ctx, size: bodySize, active: hasFlag(this.state, this.activeFlag) });
	}

	prepareUpdate(neighborStates: number[]): void {
		let active = 0;
		for (let i = 0; i < 4; i++) {
			const neighbor = neighborStates[i];
			if (hasFlag(neighbor, StateFlags.Output) && hasFlag(neighbor, OppositeMasks[i]))
				active = this.activeFlag;
		}
		this.nextState = clearFlag(this.state, this.activeFlag) | active;
	}

	applyUpdate(): void {
		this.state = this.nextState;
	}
}

type drawDisplayOptions = {
	ctx: CanvasRenderingContext2D;
	size: number;
	active: boolean;
};

export function drawDisplay({ ctx, size, active }: drawDisplayOptions) {
	const fillStyle = active ? gameContext.colors.brightBlue : gameContext.colors.bleakBlue;
	const strokeStyle = active ? gameContext.colors.brightBlueDark : gameContext.colors.bleakBlueDark;

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
		fillStyle: fillStyle,
		stroke: true,
		strokeStyle: strokeStyle,
		lineWidth: 1.5,
		cornerRadius: size / 8
	});

	Drawer.draw(ctx, [tile, display]);
}
