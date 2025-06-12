const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-.';

function toAlphabetString(num: number): string {
	if (num === 0) return ALPHABET[0];

	let result = '';
	const base = ALPHABET.length;

	while (num > 0) {
		result = ALPHABET[num % base] + result;
		num = Math.floor(num / base);
	}

	return result;
}

export default class ID {
	private static counter = 0;
	private static baseTimeStamp = 0;

	private constructor() {
		throw new Error('Events is a static utility class and cannot be instantiated.');
	}

	static generate(): string {
		const currentTimeStamp = Math.floor(Date.now() / 1000);
		if (ID.baseTimeStamp !== currentTimeStamp) {
			ID.baseTimeStamp = currentTimeStamp;
			ID.counter = 0;
		}
		return `${toAlphabetString(ID.baseTimeStamp)}-${toAlphabetString(ID.counter++)}`;
	}
}
