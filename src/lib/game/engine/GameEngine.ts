export interface Entity {
	update?(): void;
}

export interface RenderableEntity extends Entity {
	view?: any;
	position: { x: number; y: number };
}

export abstract class GameEngine {
	protected renderer: {
		render: () => void;
		addEntity: (id: string, entity: RenderableEntity) => void;
		removeEntity: (id: string) => void;
		clearEntities: () => void;
	};

	protected entities: Map<string, RenderableEntity> = new Map();
	protected isRunning: boolean = false;
	protected tickRate: number = 100; // миллисекунды
	protected intervalId: number | null = null;

	constructor(renderer: any, tickRate: number = 100) {
		this.renderer = renderer;
		this.tickRate = tickRate;
	}

	abstract init(): void;

	protected loop() {
		this.updateEntities();
		this.renderer.render();
	}

	protected updateEntities() {
		for (const entity of this.entities.values()) {
			if (typeof entity.update === 'function') {
				entity.update();
			}
		}
	}

	run() {
		if (this.isRunning) return;
		this.isRunning = true;
		this.intervalId = setInterval(() => this.loop(), this.tickRate);
	}

	stop() {
		if (!this.isRunning) return;
		this.isRunning = false;
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	clear() {
		this.entities.clear();
		this.renderer.clearEntities();
	}

	addEntity(id: string, entity: RenderableEntity) {
		this.entities.set(id, entity);
		if (entity.view) {
			this.renderer.addEntity(id, entity);
		}
	}

	removeEntity(id: string) {
		this.entities.delete(id);
		this.renderer.removeEntity(id);
	}

	getEntity(id: string): RenderableEntity | undefined {
		return this.entities.get(id);
	}
}
