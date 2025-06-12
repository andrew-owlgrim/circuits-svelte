import type Camera from '../core/render/Camera';
import type CircuitsGame from '../game/CircuitsGame';
import type { CircuitElement } from '../game/CircuitElement';

export type Vector = {
	x: number;
	y: number;
};

// POSITION

export function getCanvasPosition(canvas: HTMLCanvasElement, screen: Vector): Vector {
	const rect = canvas.getBoundingClientRect();
	return { x: screen.x - rect.left, y: screen.y - rect.top };
}

export function getWorldPosition(game: CircuitsGame, screen: Vector): Vector {
	const { x: canvasX, y: canvasY } = getCanvasPosition(game.canvas, screen);

	const scale = game.camera.scale;
	const camPos = game.camera.position;

	const canvasCenter = {
		x: game.canvas.width / 2,
		y: game.canvas.height / 2
	};

	const worldX = (canvasX - canvasCenter.x) / scale + camPos.x;
	const worldY = (canvasY - canvasCenter.y) / scale + camPos.y;

	return { x: worldX, y: worldY };
}

export function getGridPosition(game: CircuitsGame, screen: Vector): Vector {
	const tileSize = game.cfg.tileSize;
	const gridSize = game.cfg.gridSize;

	const { x: worldX, y: worldY } = getWorldPosition(game, screen);

	const halfGridSizePx = (gridSize * tileSize) / 2;
	const offsetX = worldX + halfGridSizePx;
	const offsetY = worldY + halfGridSizePx;

	const cellX = Math.floor(offsetX / tileSize);
	const cellY = Math.floor(offsetY / tileSize);

	return { x: cellX, y: cellY };
}

// INTERACTION

export type InteractionContext = {
	event: PointerEvent;
	eventType: string;
	tool: string;
	clientPosition: Vector;
	clientStart?: Vector;
	gridPosition: Vector;
	gridStart?: Vector;
	target: CircuitElement | null;
	targetStart?: CircuitElement | null;
	isPointerDown?: boolean;
	moved?: boolean;
};

export type InteractionAction = {
	condition: (context: InteractionContext) => boolean;
	action: (context: InteractionContext) => void;
};

export type InteractionActions = { [key: string]: InteractionAction };

export function dispatchInteraction(actions: InteractionActions, ctx: InteractionContext) {
	for (const key in actions) {
		const { condition, action } = actions[key];
		if (condition(ctx)) action(ctx);
	}
}

// CIRCUITS

export type ToolType = 'curor' | 'remove' | ElementType;

export enum ElementType {
	PowerSource = 'powerSource',
	Wire = 'wire',
	Shmunsistor = 'shmunsistor',
	Button = 'button',
	Switch = 'switch',
	Display = 'display',
	Speaker = 'speaker'
}

export function isElementType(value: string): value is ElementType {
	return Object.values(ElementType).includes(value as ElementType);
}
