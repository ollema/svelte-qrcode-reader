<script lang="ts">
	import type { BarcodeFormat, DetectedBarcode } from 'barcode-detector/pure';
	import { processFile, processUrl } from '../misc/scanner.js';
	import type { Snippet } from 'svelte';

	type Props = {
		formats?: BarcodeFormat[];
		onDetect?: (detectedCodes: DetectedBarcode[]) => void;
		onDragover?: (isDraggingOver: boolean) => void;
		onError?: (error: Error) => void;
		children?: Snippet;
	};

	let {
		formats = ['qr_code'] as BarcodeFormat[],
		onDetect,
		onDragover,
		onError,
		children
	}: Props = $props();

	const onDetectFile = async (promise: Promise<DetectedBarcode[]>) => {
		try {
			const detectedCodes = await promise;
			onDetect?.(detectedCodes);
		} catch (error) {
			onError?.(error as Error);
		}
	};

	const onDragOverChange = (isDraggingOver: boolean) => {
		onDragover?.(isDraggingOver);
	};

	const onDrop = async (event: DragEvent) => {
		if (!event.dataTransfer) return;

		onDragOverChange(false);

		const droppedFiles = [...Array.from(event.dataTransfer.files)];
		const droppedUrl = event.dataTransfer.getData('text/uri-list');

		for (const file of droppedFiles) {
			onDetectFile(processFile(file, formats));
		}

		if (droppedUrl !== '') {
			onDetectFile(processUrl(droppedUrl, formats));
		}
	};

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		onDrop(e);
	}

	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		onDragOverChange(true);
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
		onDragOverChange(false);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		e.stopPropagation();
	}
</script>

<div
	role="region"
	aria-label="QR code drop zone"
	ondrop={handleDrop}
	ondragenter={handleDragEnter}
	ondragleave={handleDragLeave}
	ondragover={handleDragOver}
>
	{@render children?.()}
</div>
