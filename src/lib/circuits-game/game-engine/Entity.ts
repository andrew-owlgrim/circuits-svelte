import type { Body, View } from './types';
import ID from './ID';

export default abstract class Entity {
	id: string = ID.generate();
	body!: Body;
	view!: View;
}
