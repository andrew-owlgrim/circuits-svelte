import { CircuitElement } from './CircuitElement';

import texture from '../../assets/textures/wire.svg';

export default class WireElement extends CircuitElement {
	constructor(size: number) {
		super(size);
		this.type = 'wire';

		const image = new Image();
		image.src = texture;
		this.view.texture = image;
	}
}
