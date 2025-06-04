import type { RenderView } from '../../render/CanvasRenderer';
import ID from '../../engine/ID';

export abstract class CircuitElement {
	public readonly id: string = ID.generate();
	public position: { x: number; y: number };
	public view: RenderView;
	public type!: string;

	constructor(position: { x: number; y: number }, view: RenderView) {
		this.position = position;
		this.view = view;
	}
}
