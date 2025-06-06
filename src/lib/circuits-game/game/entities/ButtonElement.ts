import { CircuitElement } from './CircuitElement';

import texture from '../../assets/textures/button.svg';

export default class ButtonElement extends CircuitElement {
	constructor(bodySize: number) {
		super(bodySize);
		this.type = 'button';

		const image = new Image();
		image.src = texture;
		this.view.texture = image;
	}
}
