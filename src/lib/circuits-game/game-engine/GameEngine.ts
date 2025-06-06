import type Entity from './Entity';
import Camera from './Camera';
import Renderer from './Renderer';

export default abstract class GameEngine {
	protected entities: Map<string, Entity> = new Map();
	protected gamerules: Map<string, unknown> = new Map();
	public camera: Camera;

	protected isRunning: boolean = false;
	protected intervalId: number | null = null;
	protected updateRate: number = 1000 / 60;

	// public physics?: PhysicsEngine;
	public render: Renderer;

	constructor(canvas: HTMLCanvasElement) {
		// this.physics = physics;
		this.camera = new Camera();
		this.render = new Renderer(canvas, this.entities, this.camera);
	}

	init() {
		this.render.run();
		this.render.render();
	}

	clear() {
		this.render.stop();
		this.entities.clear();
	}

	protected loop() {}

	run() {
		if (this.isRunning) return;
		this.isRunning = true;
		this.intervalId = setInterval(() => this.loop(), this.updateRate);
	}

	stop() {
		if (!this.isRunning) return;
		this.isRunning = false;
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	// Entities

	addEntity(entity: Entity) {
		this.entities.set(entity.id, entity);
	}

	removeEntity(id: string) {
		this.entities.delete(id);
	}

	getEntity(id: string): Entity | undefined {
		return this.entities.get(id);
	}
}
