import type { CircuitElement } from './CircuitElement';
import type CircuitsGame from './CircuitsGame';
import { Direction, type ElementType } from './gameUtils';
import ButtonElement from './gameObjects/ButtonElement';
import DisplayElement from './gameObjects/DisplayElement';
import ShmunsistorElement from './gameObjects/ShmunsistorElement';
import WireElement from './gameObjects/WireElement';
import { Events, type Vector } from '../core';
import { MouseButton, type PointerEventPayload } from './CanvasEvents';
import PowerSourceElement from './gameObjects/PowerSource';
import SwitchElement from './gameObjects/SwitchElement';

export default class GameActions {
	private lastWireGridPos: Vector | null = null;
	constructor(private game: CircuitsGame) {}

	// events

	attachEvents() {
		// pointerDown
		Events.on(this.game.canvas, 'pointerDown', (e) => {
			if (e.button === MouseButton.Left && !e.gridTarget) {
				this.placeElement(e.grid.x, e.grid.y, this.game.activeTool);
			}
			if (e.button === MouseButton.Right) {
				this.removeElement(e.grid.x, e.grid.y);
			}
		});

		// drag
		Events.on(this.game.canvas, 'drag', (e) => {
			// left
			if (e.button === MouseButton.Left) {
				const startElement = this.game.circuit.get(e.gridStart.x, e.gridStart.y);
				if (startElement instanceof ShmunsistorElement) {
					this.rotateElement(e, startElement);
				} else if (this.game.activeTool === 'wire') {
					const curr = e.grid;
					const prev = this.lastWireGridPos;
					this.placeElement(curr.x, curr.y, 'wire');
					if (prev && (curr.x !== prev.x || curr.y !== prev.y)) {
						this.connectElements(prev, curr);
					}
					this.lastWireGridPos = { ...curr };
				}
			}
			// middle
			else if (e.button === MouseButton.Middle) {
				this.dragCamera(e.delta.x, e.delta.y);
			}
			// right
			else if (e.button === MouseButton.Right) {
				this.removeElement(e.grid.x, e.grid.y);
			}
		});
		Events.on(this.game.canvas, 'dragEnd', (e) => {
			this.lastWireGridPos = null;
		});

		// spotClick
		Events.on(this.game.canvas, 'spotClick', (e) => {
			const target = e.gridTargetStart;
			if (e.button === MouseButton.Left) {
				if (target instanceof ShmunsistorElement) {
					target.invert = !target.invert;
				}
				if (target instanceof WireElement) {
					this.switchBridge(target);
				}
			}
		});

		// wheel
		this.scaleCamera = this.scaleCamera.bind(this);
		Events.on(this.game.canvas, 'wheel', this.scaleCamera);

		// button
		Events.on(this.game.canvas, 'pointerDown', (e) => {
			if (e.button === MouseButton.Left && e.gridTargetStart instanceof ButtonElement) {
				this.pressButton(e.gridTargetStart);
			}
		});
		Events.on(this.game.canvas, 'drag', (e) => {
			if (
				e.button === MouseButton.Left &&
				e.gridTargetStart instanceof ButtonElement &&
				e.gridTargetStart !== e.gridTarget
			) {
				this.releaseButton(e.gridTargetStart);
			}
		});
		Events.on(this.game.canvas, 'pointerUp', (e) => {
			if (e.button === MouseButton.Left && e.gridTargetStart instanceof ButtonElement) {
				this.releaseButton(e.gridTargetStart);
			}
		});
	}

	destroy() {
		Events.off(this.game.canvas, 'pointerDown');
		Events.off(this.game.canvas, 'drag');
		Events.off(this.game.canvas, 'dragEnd');
		Events.off(this.game.canvas, 'spotClick');
		Events.off(this.game.canvas, 'wheel', this.scaleCamera);
	}

	// elements

	placeElement(x: number, y: number, type: ElementType): CircuitElement | undefined {
		if (!this.game.circuit.inBounds(x, y)) return;
		if (this.game.circuit.get(x, y)) return;

		const tileSize = this.game.cfg.tileSize;
		const gridSize = this.game.cfg.gridSize;
		const offset = (gridSize * tileSize) / 2;

		const elements = {
			wire: WireElement,
			button: ButtonElement,
			display: DisplayElement,
			shmunsistor: ShmunsistorElement,
			powerSource: PowerSourceElement,
			switch: SwitchElement
		} as const;

		const elementClass = elements[type];
		const element = new elementClass(tileSize);
		element.position = {
			x: x * tileSize + tileSize / 2 - offset,
			y: y * tileSize + tileSize / 2 - offset
		};

		this.game.circuit.set(x, y, element);
		this.game.sceneObjects.set(element.id, element);

		return element;
	}

