import Camera from './Camera';
import type SceneObject from './SceneObject';
import type { Vector } from '../coreUtils';

import { rectangleDrawer, textureDrawer } from './drawers';

export default class Renderer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private entities: Map<string, SceneObject>;
	private camera: Camera;

	private isRunning: boolean = false;
	private animationFrameId: number | null = null;
	private resizeObserver: ResizeObserver | null = null;

	constructor(canvas: HTMLCanvasElement, entities?: Map<string, SceneObject>, camera?: Camera) {
		this.canvas = canvas;
		const context = canvas.getContext('2d');
		if (!context) throw new Error('CanvasRenderingContext2D not supported');
		this.ctx = context;

		this.entities = entities ?? new Map();
		this.camera = camera ?? new Camera();

		this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
		this.resizeObserver.observe(this.canvas);
		this.resizeCanvas();
	}

	clear() {
		this.stop();
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
	}

	// resize

	resizeCanvas() {
		const { canvas } = this;
		const { width, height } = canvas.getBoundingClientRect();

		canvas.width = Math.floor(width);
		canvas.height = Math.floor(height);
	}

	// loop

	run() {
		if (this.isRunning) return;
		this.isRunning = true;
		this.renderLoop();
	}

	stop() {
		if (!this.isRunning) return;
		this.isRunning = false;
		if (this.animationFrameId !== null) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
		}
	}

	private renderLoop = () => {
		if (!this.isRunning) return;
		this.render();
		this.animationFrameId = requestAnimationFrame(this.renderLoop);
	};

	// render

	render() {
		this.clearCanvas();

		// prepare entities arr

		const sortedEntities = [...this.entities.values()].sort((a, b) => {
			return a.layer - b.layer;
		});

		// apply camera

		const cam = this.camera;

		this.ctx.save();
		this.ctx.setTransform(
			cam.scale,
			0, // scale x, skew x
			0,
			cam.scale, // skew y, scale y
			this.canvas.width / 2 - cam.position.x * cam.scale, // translate x
			this.canvas.height / 2 - cam.position.y * cam.scale // translate y
		);
		this.ctx.rotate(cam.rotation);

		// draw entities

		for (const entity of sortedEntities) {
			const { drawer, texture, position, size, rotation } = entity;

			this.ctx.save();
			this.ctx.translate(position.x, position.y);
			this.ctx.rotate(rotation ?? 0);

			if (drawer) {
				drawer(this.ctx);
			} else if (texture) {
				textureDrawer(this.ctx, size, texture);
			} else {
				rectangleDrawer(this.ctx, size);
			}

			this.ctx.restore();
		}

		this.ctx.restore();
	}

	private clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
