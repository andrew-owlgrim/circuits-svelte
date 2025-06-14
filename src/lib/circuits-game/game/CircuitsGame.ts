import { Events, type Vector } from '../core';
import Circuit from './Circuit';

import { type Cfg, defaultCfg } from './cfg';
import { Direction, type ElementType } from './gameUtils';
import { Camera, Renderer, type SceneObject } from '../core';
import Grid from './gameObjects/Grid';
import CanvasEvents from './CanvasEvents';
import GameActions from './GameActions';
import gameContext, { type GameContext } from './gameContext';
import { CircuitEngine } from './CircuitEngine';

export default class CircuitsGame {
	cfg: Cfg;
	canvas: HTMLCanvasElement;
	canvasEvents: CanvasEvents;
	render: Renderer;
	camera: Camera = new Camera();
	sceneObjects: Map<string, SceneObject> = new Map();
	circuit: Circuit;
	actions: GameActions = new GameActions(this);
	activeTool: ElementType = 'button';
	context: GameContext;
	circuitEngine: CircuitEngine;

	constructor(canvas: HTMLCanvasElement, outerCfg?: Partial<Cfg>) {
		this.canvas = canvas;
		this.canvasEvents = new CanvasEvents(this);
		this.render = new Renderer(this.canvas, this.sceneObjects, this.camera);
		this.cfg = { ...defaultCfg, ...outerCfg };
		this.circuit = new Circuit(this.cfg.gridSize, this.cfg.gridSize);
		this.context = gameContext;
		this.circuitEngine = new CircuitEngine(this.circuit, this.cfg.updateRate);

		// init

		this.context.colors = this.cfg.colors;

		const grid = new Grid(this.cfg.tileSize, this.cfg.gridSize);
		this.sceneObjects.set('grid', grid);

		this.actions.attachEvents();
	}

	clear() {
		this.render.clear();
		this.canvasEvents.destroy();
		this.actions.destroy();
	}

	run() {
		this.render.run();
		this.circuitEngine.run();
	}

	stop() {
		this.render.stop();
		this.circuitEngine.stop();
	}

	// placeWireBetween(x1: number, y1: number, x2: number, y2: number) {
	// 	if (!this.grid.inBounds(x1, y1) || !this.grid.inBounds(x2, y2)) return;

	// 	const dx = x2 - x1;
	// 	const dy = y2 - y1;

	// 	const dirAtoB = getDirectionFromDelta(dx, dy);
	// 	if (dirAtoB === null) return;

	// 	const dirBtoA = getOppositeDirection(dirAtoB);

	// 	const A = this.grid.get(x1, y1);
	// 	const B = this.grid.get(x2, y2);

	// 	// Подключаем A → B, если это провод
	// 	if (A instanceof WireElement) {
	// 		A.directions[dirAtoB] = true;
	// 	}

	// 	// Если B уже провод — подключаем к A
	// 	else if (B instanceof WireElement) {
	// 		B.directions[dirBtoA] = true;
	// 	}
	// }

	// loop() {
	// 	// Фаза 1: подготовка
	// 	this.grid.forEach((el, x, y) => {
	// 		const neighbors = {
	// 			[Direction.Up]: this.grid.get(x, y - 1),
	// 			[Direction.Right]: this.grid.get(x + 1, y),
	// 			[Direction.Down]: this.grid.get(x, y + 1),
	// 			[Direction.Left]: this.grid.get(x - 1, y)
	// 		};

	// 		el.prepareUpdate(neighbors);
	// 	});

	// 	// Фаза 2: применение
	// 	this.grid.forEach((el) => {
	// 		el.applyUpdate();
	// 	});
	// }
}
