<script lang="ts">
	import type { BarcodeFormat, DetectedBarcode } from 'barcode-detector/pure';
	import QrcodeDropZone from '$lib/components/qrcode-drop-zone.svelte';

	let result = $state<string | null>(null);
	let error = $state<string | null>(null);

	let dragover = $state(false);

	let barcodeFormats = $state<Record<BarcodeFormat, boolean>>({
		aztec: false,
		code_128: false,
		code_39: false,
		code_93: false,
		codabar: false,
		databar: false,
		databar_expanded: false,
		databar_limited: false,
		data_matrix: false,
		dx_film_edge: false,
		ean_13: false,
		ean_8: false,
		itf: false,
		maxi_code: false,
		micro_qr_code: false,
		pdf417: false,
		qr_code: true,
		rm_qr_code: false,
		upc_a: false,
		upc_e: false,
		linear_codes: false,
		matrix_codes: false,
		unknown: false
	});

	let selectedBarcodeFormats = $derived(
		Object.keys(barcodeFormats).filter(
			// @ts-expect-error fix this later :)
			(format: string) => barcodeFormats[format]
		) as BarcodeFormat[]
	);

	function onDetect(detectedCodes: DetectedBarcode[]) {
		console.log(detectedCodes);
		result = JSON.stringify(detectedCodes.map((code) => code.rawValue));
	}

	function onError(err: { name: string; message: string }) {
		error = `[${err.name}]: `;

		if (err.name === 'DropImageFetchError') {
			error += "Sorry, you can't load cross-origin images :/";
		} else if (err.name === 'DropImageDecodeError') {
			error += "That's not an image that can be decoded";
		} else {
			error += err.message;
		}
	}

	function onDragover(isDraggingOver: boolean) {
		dragover = isDraggingOver;
	}
</script>

<h2>Decode by Drag & Drop</h2>

<p>
	By default only QR-codes are detected but a variety of other barcode formats are also supported.
	You can select one or multiple but the more you select the more expensive scanning becomes: <br />

	{#each Object.keys(barcodeFormats) as option}
		{#if !option.endsWith('_codes') && option !== 'unknown'}
			{@const barcodeOption = option as BarcodeFormat}
			<span class="barcode-format-checkbox">
				<input type="checkbox" id={option} bind:checked={barcodeFormats[barcodeOption]} />
				<label for={option}>{option}</label>
			</span>
		{/if}
	{/each}
</p>

<p class="decode-result">
	Last result: <b>{result}</b>
</p>

{#if error}
	<p class="drop-error">
		{error}
	</p>
{/if}

<QrcodeDropZone {onDetect} {onDragover} {onError} formats={selectedBarcodeFormats}>
	<div class="drop-area" class:dragover>DROP SOME IMAGES HERE</div>
</QrcodeDropZone>

<style>
	.drop-area {
		height: 300px;
		color: #fff;
		text-align: center;
		font-weight: bold;
		padding: 10px;
		background-color: #3c3c43;
	}

	.dragover {
		background-color: #10b981;
	}

	.drop-error {
		color: red;
		font-weight: bold;
	}
</style>
