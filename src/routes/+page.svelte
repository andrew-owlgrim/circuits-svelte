<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<h1>Circuits Game</h1>
<button on:click={() => goto('/level')}>Start</button>
<button on:click={() => goto('/settings')}>Settings</button>
