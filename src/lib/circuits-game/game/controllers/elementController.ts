import type CirctuitsGame from '../CircuitsGame';
import ButtonElement from '../entities/ButtonElement';
import type { CircuitElement } from '../entities/CircuitElement';
import DisplayElement from '../entities/DisplayElement';
import ShmunsistorElement from '../entities/ShmunsistorElement';
import WireElement from '../entities/WireElement';

export default class ElementController {
	constructor(private game: CirctuitsGame) {}

	placeElement(x: number, y: number, element: string | null): CircuitElement | undefined {
		if (!this.game.grid.inBounds(x, y)) return;
		if (this.game.grid.get(x, y)) return;

		const tileSize = this.game.cfg.tileSize;
		const gridSize = this.game.cfg.gridSize;

		const offset = (gridSize * tileSize) / 2;

		let elementType = null;
		switch (element) {
			case 'shmunsistor':
				elementType = ShmunsistorElement;
				break;
			case 'button':
				elementType = ButtonElement;
				break;
			case 'display':
				elementType = DisplayElement;
				break;
			default:
				elementType = WireElement;
				break;
		}

		const entity = new elementType(tileSize);
		entity.position = {
			x: x * tileSize + tileSize / 2 - offset,
			y: y * tileSize + tileSize / 2 - offset
		};

		if (this.game.grid.set(x, y, entity)) {
			this.game.addEntity(entity);
		}

		return entity;
	}

	removeElement(x: number, y: number) {
		if (!this.game.grid.inBounds(x, y)) return;
		const entity = this.game.grid.get(x, y);
		if (!entity) return;

		if (this.game.grid.remove(x, y)) {
			this.game.removeEntity(entity.id);
		}
	}
}
