<script lang="ts">
	import { onMount } from 'svelte';
	import CircuitsGame from './game/CircuitsGame';
	import type { Vector } from './game-engine';
	import { Direction } from './game/types';
	import ShmunsistorElement from './game/entities/ShmunsistorElement';

	let canvasEl: HTMLCanvasElement;
	let game: CircuitsGame | null = null;

	// dragging camera
	let isDraggingCamera: boolean = false;
	let lastMouse: Vector = { x: 0, y: 0 };

	// select tool
	let selectedType: string = $state('button');

	function setSelectedType(type: string) {
		selectedType = type;
	}

	// rotating shmunsitors
	let isRotatingShmunsistor = false;
	let rotationStartWorld: { x: number; y: number } | null = null;
	let rotateCell: { x: number; y: number } | null = null;

	//drawing wire
	let isDrawingWire = false;
	let lastWireCell: { x: number; y: number } | null = null;

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
		const world = getWorldCoords(event); // координаты в мировом пространстве

		if (event.button === 2) {
			game!.removeElement(x, y);
		} else if (event.button === 0) {
			const element = game!.getElement(x, y) as any;
			const isSelectedShmunsistor = selectedType === 'shmunsistor';
			const isSelectedWire = selectedType === 'wire';

			if (element instanceof ShmunsistorElement) {
				// Вращаем существующего
				isRotatingShmunsistor = true;
				rotationStartWorld = world;
				rotateCell = { x, y };
			} else if (isSelectedShmunsistor) {
				// Ставим и начинаем вращение нового
				game!.placeElement(x, y, selectedType);
				isRotatingShmunsistor = true;
				rotationStartWorld = world;
				rotateCell = { x, y };
			} else if (isSelectedWire) {
				isDrawingWire = true;
				lastWireCell = { x, y };
			} else {
				game!.placeElement(x, y, selectedType);
			}
		} else if (event.button === 1) {
			isDraggingCamera = true;
			lastMouse = { x: event.clientX, y: event.clientY };
			event.preventDefault();
		}
	}

	function onPointerMove(event: PointerEvent) {
		if (isDraggingCamera) {
			const dx = (event.clientX - lastMouse.x) / game!.camera.scale;
			const dy = (event.clientY - lastMouse.y) / game!.camera.scale;

			game!.camera.position.x -= dx;
			game!.camera.position.y -= dy;

			lastMouse = { x: event.clientX, y: event.clientY };
		}

		if (isRotatingShmunsistor && rotationStartWorld && rotateCell) {
			const end = getWorldCoords(event);
			const dx = end.x - rotationStartWorld.x;
			const dy = end.y - rotationStartWorld.y;

			let direction: Direction;
			if (Math.abs(dx) > Math.abs(dy)) {
				direction = dx > 0 ? Direction.Right : Direction.Left;
			} else {
				direction = dy > 0 ? Direction.Down : Direction.Up;
			}

			const shmunsistor = game!.getElement(rotateCell.x, rotateCell.y);
			if (shmunsistor instanceof ShmunsistorElement && shmunsistor.direction !== direction) {
				shmunsistor.direction = direction;
			}
		}

		if (isDrawingWire && lastWireCell) {
			const current = getCellCoords(event);
			if (current.x === lastWireCell.x && current.y === lastWireCell.y) return;

			const dx = current.x - lastWireCell.x;
			const dy = current.y - lastWireCell.y;

			// Только соседние клетки
			if (Math.abs(dx) + Math.abs(dy) === 1) {
				game!.placeWireBetween(lastWireCell.x, lastWireCell.y, current.x, current.y);
				lastWireCell = current;
			}
		}
	}

	function onPointerUp(event: PointerEvent) {
		if (event.button === 1) {
			isDraggingCamera = false;
		}

		if (isRotatingShmunsistor && rotateCell && rotationStartWorld) {
			const end = getWorldCoords(event);
			const dx = end.x - rotationStartWorld.x;
			const dy = end.y - rotationStartWorld.y;

			let direction: Direction;
			if (Math.abs(dx) > Math.abs(dy)) {
				direction = dx > 0 ? Direction.Right : Direction.Left;
			} else {
				direction = dy > 0 ? Direction.Down : Direction.Up;
			}

			const shmunsistor = game!.getElement(rotateCell.x, rotateCell.y) as any;
			if (shmunsistor instanceof ShmunsistorElement) {
				shmunsistor.direction = direction;
			}

			isRotatingShmunsistor = false;
			rotationStartWorld = null;
			rotateCell = null;
		}

		if (isDrawingWire) {
			isDrawingWire = false;
			lastWireCell = null;
		}
	}

	function onMouseLeave() {
		isDraggingCamera = false;

		isDrawingWire = false;
		lastWireCell = null;
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
