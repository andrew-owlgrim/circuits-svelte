export function hasFlag(value: number, mask: number): boolean {
	return (value & mask) !== 0;
}

export function setFlag(value: number, mask: number): number {
	return value | mask;
}

export function clearFlag(value: number, mask: number): number {
	return value & ~mask;
}

export function toggleFlag(value: number, mask: number): number {
	return value ^ mask;
}

export function rotateRight(value: number, shift: number, bitSize: number = 4): number {
	shift %= bitSize;
	return ((value >>> shift) | (value << (bitSize - shift))) & ((1 << bitSize) - 1);
}

export function rotateLeft(value: number, shift: number, bitSize: number = 4): number {
	shift %= bitSize;
	return ((value << shift) | (value >>> (bitSize - shift))) & ((1 << bitSize) - 1);
}
