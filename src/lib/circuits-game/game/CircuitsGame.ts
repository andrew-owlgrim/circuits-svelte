import { GameEngine, type Vector } from '../game-engine';
import Grid from './Grid';

import type { Cfg } from './cfg';
import { defaultCfg } from './cfg';
import ElementController from './controllers/elementController';
import GridEntity from './entities/GridEntity';
import WireElement from './entities/WireElement';
import { Direction } from './types';

export default class CirctuitsGame extends GameEngine {
	cfg: Cfg;

	grid: Grid;
	elementController: ElementController;

	constructor(canvas: HTMLCanvasElement, outerCfg?: Partial<Cfg>) {
		super(canvas);
		this.cfg = { ...defaultCfg, ...outerCfg };

		this.grid = new Grid(this.cfg.gridSize, this.cfg.gridSize);
		this.elementController = new ElementController(this);

		this.init();
	}

	init() {
		super.init();
		this.addEntity(new GridEntity(this.cfg.tileSize, this.cfg.gridSize));
	}

	placeElement(...params: Parameters<ElementController['placeElement']>) {
		this.elementController.placeElement(...params);
	}

	removeElement(...params: Parameters<ElementController['removeElement']>) {
		this.elementController.removeElement(...params);
	}

	getElement(x: number, y: number) {
		return this.grid.get(x, y);
	}

	placeWireBetween(x1: number, y1: number, x2: number, y2: number) {
		if (!this.grid.inBounds(x1, y1) || !this.grid.inBounds(x2, y2)) return;

		const dx = x2 - x1;
		const dy = y2 - y1;

		const dirAtoB = getDirectionFromDelta(dx, dy);
		if (dirAtoB === null) return;

		const dirBtoA = getOppositeDirection(dirAtoB);

		const A = this.grid.get(x1, y1);
		const B = this.grid.get(x2, y2);

		// Подключаем A → B, если это провод
		if (A instanceof WireElement) {
			A.directions[dirAtoB] = true;
		}

		// Пустая клетка → ставим новый провод
		if (!B) {
			const wire = new WireElement(this.cfg.tileSize);
			wire.directions[dirBtoA] = true;

			this.placeElement(x2, y2, wire);
		}

		// Если B уже провод — подключаем к A
		else if (B instanceof WireElement) {
			B.directions[dirBtoA] = true;
		}
	}
}

function getDirectionFromDelta(dx: number, dy: number): Direction | null {
	if (dx === 1 && dy === 0) return Direction.Right;
	if (dx === -1 && dy === 0) return Direction.Left;
	if (dx === 0 && dy === 1) return Direction.Down;
	if (dx === 0 && dy === -1) return Direction.Up;
	return null;
}

function getOppositeDirection(dir: Direction): Direction {
	return (dir + 2) % 4;
}
