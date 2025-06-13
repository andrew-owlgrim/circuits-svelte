export type Cfg = {
	tileSize: number;
	gridSize: number;
	updateRate: number;
	colors: { [key: string]: string };
};

const defaultCfg: Cfg = {
	tileSize: 32,
	gridSize: 64,
	updateRate: 100,
	colors: {
		inactive: '#7F2626',
		inactiveDark: '#4D1313',
		active: '#6699FF',
		activeDark: '#457AE5',
		gray: '#B3B3B3',
		grayDark: '#808080',
		brightBlue: '#99BBFF',
		brightBlueDark: '#6688CC',
		bleakBlue: '#3E485C',
		bleakBlueDark: '#2E3747',
		border: '#3D3D3D',
		bg: '#262626'
	}
};

export { defaultCfg };
