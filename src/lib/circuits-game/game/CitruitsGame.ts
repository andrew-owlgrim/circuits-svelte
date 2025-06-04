import { Entity, GameEngine } from '../game-engine';
import { RectangleDrawer } from '../game-engine/RectangleDrawer';

class TestEntity extends Entity {
	constructor() {
		super();

		this.body = {
			position: { x: 0, y: 0 },
			size: { x: 100, y: 100 }
		};

		this.view = {
			display: true,
			opacity: 1,
			layer: 0,
			drawer: (context) => {
				RectangleDrawer({
					context,
					position: this.body.position,
					size: this.body.size,
					color: '#ffffff'
				});
			}
		};
	}
}

export default class CirctuitsGame extends GameEngine {
	constructor(canvas: HTMLCanvasElement) {
		super(canvas);
	}

	init() {
		super.init();
		super.addEntity(new TestEntity());
	}
}
