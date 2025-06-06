import { Entity, type Vector } from '../../game-engine';
import { Layers } from '../types';

export abstract class CircuitElement extends Entity {
	public type!: string;

	constructor(size: number) {
		super();
		this.size = { x: size, y: size };
		this.view.layer = Layers.Elements;
	}
}
