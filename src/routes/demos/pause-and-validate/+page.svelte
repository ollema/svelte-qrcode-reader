<script lang="ts">
	import type { DetectedBarcode } from 'barcode-detector/pure';
	import QrcodeStream from '$lib/components/qrcode-stream.svelte';

	let isValid = $state<boolean | undefined>(undefined);
	let paused = $state(false);
	let result = $state<string | null>(null);

	let validationPending = $derived(isValid === undefined && paused);
	let validationSuccess = $derived(isValid === true);
	let validationFailure = $derived(isValid === false);

	function onError(error: Error) {
		console.error(error);
	}

	function resetValidationState() {
		isValid = undefined;
	}

	async function onDetect([firstDetectedCode]: DetectedBarcode[]) {
		result = firstDetectedCode.rawValue;
		paused = true;

		// pretend it's taking really long
		await timeout(3000);
		isValid = result.startsWith('http');

		// some more delay, so users have time to read the message
		await timeout(2000);
		paused = false;
	}

	function timeout(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
</script>

<h2>Pause & Validate</h2>

<p>
	By pausing you can process each scanned QR-code one at a time. The last received frame is still
	displayed so it just looks like the stream is paused.
</p>

<p>
	Last result: <b>{result}</b>
</p>

<div class="scanner">
	<QrcodeStream {paused} {onDetect} {onError} onCameraOn={resetValidationState}>
		{#if validationSuccess}
			<div class="validation-success">This is a URL</div>
		{/if}

		{#if validationFailure}
			<div class="validation-failure">This is NOT a URL!</div>
		{/if}

		{#if validationPending}
			<div class="validation-pending">Long validation in progress...</div>
		{/if}
	</QrcodeStream>
</div>

<style>
	.scanner {
		width: 100%;
		max-width: 600px;
		aspect-ratio: 4/3;
	}

	.validation-success,
	.validation-failure,
	.validation-pending {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.8);
		padding: 10px;
		text-align: center;
		font-weight: bold;
		font-size: 1.4rem;
		color: black;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
	}

	.validation-success {
		color: green;
	}

	.validation-failure {
		color: red;
	}
</style>
