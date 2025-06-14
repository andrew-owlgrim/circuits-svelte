import type { Vector } from '../core';

export enum Direction {
	Up,
	Right,
	Down,
	Left
}

export enum Layers {
	Bg,
	Grid,
	Wires,
	Elements
}

export type ElementType = 'button' | 'wire' | 'shmunsistor' | 'display' | 'powerSource' | 'switch';
// | 'speaker';

export function getDirectionFromDelta(dx: number, dy: number): Direction | null {
	if (dx === 1 && dy === 0) return Direction.Right;
	if (dx === -1 && dy === 0) return Direction.Left;
	if (dx === 0 && dy === 1) return Direction.Down;
	if (dx === 0 && dy === -1) return Direction.Up;
	return null;
}

export function getOppositeDirection(dir: Direction): Direction {
	return (dir + 2) % 4;
}

const angleMap: Record<Direction, number> = {
	[Direction.Up]: 0,
	[Direction.Right]: 90,
	[Direction.Down]: 180,
	[Direction.Left]: -90
};

export function getAngle(dir: Direction): number {
	return (angleMap[dir] * Math.PI) / 180;
}

const deltaMap: Record<Direction, Vector> = {
	[Direction.Up]: { x: 0, y: -1 },
	[Direction.Right]: { x: 1, y: 0 },
	[Direction.Down]: { x: 0, y: 1 },
	[Direction.Left]: { x: -1, y: 0 }
};

export function getDelta(dir: Direction): Vector {
	return deltaMap[dir];
}

export const enum StateFlags {
	Up = 0b0000_0001,
	Right = 0b0000_0010,
	Down = 0b0000_0100,
	Left = 0b0000_1000,
	Output = 0b0001_0000
}

export function enumToBit(enumValue: number): number {
	return 1 << enumValue;
}

export function bitToEnum(bit: number): number {
	return Math.log2(bit); // если bit — это ровно одна единичка
}
