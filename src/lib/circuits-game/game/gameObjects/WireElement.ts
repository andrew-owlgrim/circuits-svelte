import { CircuitElement } from '../CircuitElement';
import gameContext from '../gameContext';
import { Layers, type Direction } from '../gameUtils';
import Drawer, { type Shape } from '../../core/drawer/Drawer';

export default class WireElement extends CircuitElement {
	bridge: boolean = false;

	constructor(size: number) {
		super(size);
		this.type = 'wire';
		this.layer = Layers.Wires;

		this.drawer = (ctx) =>
			drawWire({
				ctx,
				size: this.size.x,
				directions: this.getDirections(),
				bridge: (this.state & 0b0010_0000) !== 0
			});
	}

	// Возвращает directions как [up, right, down, left]
	private getDirections(): boolean[] {
		const s = this.state;
		return [
			(s & 0b0001) !== 0, // up
			(s & 0b0010) !== 0, // right
			(s & 0b0100) !== 0, // down
			(s & 0b1000) !== 0 // left
		];
	}

	prepareUpdate(neighborStates: number[]): void {
		const dirs = this.getDirections();
		let powered = false;

		for (let i = 0; i < 4; i++) {
			if (dirs[i] && neighborStates[i] > 0) {
				powered = true;
				break;
			}
		}

		// Если провод получает сигнал — ставим бит 5 (0b10000)
		this.nextState = this.state & 0b1111; // сохраняем только направление (4 младших бита)
		if (powered) this.nextState |= 0b10000; // активен
	}

	applyUpdate(): void {
		this.state = this.nextState;
	}
}

// Drawer

type DrawWireOptions = {
	ctx: CanvasRenderingContext2D;
	size: number;
	directions: boolean[]; // [up, right, down, left]
	bridge?: boolean;
};

export function drawWire({ ctx, size, directions, bridge = false }: DrawWireOptions) {
	const color = gameContext.colors.inactive;
	const activeCount = directions.filter(Boolean).length;
	const shapes = [];

	const strokeStyle: Partial<Shape> = {
		lineWidth: 3,
		strokeStyle: color,
		lineCap: 'round'
	};

	if (bridge && directions.every(Boolean)) {
		const long = Drawer.create('line', {
			x: 0,
			y: -size / 2,
			x2: 0,
			y2: size / 2,
			...strokeStyle
		});
		const short1 = Drawer.create('line', {
			x: -size / 2,
			y: 0,
			x2: -size / 4,
			y2: 0,
			...strokeStyle
		});
		const short2 = Drawer.create('line', {
			x: size / 2,
			y: 0,
			x2: size / 4,
			y2: 0,
			...strokeStyle
		});
		shapes.push(long, short1, short2);
	} else {
		const points = [
			{ x: 0, y: -size / 2 }, // Up
			{ x: size / 2, y: 0 }, // Right
			{ x: 0, y: size / 2 }, // Down
			{ x: -size / 2, y: 0 } // Left
		];

		for (let i = 0; i < 4; i++) {
			if (directions[i]) {
				shapes.push(
					Drawer.create('line', {
						x2: points[i].x,
						y2: points[i].y,
						...strokeStyle
					})
				);
			}
		}

		if (activeCount <= 1) {
			//draw circle in the middle
			shapes.push(
				Drawer.create('circle', {
					radius: size / 6,
					fill: true,
					fillStyle: color,
					stroke: false
				})
			);
		}
	}
	Drawer.draw(ctx, shapes);
}
