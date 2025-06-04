import type { CircuitElement } from './elements/CircuitElement';

export default class World {
	private width: number;
	private height: number;
	private grid: (CircuitElement | null)[][];

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
		this.grid = Array.from({ length: height }, () => Array.from({ length: width }, () => null));
	}

	getElement(x: number, y: number): CircuitElement | null {
		if (!this.inBounds(x, y)) return null;
		return this.grid[y][x];
	}

	setElement(x: number, y: number, element: CircuitElement): boolean {
		if (!this.inBounds(x, y)) return false;
		this.grid[y][x] = element;
		element.position = { x, y };
		return true;
	}

	removeElement(x: number, y: number): boolean {
		if (!this.inBounds(x, y)) return false;
		this.grid[y][x] = null;
		return true;
	}

	clear(): void {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				this.grid[y][x] = null;
			}
		}
	}

	forEach(callback: (element: CircuitElement, x: number, y: number) => void): void {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const el = this.grid[y][x];
				if (el) callback(el, x, y);
			}
		}
	}

	inBounds(x: number, y: number): boolean {
		return x >= 0 && y >= 0 && x < this.width && y < this.height;
	}

	getAllElements(): CircuitElement[] {
		const result: CircuitElement[] = [];
		this.forEach((el) => result.push(el));
		return result;
	}
}
