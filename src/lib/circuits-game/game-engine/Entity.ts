import View from './View';
import ID from './ID';
import type { Vector } from './types';

export default abstract class Entity {
	id: string = ID.generate();
	position: Vector;
	size: Vector;
	rotation: number;
	view: View = new View();

	constructor(position?: Vector, size?: Vector, rotation?: number) {
		this.position = position || { x: 0, y: 0 };
		this.size = size || { x: 100, y: 100 };
		this.rotation = rotation || 0;
	}
}
