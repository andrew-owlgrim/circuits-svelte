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
				size: this.size,
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
	size: { x: number; y: number };
	direction: Direction;
	color?: string;
	lineWidth?: number;
};

export function drawSignalSource({ ctx, size, direction }: DrawSignalSourceOptions) {
	const star = Drawer.create('star', {
		radius: size.x,
		sides: 5,
		fill: true,
		fillStyle: gameContext.colors.bg,
		stroke: true,
		strokeStyle: gameContext.colors.border,
		lineJoin: 'round',
		cornerRadius: 10
	});
	const rect = Drawer.create('rect', {
		width: size.x,
		height: size.y,
		fill: true,
		fillStyle: gameContext.colors.bg,
		stroke: true,
		strokeStyle: gameContext.colors.border,
		lineWidth: 1.5,
		cornerRadius: 100
	});
	const circle = Drawer.create('circle', {
		radius: size.x / 3,
		fill: true,
		fillStyle: gameContext.colors.inactive,
		stroke: true,
		strokeStyle: gameContext.colors.inactiveDark,
		lineWidth: 1.5
	});
	const line1 = Drawer.create('line', {
		x: -size.x / 4,
		y: 0,
		x2: size.x / 4,
		y2: 0,
		strokeStyle: 'white',
		lineWidth: 3,
		lineCap: 'round'
	});
	const line2 = Drawer.create('line', {
		x: 0,
		y: -size.x / 4,
		x2: 0,
		y2: size.x / 4,
		strokeStyle: 'white',
		lineWidth: 3,
		lineCap: 'round'
	});
	Drawer.draw(ctx, [star, rect, circle, line1, line2]);
}
