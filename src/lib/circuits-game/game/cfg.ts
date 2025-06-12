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
		metal: '#A3A3A3',
		border: '#3D3D3D',
		bg: '#262626'
	}
};

export { defaultCfg };
