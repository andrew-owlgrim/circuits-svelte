type Vec2 = { x: number; y: number };

export interface HasRenderView {
	view: RenderView;
	position: Vec2;
}

export interface RenderView {
	texture?: HTMLImageElement | SVGSVGElement;
	drawer?: (ctx: CanvasRenderingContext2D, position: Vec2) => void;
	layer?: number;
}

export class CanvasRenderer {
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private entities: Map<string, HasRenderView> = new Map();
	private isRunning: boolean = false;
	private animationFrameId: number | null = null;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		const context = canvas.getContext('2d');
		if (!context) throw new Error('CanvasRenderingContext2D not supported');
		this.ctx = context;
	}

	addEntity(id: string, entity: HasRenderView) {
		if (!entity.view) return;
		this.entities.set(id, entity);
	}

	removeEntity(id: string) {
		this.entities.delete(id);
	}

	clearEntities() {
		this.entities.clear();
	}

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

	render() {
		this.clearCanvas();

		const sortedEntities = [...this.entities.values()].sort((a, b) => {
			const getLayer = (view?: RenderView) => view?.layer ?? 0;
			return getLayer(a.view) - getLayer(b.view);
		});

		for (const entity of sortedEntities) {
			const { view, position } = entity;
			if (!view) continue;

			if (view.drawer) {
				view.drawer(this.ctx, position);
			} else if (view.texture instanceof HTMLImageElement) {
				this.ctx.drawImage(view.texture, position.x, position.y);
			} else if (view.texture instanceof SVGSVGElement) {
				const svgData = new XMLSerializer().serializeToString(view.texture);
				const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
				const url = URL.createObjectURL(svgBlob);
				const img = new Image();
				img.onload = () => {
					this.ctx.drawImage(img, position.x, position.y);
					URL.revokeObjectURL(url);
				};
				img.src = url;
			}
		}
	}

	private clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
