import { GameEngine, type Vector } from '../game-engine';
import Grid from './Grid';

import type { Cfg } from './cfg';
import { defaultCfg } from './cfg';
import ElementController from './controllers/elementController';
import GridEntity from './entities/GridEntity';

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
}
