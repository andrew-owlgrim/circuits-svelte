import Drawer from '../../core/drawer/Drawer';
import { CircuitElement } from '../CircuitElement';
import gameContext from '../gameContext';
import { Direction } from '../gameUtils';

export default class PowerSourceElement extends CircuitElement {
	direction: Direction = Direction.Up;

	constructor(size: number) {
		super(size);
		this.type = 'signalSource';
		this.drawer = (ctx) =>
			drawSignalSource({
				ctx,
				size: this.size.x,
				direction: this.direction,
				color: gameContext.colors.active
			});
	}

	prepareUpdate(): void {}
	applyUpdate(): void {}
}

//

type DrawSignalSourceOptions = {
	ctx: CanvasRenderingContext2D;
	size: number;
	direction: Direction;
};

export function drawSignalSource({ ctx, size, direction }: DrawSignalSourceOptions) {
	const star = Drawer.create('star', {
		radius: size / 3,
		sides: 4,
		fill: true,
		fillStyle: gameContext.colors.active,
		stroke: true,
		strokeStyle: gameContext.colors.activeDark,
		lineJoin: 'round',
		cornerRadius: size / 8
	});
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
	Drawer.draw(ctx, [tile, star]);
}
