import { CircuitElement } from '../CircuitElement';
import gameContext from '../gameContext';
import { Layers, StateFlags, type Direction } from '../gameUtils';
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
				bridge: (this.state & 0b0010_0000) !== 0,
				active: (this.state & 0b0001_0000) !== 0
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
		const OppositeMasks = [0b0100, 0b1000, 0b0001, 0b0010]; // down, left, up, right

		const dirs = this.getDirections();
		let powered = false;

		for (let i = 0; i < 4; i++) {
			if (!dirs[i]) continue;

			const neighbor = neighborStates[i];
			const hasOutput = (neighbor & StateFlags.Output) !== 0;
			const hasDirectionToward = (neighbor & OppositeMasks[i]) !== 0;

			if (hasOutput && hasDirectionToward) {
				powered = true;
				break;
			}
		}

		this.nextState = this.state & 0b1111; // сохраняем только направления

		if (powered) {
			this.nextState |= StateFlags.Output;
		}
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
	active: boolean;
};

export function drawWire({ ctx, size, directions, bridge = false, active }: DrawWireOptions) {
	const color = active ? gameContext.colors.active : gameContext.colors.inactive;
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
