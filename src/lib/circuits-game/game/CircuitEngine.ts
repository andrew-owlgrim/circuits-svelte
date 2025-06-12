export default class CirctuitEngine {
	updateRate: number;

	constructor(updateRate?: number) {
		this.updateRate = updateRate ?? 100;
	}

	update() {
		this.getNextState();
		this.applyNextState();
	}

	private getNextState() {}

	private applyNextState() {}
}
