import type Camera from './Camera';
import type Entity from './Entity';
import type { Vector } from './types';
import View from './View';

import { rectangleDrawer, textureDrawer } from './drawers';

export default class Renderer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private entities: Map<string, Entity>;
	private camera: Camera;

	private isRunning: boolean = false;
	private animationFrameId: number | null = null;
	private resizeObserver: ResizeObserver | null = null;

	constructor(canvas: HTMLCanvasElement, entities: Map<string, Entity>, camera: Camera) {
		this.canvas = canvas;
		const context = canvas.getContext('2d');
		if (!context) throw new Error('CanvasRenderingContext2D not supported');
		this.ctx = context;

		this.entities = entities;
		this.camera = camera;

		this.init();
	}

	// lifecyle

	private init() {
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
			const getLayer = (view?: View) => view?.layer ?? 0;
			return getLayer(a.view) - getLayer(b.view);
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
			const { view, position, size, rotation } = entity;
			if (!view) continue;

			this.ctx.save();
			this.ctx.translate(position.x, position.y);
			this.ctx.rotate(rotation ?? 0);

			if (view.drawer) {
				view.drawer(this.ctx);
			} else if (view.texture) {
				textureDrawer(this.ctx, size, view.texture);
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
