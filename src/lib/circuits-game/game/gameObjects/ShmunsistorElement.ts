import type { Vector } from '../../core';
import { Direction } from '../gameUtils';

import { CircuitElement } from '../CircuitElement';
import gameContext from '../gameContext';

export default class ShmunsistorElement extends CircuitElement {
	direction: Direction = Direction.Up;
	invert: boolean = false;

	constructor(bodySize: number) {
		super(bodySize);
		this.type = 'shmunsistor';

		this.drawer = (context) =>
			drawShmunsistor({ context, size: this.size, direction: this.direction, invert: this.invert });
	}

	prepareUpdate(neighbors: Record<Direction, CircuitElement | null>): void {}

	applyUpdate(): void {}
}

// Drawer

type DrawShmunsistorOptions = {
	context: CanvasRenderingContext2D;
	size: Vector;
	direction: Direction;
	invert: boolean;
};

export function drawShmunsistor({ context, size, direction, invert }: DrawShmunsistorOptions) {
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

	context.lineCap = 'round';
	context.lineJoin = 'round';

	// Рисуем прямоугольник (обводка элемента)
	context.fillStyle = gameContext.colors.bg;
	context.fillRect(-halfW, -halfH, w, h);
	context.strokeStyle = gameContext.colors.border;
	context.lineWidth = 1.5;
	context.strokeRect(-halfW, -halfH, w, h);

	// Рисуем треугольник в центре, указывающий направление сигнала
	const triW = w * 0.4;
	const triH = h * 0.35;

	context.beginPath();
	context.moveTo(0, -triH / 2); // верхняя точка
	context.lineTo(triW / 2, triH / 2); // нижний правый угол
	context.lineTo(-triW / 2, triH / 2); // нижний левый угол
	context.closePath();

	context.strokeStyle = gameContext.colors.inactive;
	context.lineWidth = 3;
	context.stroke();

	if (invert) {
		context.fillStyle = gameContext.colors.inactive;
		context.fill();
	}

	context.restore();
}
