<script lang="ts">
	import type { DetectedBarcode, BarcodeFormat } from 'barcode-detector/pure';
	import { processFile } from '../misc/scanner.js';

	type Props = {
		formats?: BarcodeFormat[];
		onDetect?: (detectedCodes: DetectedBarcode[]) => void;
		capture?: 'environment' | 'user' | null;
	};

	let {
		formats = ['qr_code'] as BarcodeFormat[],
		onDetect,
		capture = 'environment'
	}: Props = $props();

	async function onChangeInput(event: Event) {
		if (!(event.target instanceof HTMLInputElement) || !event.target.files) return;

		for (const file of Array.from(event.target.files)) {
			const detectedCodes = await processFile(file, formats);
			onDetect?.(detectedCodes);
		}
	}
</script>

<input onchange={onChangeInput} type="file" name="image" accept="image/*" {capture} multiple />
