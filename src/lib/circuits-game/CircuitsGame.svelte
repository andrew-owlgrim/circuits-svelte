<script lang="ts">
	import { onMount } from 'svelte';
	import CircuitsGame from './game/CircuitsGame';
	import GameToolbar from './UI/GameToolbar.svelte';
	import type { ElementType } from './game/gameUtils';

	// init

	let game: CircuitsGame;
	let canvas: HTMLCanvasElement;
	let activeTool: string = 'button';

	$: if (game) {
		game.activeTool = activeTool as ElementType;
	}

	// mount

	onMount(() => {
		if (canvas) {
			game = new CircuitsGame(canvas);
			game.run();

			canvas.addEventListener('contextmenu', (e) => e.preventDefault());

			return () => {
				game.clear();
			};
		}
	});
</script>

<div class="game-container">
	<canvas bind:this={canvas}></canvas>
	<GameToolbar bind:activeTool />
</div>

<style>
	.game-container {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	canvas {
		flex: 1 0 0;
		min-height: 0;

		border: none;
		border-radius: 4px;
		background: #1a1a1a;

		cursor: pointer;
		user-select: none;
	}
</style>
