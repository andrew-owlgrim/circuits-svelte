import type { Vector } from './types';

export default class Camera {
	constructor(
		public position: Vector = { x: 0, y: 0 },
		public scale: number = 1
	) {}
}
