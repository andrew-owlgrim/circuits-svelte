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

export type ElementType = 'button' | 'wire' | 'shmunsistor' | 'display' | 'powerSource';
// | 'switch'
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
