<script lang="ts">
	import { base } from '$app/paths';
	import type { DetectedBarcode } from 'barcode-detector/pure';
	import QrcodeStream from '$lib/components/qrcode-stream.svelte';

	let paused = $state(false);
	let result = $state('');
	let showScanConfirmation = $state(false);

	function onCameraOn() {
		showScanConfirmation = false;
	}

	function onCameraOff() {
		showScanConfirmation = true;
	}

	function onError(error: Error) {
		console.error(error);
	}

	async function onDetect(detectedCodes: DetectedBarcode[]) {
		result = JSON.stringify(detectedCodes.map((code) => code.rawValue));

		paused = true;
		await timeout(500);
		paused = false;
	}

	function timeout(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
</script>

<h2>Scan Same Qrcode more than once</h2>

<p>
	You might have noticed that scanning the same QR code again doesn't work. The thing is when a QR
	code is in the view of your the camera it's decoded multiple times a second. You don't want to be
	flooded with detect events that often though. That's why the last decoded QR code is "cached" and
	an event is only emitted, when the decoded content changes.
</p>

<p>
	However this cache is reset when you change the paused prop. We can exploit that to scan same QR
	codes multiple times in a row.
</p>
<p>
	Last result: <b>{result}</b>
</p>

<div class="scanner">
	<QrcodeStream {onDetect} {onCameraOn} {onCameraOff} {onError} bind:paused>
		{#if showScanConfirmation}
			<div class="scan-confirmation">
				<img src="{base}/checkmark.svg" alt="Checkmark" width="128" />
			</div>
		{/if}
	</QrcodeStream>
</div>

<style>
	.scanner {
		width: 100%;
		max-width: 600px;
		aspect-ratio: 4/3;
	}

	.scan-confirmation {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.8);
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
	}
</style>
