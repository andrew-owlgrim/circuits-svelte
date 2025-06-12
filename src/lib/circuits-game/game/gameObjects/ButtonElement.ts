import { CircuitElement } from '../CircuitElement';

import texture from '../../assets/textures/button.svg';

export default class ButtonElement extends CircuitElement {
	isPressed: boolean = false;
	activated: boolean = false;
	private nextActivated = false;

	constructor(size: number) {
		super(size);
		this.type = 'button';

		const image = new Image();
		image.src = texture;
		this.texture = image;
	}

	prepareUpdate() {
		this.nextActivated = this.isPressed;
	}

	applyUpdate() {
		this.activated = this.nextActivated;
	}
}
