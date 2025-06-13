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
