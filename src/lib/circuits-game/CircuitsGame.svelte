<script lang="ts">
	import { onMount } from 'svelte';
	import CircuitsGame from './game/CircuitsGame';
	import type { Vector } from './game-engine';

	let canvasEl: HTMLCanvasElement;
	let game: CircuitsGame | null = null;

	let isDraggingCamera: boolean = false;
	let lastMouse: Vector = { x: 0, y: 0 };

	let selectedType: string | null = $state(null);

	function setSelectedType(type: string) {
		selectedType = type;
	}

	function getCellCoords(event: PointerEvent) {
		const tileSize = game!.cfg.tileSize;
		const gridSize = game!.cfg.gridSize;

		// mouse world position
		const { x: worldX, y: worldY } = getWorldCoords(event);

		// cell position
		const halfGridSizePx = (gridSize * tileSize) / 2;
		const offsetX = worldX + halfGridSizePx;
		const offsetY = worldY + halfGridSizePx;

		const cellX = Math.floor(offsetX / tileSize);
		const cellY = Math.floor(offsetY / tileSize);

		return { x: cellX, y: cellY };
	}

	function getWorldCoords(event: PointerEvent) {
		const rect = canvasEl.getBoundingClientRect();
		const pixelX = event.clientX - rect.left;
		const pixelY = event.clientY - rect.top;

		const scale = game!.camera.scale;
		const camPos = game!.camera.position;

		// canvas center
		const canvasCenter = {
			x: canvasEl.width / 2,
			y: canvasEl.height / 2
		};

		// mouse world position
		const worldX = (pixelX - canvasCenter.x) / scale + camPos.x;
		const worldY = (pixelY - canvasCenter.y) / scale + camPos.y;

		return { x: worldX, y: worldY };
	}

	function onPointerDown(event: PointerEvent) {
		const { x, y } = getCellCoords(event);

		if (event.button === 2) {
			game!.removeElement(x, y);
		} else if (event.button === 0) {
			game!.placeElement(x, y, selectedType);
		} else if (event.button === 1) {
			isDraggingCamera = true;
			lastMouse = { x: event.clientX, y: event.clientY };
			event.preventDefault();
		}
	}

	function onPointerMove(event: PointerEvent) {
		if (!isDraggingCamera) return;

		const dx = (event.clientX - lastMouse.x) / game!.camera.scale;
		const dy = (event.clientY - lastMouse.y) / game!.camera.scale;

		game!.camera.position.x -= dx;
		game!.camera.position.y -= dy;

		lastMouse = { x: event.clientX, y: event.clientY };
	}

	function onPointerUp(event: PointerEvent) {
		if (event.button === 1) {
			isDraggingCamera = false;
		}
	}

	function onMouseLeave() {
		isDraggingCamera = false;
	}

	function onWheel(event: WheelEvent) {
		event.preventDefault();

		const zoomFactor = 1.1;
		const minZoom = 0.25;
		const maxZoom = 4;

		const oldScale = game!.camera.scale;
		const direction = event.deltaY < 0 ? 1 : -1;
		const newScale = oldScale * (direction > 0 ? zoomFactor : 1 / zoomFactor);

		// Ограничим масштаб
		const clampedScale = Math.min(maxZoom, Math.max(minZoom, newScale));

		if (clampedScale === oldScale) return;

		const rect = canvasEl.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		// Центр canvas
		const canvasCenter = {
			x: canvasEl.width / 2,
			y: canvasEl.height / 2
		};

		// Положение мыши в мировых координатах до масштабирования
		const worldX = (mouseX - canvasCenter.x) / oldScale + game!.camera.position.x;
		const worldY = (mouseY - canvasCenter.y) / oldScale + game!.camera.position.y;

		// После масштабирования — новое положение мыши в мировых координатах
		const newCamX = worldX - (mouseX - canvasCenter.x) / clampedScale;
		const newCamY = worldY - (mouseY - canvasCenter.y) / clampedScale;

		// Обновляем
		game!.camera.scale = clampedScale;
		game!.camera.position.x = newCamX;
		game!.camera.position.y = newCamY;
	}

	onMount(() => {
		if (canvasEl) {
			game = new CircuitsGame(canvasEl);
			game.run();

			canvasEl.addEventListener('contextmenu', (e) => e.preventDefault());
		}
		return () => {
			game?.stop();
			game = null;
		};
	});
</script>

<div class="game-container">
	<canvas
		bind:this={canvasEl}
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onmouseleave={onMouseLeave}
		onwheel={onWheel}
	></canvas>
	<div class="toolbar">
		<button onclick={() => setSelectedType('button')}>Button</button>
		<button onclick={() => setSelectedType('wire')}>Wire</button>
		<button onclick={() => setSelectedType('shmunsistor')}>Shmunsistor</button>
		<button onclick={() => setSelectedType('display')}>Display</button>
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
