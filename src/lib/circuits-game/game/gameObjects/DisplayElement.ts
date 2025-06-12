import { CircuitElement } from '../CircuitElement';

import texture from '../../assets/textures/display.svg';
import type { Direction } from '../gameUtils';

export default class DisplayElement extends CircuitElement {
	constructor(bodySize: number) {
		super(bodySize);
		this.type = 'display';

		const image = new Image();
		image.src = texture;
		this.texture = image;
	}

	prepareUpdate(neighbors: Record<Direction, CircuitElement | null>): void {}

	applyUpdate(): void {}
}
