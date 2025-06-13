import { ID, type Vector, type SceneObject } from '../core';
import { Direction, Layers } from './gameUtils';

export abstract class CircuitElement implements SceneObject {
	id = ID.generate();
	position = { x: 0, y: 0 };
	size: Vector;
	rotation = 0;
	display = true;
	opacity = 1;
	layer = Layers.Elements;
	texture: HTMLImageElement | null = null;
	drawer: ((ctx: CanvasRenderingContext2D) => void) | null = null;
	public type!: string;
	state: number = 0;
	nextState: number = 0;

	constructor(size: number) {
		this.size = { x: size, y: size };
	}

	abstract prepareUpdate(neighborStates: number[]): void;
	abstract applyUpdate(): void;
}
