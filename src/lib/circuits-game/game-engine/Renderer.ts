import type Camera from './Camera';
import type Entity from './Entity';
import type { View, Vector } from './types';

export default class Renderer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;

	private entities: Map<string, Entity>;
	private camera: Camera;

	private isRunning: boolean = false;
	private animationFrameId: number | null = null;

	constructor(canvas: HTMLCanvasElement, entities: Map<string, Entity>, camera: Camera) {
		this.canvas = canvas;
		const context = canvas.getContext('2d');
		if (!context) throw new Error('CanvasRenderingContext2D not supported');
		this.ctx = context;

		this.entities = entities;
		this.camera = camera;
	}

	// lifecyle

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
		console.log('render');

		this.clearCanvas();

		const sortedEntities = [...this.entities.values()].sort((a, b) => {
			const getLayer = (view?: View) => view?.layer ?? 0;
			return getLayer(a.view) - getLayer(b.view);
		});

		const cam = this.camera;
		this.ctx.save();
		this.ctx.setTransform(
			cam.scale,
			0, // scale x, skew x
			0,
			cam.scale, // skew y, scale y
			-cam.position.x * cam.scale, // translate x
			-cam.position.y * cam.scale // translate y
		);

		for (const entity of sortedEntities) {
			const view = entity.view as View | undefined;
			const position = (entity as { position?: Vector }).position ?? { x: 0, y: 0 };
			if (!view) continue;

			const drawX = position.x;
			const drawY = position.y;

			if (view.drawer) {
				view.drawer(this.ctx);
			} else if (view.texture instanceof HTMLImageElement) {
				this.ctx.drawImage(view.texture, drawX, drawY, view.texture.width, view.texture.height);
			} else if (view.texture instanceof SVGSVGElement) {
				const svgData = new XMLSerializer().serializeToString(view.texture);
				const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
				const url = URL.createObjectURL(svgBlob);
				const img = new Image();
				img.onload = () => {
					this.ctx.drawImage(img, drawX, drawY, img.width, img.height);
					URL.revokeObjectURL(url);
				};
				img.src = url;
			}
		}

		this.ctx.restore();
	}

	private clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
