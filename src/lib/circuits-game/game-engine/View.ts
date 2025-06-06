export default class View {
	display: boolean = true;
	opacity: number = 1;
	layer: number = 0;
	texture: HTMLImageElement | null = null;
	drawer: ((ctx: CanvasRenderingContext2D) => void) | null = null;
}
