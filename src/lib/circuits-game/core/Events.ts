type EventCallback<T = any> = (payload: T) => void;

type EventsMap = Map<string, Set<EventCallback>>;

export default class Events {
	private static listeners = new WeakMap<object, EventsMap>();

	private constructor() {
		throw new Error('Events is a static utility class and cannot be instantiated.');
	}

	static on<T = any>(target: object, eventName: string, callback: EventCallback<T>) {
		let targetEvents = this.listeners.get(target);
		if (!targetEvents) {
			targetEvents = new Map();
			this.listeners.set(target, targetEvents);
		}
		let callbacks = targetEvents.get(eventName);
		if (!callbacks) {
			callbacks = new Set();
			targetEvents.set(eventName, callbacks);
		}
		callbacks.add(callback);
	}

	static off<T = any>(target: object, eventName?: string, callback?: EventCallback<T>) {
		const targetEvents = this.listeners.get(target);
		if (!targetEvents) return;

		if (!eventName) {
			this.listeners.delete(target);
			return;
		}

		const callbacks = targetEvents.get(eventName);
		if (!callbacks) return;

		if (!callback) {
			targetEvents.delete(eventName);
		} else {
			callbacks.delete(callback);
			if (callbacks.size === 0) {
				targetEvents.delete(eventName);
			}
		}

		if (targetEvents.size === 0) {
			this.listeners.delete(target);
		}
	}

	static trigger<T = any>(target: object, eventName: string, payload?: T) {
		const targetEvents = this.listeners.get(target);
		if (!targetEvents) return;

		const callbacks = targetEvents.get(eventName);
		if (!callbacks) return;

		for (const callback of callbacks) {
			callback(payload!);
		}
	}

	static clear(target: object) {
		this.listeners.delete(target);
	}
}
