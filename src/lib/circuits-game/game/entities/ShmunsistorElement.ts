import type { Vector } from '../../game-engine';
import { Direction } from '../types';

import { CircuitElement } from './CircuitElement';

import texture from '../../assets/textures/shmunsistor.svg';

export default class ShmunsistorElement extends CircuitElement {
	direction: Direction = Direction.Up;

	constructor(bodySize: number) {
		super(bodySize);
		this.type = 'shmunsistor';

		const image = new Image();
		image.src = texture;
		this.view.drawer = (context) =>
			drawShmunsistor({ context, size: this.size, direction: this.direction });
	}
}

// Drawer

type DrawShmunsistorOptions = {
	context: CanvasRenderingContext2D;
	size: Vector;
	direction: Direction;
};

export function drawShmunsistor({ context, size, direction }: DrawShmunsistorOptions) {
	const w = size.x;
	const h = size.y;
	const halfW = w / 2;
	const halfH = h / 2;

	context.save();

	// Поворачиваем canvas в зависимости от направления
	const angleMap: Record<Direction, number> = {
		[Direction.Up]: 0,
		[Direction.Right]: 90,
		[Direction.Down]: 180,
		[Direction.Left]: -90
	};

	const angle = (angleMap[direction] * Math.PI) / 180;
	context.rotate(angle);

	// Рисуем прямоугольник (обводка элемента)
	context.strokeStyle = '#666';
	context.lineWidth = 2;
	context.strokeRect(-halfW, -halfH, w, h);

	// Рисуем треугольник в центре, указывающий направление сигнала
	const triW = w * 0.5;
	const triH = h * 0.5;

	context.beginPath();
	context.moveTo(0, -triH / 2); // верхняя точка
	context.lineTo(triW / 2, triH / 2); // нижний правый угол
	context.lineTo(-triW / 2, triH / 2); // нижний левый угол
	context.closePath();

	context.fillStyle = '#ffffff';
	context.fill();

	context.restore();
}
