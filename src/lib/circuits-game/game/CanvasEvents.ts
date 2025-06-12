// PointerTracker.ts
import type CircuitsGame from './CircuitsGame';
import { type Vector, Events } from '../core';
import { getCanvasPosition, getGridPosition, getWorldPosition } from '../utils/utils';

export enum MouseButton {
	Left,
	Middle,
	Right
}

export type PointerEventPayload = {
	DOMEvent: PointerEvent | MouseEvent | WheelEvent;
	canvasElement: HTMLCanvasElement;
	screen: Vector;
	canvas: Vector;
	world: Vector;
	grid: Vector;
	gridTarget: any;
	screenStart?: Vector;
	canvasStart?: Vector;
	worldStart?: Vector;
	gridStart?: Vector;
	gridTargetStart?: any;
	delta?: Vector;
	button?: MouseButton;
};

export default class CanvasEvents {
	private canvas: HTMLCanvasElement;
	private game: CircuitsGame;
	private threshold: number = 5;
	private screen: Vector | null = null;
	private screenStart: Vector | null = null;
	private gridTargetStart: any;
	private delta: Vector | null = null;
	private dragging = false;
	private button: MouseButton | null = null;

	constructor(game: CircuitsGame) {
		this.game = game;
		const canvas = game.canvas;
		this.canvas = canvas;

		this.onPointerDown = this.onPointerDown.bind(this);
		this.onPointerMove = this.onPointerMove.bind(this);
		this.onPointerUp = this.onPointerUp.bind(this);
		this.onWheel = this.onWheel.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);

		canvas.addEventListener('pointerdown', this.onPointerDown);
		canvas.addEventListener('pointermove', this.onPointerMove);
		canvas.addEventListener('pointerup', this.onPointerUp);
		canvas.addEventListener('wheel', this.onWheel);
		canvas.addEventListener('click', this.onClick);
		canvas.addEventListener('mouseleave', this.onMouseLeave);

		canvas.addEventListener('contextmenu', (e) => e.preventDefault());
	}

	destroy() {
		this.canvas.removeEventListener('pointerdown', this.onPointerDown);
		this.canvas.removeEventListener('pointermove', this.onPointerMove);
		this.canvas.removeEventListener('pointerup', this.onPointerUp);
		this.canvas.removeEventListener('wheel', this.onWheel);
		this.canvas.removeEventListener('click', this.onClick);
		this.canvas.removeEventListener('mouseleave', this.onMouseLeave);
	}

	//

	private onPointerDown(event: PointerEvent) {
		this.screen = { x: event.clientX, y: event.clientY };
		this.screenStart = this.screen;
		const gridStart = getGridPosition(this.game, this.screenStart);
		this.gridTargetStart = this.game.circuit.get(gridStart.x, gridStart.y);
		this.button = event.button as MouseButton;
		Events.trigger(this.canvas, 'pointerDown', this.getPayload(event));
	}

	private onPointerMove(event: PointerEvent) {
		if (this.screen)
			this.delta = { x: event.clientX - this.screen.x, y: event.clientY - this.screen.y };
		else this.delta = { x: 0, y: 0 };
		this.screen = { x: event.clientX, y: event.clientY };

		if (this.screenStart && !this.dragging) {
			const distSq =
				((this.screenStart?.x ?? this.screen.x) - this.screen.x) ** 2 +
				((this.screenStart?.y ?? this.screen.y) - this.screen.y) ** 2;
			if (distSq > this.threshold ** 2) {
				this.dragging = true;
				Events.trigger(this.canvas, 'dragStart', this.getPayload(event));
			}
		}

		if (this.dragging) {
			Events.trigger(this.canvas, 'drag', this.getPayload(event));
		}

		Events.trigger(this.canvas, 'pointerMove', this.getPayload(event));
	}

	private onPointerUp(event: PointerEvent) {
		if (this.dragging) {
			Events.trigger(this.canvas, 'dragEnd', this.getPayload(event));
		} else {
			Events.trigger(this.canvas, 'spotClick', this.getPayload(event));
		}
		Events.trigger(this.canvas, 'pointerUp', this.getPayload(event));

		this.screenStart = null;
		this.dragging = false;
		this.button = null;
	}

	private onWheel(event: WheelEvent) {
		Events.trigger(this.canvas, 'wheel', this.getPayload(event));
	}

	private onClick(event: MouseEvent) {
		Events.trigger(this.canvas, 'click', this.getPayload(event));
	}

	private onMouseLeave(event: MouseEvent) {
		if (this.dragging) {
			Events.trigger(this.canvas, 'dragEnd', this.getPayload(event));
		}
		Events.trigger(this.canvas, 'mouseLeave', this.getPayload(event));
		this.screenStart = null;
		this.dragging = false;
	}

	//

	private getPayload(event: PointerEvent | WheelEvent | MouseEvent): PointerEventPayload {
		const payload = {
			DOMEvent: event,
			canvasElement: this.canvas,
			screen: this.screen,
			button: this.button,
			gridTargetStart: this.gridTargetStart
		} as any;

		if (this.screen) {
			const screen = this.screen;
			Object.defineProperties(payload, {
				canvas: {
					get: () => getCanvasPosition(this.canvas, screen),
					enumerable: true
				},
				world: {
					get: () => getWorldPosition(this.game, screen),
					enumerable: true
				},
				grid: {
					get: () => getGridPosition(this.game, screen),
					enumerable: true
				},
				gridTarget: {
					get: () => this.game.circuit.get(payload.grid.x, payload.grid.y),
					enumerable: true
				}
			});
		}

		if (event.type === 'pointermove') {
			payload.delta = this.delta;

			if (this.dragging && this.screenStart) {
				const screenStart = this.screenStart;
				payload.screenStart = screenStart;
				Object.defineProperties(payload, {
					canvasStart: {
						get: () => getCanvasPosition(this.canvas, screenStart),
						enumerable: true
					},
					worldStart: {
						get: () => getWorldPosition(this.game, screenStart),
						enumerable: true
					},
					gridStart: {
						get: () => getGridPosition(this.game, screenStart),
						enumerable: true
					}
				});
			}
		}

		return payload as PointerEventPayload;
	}
}
