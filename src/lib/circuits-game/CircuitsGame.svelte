<script lang="ts">
	import { onMount } from 'svelte';
	import CircuitsGame from './game/CitruitsGame';

	let canvasEl: HTMLCanvasElement;
	let game: CircuitsGame | null = null;

	onMount(() => {
		if (canvasEl) {
			game = new CircuitsGame(canvasEl);
			game.run();
		}
		return () => {
			game?.stop();
			game = null;
		};
	});
</script>

<div class="game-container">
	<canvas bind:this={canvasEl}></canvas>
	<div class="toolbar">
		<button>Button</button>
		<button>Wire</button>
		<button>Display</button>
		<button>Remove</button>
	</div>
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

		border: 1px solid #888;
		background: #111;
		cursor: pointer;
	}
	.toolbar {
		display: flex;
		gap: 8px;
	}
</style>
