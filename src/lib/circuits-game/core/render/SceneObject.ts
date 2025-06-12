import type { Vector } from '../coreUtils';
import ID from '../ID';

export default interface SceneObject {
	id: string;
	position: Vector;
	size: Vector;
	rotation: number;
	display: boolean;
	opacity: number;
	layer: number;
	texture: HTMLImageElement | null;
	drawer: ((ctx: CanvasRenderingContext2D) => void) | null;
}

export abstract class DefaultSceneObject implements SceneObject {
	id = ID.generate();
	position = { x: 0, y: 0 };
	size = { x: 100, y: 100 };
	rotation = 0;
	display = true;
	opacity = 1;
	layer = 0;
	texture: HTMLImageElement | null = null;
	drawer: ((ctx: CanvasRenderingContext2D) => void) | null = null;
}
