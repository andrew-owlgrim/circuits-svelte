<script lang="ts">
	import { onMount } from 'svelte';
	import { CircuitsGame } from '$lib/game/circuitsgame/CircuitsGame';
	import {
		ButtonElement,
		WireElement,
		DisplayElement
	} from '$lib/game/circuitsgame/elements/CircuitElements';
	import { textures } from '$lib/assets/textures';
	import type { CircuitElementType } from '$lib/game/circuitsgame/elements/CircuitElements';

	let canvasEl: HTMLCanvasElement;
	let game: CircuitsGame;
	let selectedType: CircuitElementType = 'button';

	const TILE_SIZE = 32;
	const GRID_SIZE = 256;
	const CANVAS_SIZE = 800; // отрисуем центральную часть поля

	function getCoordsFromEvent(event: PointerEvent): { x: number; y: number } | null {
		const rect = canvasEl.getBoundingClientRect();
		const x = Math.floor((event.clientX - rect.left) / TILE_SIZE);
		const y = Math.floor((event.clientY - rect.top) / TILE_SIZE);
		if (x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE) return null;
		return { x, y };
	}

	function createElement(type: CircuitElementType, x: number, y: number) {
		const position = { x, y };
		const view = {
			texture: textures[type],
			drawer(ctx: CanvasRenderingContext2D, pos: typeof position, texture?: HTMLImageElement) {
				if (texture)
					ctx.drawImage(texture, pos.x * TILE_SIZE, pos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
			},
			layer: 1
		};

		switch (type) {
			case 'button':
				return new ButtonElement(position, view);
			case 'wire':
				return new WireElement(position, view);
			case 'display':
				return new DisplayElement(position, view);
		}
	}

	function handlePointer(event: PointerEvent) {
		const coords = getCoordsFromEvent(event);
		if (!coords) return;

		const existing = game.world.getElement(coords.x, coords.y);

		if (event.button === 2) {
			// правая кнопка — удалить
			if (existing) {
				game.world.removeElement(coords.x, coords.y);
				game.removeEntity(existing.id);
			}
		} else {
			// левая кнопка — поставить
			if (!existing) {
				const el = createElement(selectedType, coords.x, coords.y);
				game.world.setElement(coords.x, coords.y, el);
				game.addEntity(el.id, el);
			}
		}
	}

	onMount(() => {
		game = new CircuitsGame(canvasEl);
		game.init();
		game.renderer.run();
		game.run();

		canvasEl.addEventListener('contextmenu', (e) => e.preventDefault());
	});
</script>

<div class="toolbar">
	<button on:click={() => (selectedType = 'button')}>Кнопка</button>
	<button on:click={() => (selectedType = 'wire')}>Провод</button>
	<button on:click={() => (selectedType = 'display')}>Дисплей</button>
</div>

<canvas bind:this={canvasEl} width={CANVAS_SIZE} height={CANVAS_SIZE} on:pointerdown={handlePointer}
></canvas>

<style>
	canvas {
		image-rendering: pixelated;
		border: 1px solid #888;
		background: #111;
		cursor: pointer;
	}
	.toolbar {
		display: flex;
		gap: 8px;
		margin-bottom: 12px;
	}
</style>
