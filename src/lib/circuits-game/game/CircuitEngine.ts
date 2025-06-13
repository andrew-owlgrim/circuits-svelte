import type Circuit from './Circuit';
import type { CircuitElement } from './CircuitElement';

export class CircuitEngine {
	private circuit: Circuit;
	private intervalId: number | null = null;
	private tickInterval = 100;

	constructor(circuit: Circuit) {
		this.circuit = circuit;
	}

	run(tickRateMs: number = 100) {
		this.tickInterval = tickRateMs;
		if (this.intervalId === null) {
			this.intervalId = setInterval(() => this.update(), this.tickInterval);
		}
	}

	stop() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	update() {
		this.circuit.forEach((element, x, y) => {
			const neighborStates = [
				this.circuit.get(x, y - 1)?.state ?? 0, // вверх
				this.circuit.get(x + 1, y)?.state ?? 0, // вправо
				this.circuit.get(x, y + 1)?.state ?? 0, // вниз
				this.circuit.get(x - 1, y)?.state ?? 0 // влево
			];

			element.prepareUpdate(neighborStates);
		});

		this.circuit.forEach((element) => {
			element.applyUpdate();
		});
	}
}
