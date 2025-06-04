export type Vector = {
	x: number;
	y: number;
};

export type View = {
	display: boolean;
	opacity: number;
	layer?: number;
	texture?: HTMLImageElement | SVGSVGElement;
	drawer?: (context: CanvasRenderingContext2D) => void;
};

export type DrawerProps = { context: CanvasRenderingContext2D; position: Vector };
export type Drawer = (props: DrawerProps) => void;

export type Body = {
	position: Vector;
	size: Vector;
};
