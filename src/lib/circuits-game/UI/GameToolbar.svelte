<script lang="ts">
	let { activeTool = $bindable('button') } = $props();

	const tools = ['button', 'wire', 'shmunsistor', 'display'];
</script>

<div class="toolbar">
	{#each tools as tool}
		<button class:active={tool === activeTool} onclick={() => (activeTool = tool)}>
			{tool}
		</button>
	{/each}
</div>

<style>
	.toolbar {
		display: flex;
		gap: 8px;
	}
	button.active {
		background: #555;
		color: white;
	}
</style>
