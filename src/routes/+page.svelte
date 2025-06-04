<script>
	import CircuitsGame from '$lib/circuits-game/CircuitsGame.svelte';
</script>

<h1>Circuits game</h1>
<CircuitsGame id="game-container" />

<style>
	:global(body) {
		display: flex;
		flex-direction: column;
		gap: 40px;
		padding: 40px;
		overflow: hidden;
	}

	:global(.game-container) {
		flex: 1 0 0;
	}
</style>
