import { CircuitElement } from './CircuitElement';

import texture from '../../assets/textures/display.svg';

export default class DisplayElement extends CircuitElement {
	constructor(bodySize: number) {
		super(bodySize);
		this.type = 'display';

		const image = new Image();
		image.src = texture;
		this.view.texture = image;
	}
}