	removeElement(x: number, y: number): CircuitElement | undefined {
		if (!this.game.circuit.inBounds(x, y)) return;
		const element = this.game.circuit.get(x, y);
		if (!element) return;

		this.removeHangingConnection(x, y);
		this.game.circuit.remove(x, y);
		this.game.sceneObjects.delete(element.id);

		return element;
	}

	rotateElement(e: PointerEventPayload, element: { direction: Direction }) {
		const worldStart = e.worldStart as Vector;
		const dx = e.world.x - worldStart.x;
		const dy = e.world.y - worldStart.y;

		let direction: Direction;
		if (Math.abs(dx) > Math.abs(dy)) {
			direction = dx > 0 ? Direction.Right : Direction.Left;
		} else {
			direction = dy > 0 ? Direction.Down : Direction.Up;
		}

		element.direction = direction;
	}

	// connections

	// todo: optimize
	connectElements(a: Vector, b: Vector) {
		const deltaX = b.x - a.x;
		const deltaY = b.y - a.y;

		let dirAtoB: Direction | null = null;
		let dirBtoA: Direction | null = null;

		if (deltaX === 1 && deltaY === 0) {
			dirAtoB = Direction.Right;
			dirBtoA = Direction.Left;
		} else if (deltaX === -1 && deltaY === 0) {
			dirAtoB = Direction.Left;
			dirBtoA = Direction.Right;
		} else if (deltaY === 1 && deltaX === 0) {
			dirAtoB = Direction.Down;
			dirBtoA = Direction.Up;
		} else if (deltaY === -1 && deltaX === 0) {
			dirAtoB = Direction.Up;
			dirBtoA = Direction.Down;
		}

		if (dirAtoB === null || dirBtoA === null) return;

		const elA = this.game.circuit.get(a.x, a.y);
		const elB = this.game.circuit.get(b.x, b.y);

		if (elA instanceof WireElement) {
			elA.state |= 1 << dirAtoB;
		}
		if (elB instanceof WireElement) {
			elB.state |= 1 << dirBtoA;
		}
	}

	// todo: optimize
	removeHangingConnection(x: number, y: number) {
		const directions = [
			{ dx: 0, dy: -1, dir: Direction.Up, opposite: Direction.Down },
			{ dx: 1, dy: 0, dir: Direction.Right, opposite: Direction.Left },
			{ dx: 0, dy: 1, dir: Direction.Down, opposite: Direction.Up },
			{ dx: -1, dy: 0, dir: Direction.Left, opposite: Direction.Right }
		];

		for (const { dx, dy, opposite } of directions) {
			const nx = x + dx;
			const ny = y + dy;

			if (!this.game.circuit.inBounds(nx, ny)) continue;
			const neighbor = this.game.circuit.get(nx, ny);

			if (neighbor instanceof WireElement) {
				neighbor.state &= ~(1 << opposite);
				neighbor.state &= ~0b0010_0000; // снять бит моста, если он был
			}
		}
	}

	switchBridge(target: WireElement) {
		if ((target.state & 0b1111) === 0b1111) {
			target.state ^= 0b0010_0000; // toggle bridge bit
		}
	}

	// button

	pressButton(target: ButtonElement) {
		target.state = target.state | (1 << 5); // Устанавливаем 6-й бит
	}

	releaseButton(target: ButtonElement) {
		target.state = target.state & ~(1 << 5);
	}

	// camera

	dragCamera(dx: number, dy: number) {
		const camera = this.game.camera;
		camera.position.x -= dx / camera.scale;
		camera.position.y -= dy / camera.scale;
	}

	scaleCamera(e: PointerEventPayload) {
		const DOMEvent = e.DOMEvent as WheelEvent;
		DOMEvent.preventDefault();

		const canvas = this.game.canvas;
		const camera = this.game.camera;

		const zoomFactor = 1.1;
		const minZoom = 0.25;
		const maxZoom = 4;

		const oldScale = camera.scale;
		const direction = DOMEvent.deltaY < 0 ? 1 : -1;
		const newScale = oldScale * (direction > 0 ? zoomFactor : 1 / zoomFactor);

		const clampedScale = Math.min(maxZoom, Math.max(minZoom, newScale));
		if (clampedScale === oldScale) return;

		const newCamX = e.world.x - (e.canvas.x - canvas.width / 2) / clampedScale;
		const newCamY = e.world.y - (e.canvas.y - canvas.height / 2) / clampedScale;

		camera.scale = clampedScale;
		camera.position.x = newCamX;
		camera.position.y = newCamY;
	}
}
