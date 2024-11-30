<script lang="ts">
	import { base } from '$app/paths';
	import QrcodeStream from '$lib/components/qrcode-stream.svelte';

	let facingMode = $state<'environment' | 'user'>('environment');
	let noRearCamera = $state(false);
	let noFrontCamera = $state(false);

	function switchCamera() {
		facingMode = facingMode === 'environment' ? 'user' : 'environment';
	}

	function onError(error: Error) {
		const triedFrontCamera = facingMode === 'user';
		const triedRearCamera = facingMode === 'environment';
		const cameraMissingError = error.name === 'OverconstrainedError';

		if (triedRearCamera && cameraMissingError) {
			noRearCamera = true;
		}

		if (triedFrontCamera && cameraMissingError) {
			noFrontCamera = true;
		}

		console.error(error);
	}
</script>

<h2>Switch to Front Camera</h2>

{#if noFrontCamera}
	<p class="error">You don't seem to have a front camera on your device</p>
{/if}

{#if noRearCamera}
	<p class="error">You don't seem to have a rear camera on your device</p>
{/if}

<div class="scanner">
	<QrcodeStream constraints={{ facingMode }} {onError}>
		<button onclick={switchCamera}>
			<img src="{base}/camera-switch.svg" alt="switch camera" />
		</button>
	</QrcodeStream>
</div>

<style>
	.scanner {
		width: 100%;
		max-width: 600px;
		aspect-ratio: 4/3;
		position: relative;
	}

	button {
		position: absolute;
		left: 10px;
		top: 10px;
	}

	button img {
		width: 50px;
		height: 50px;
	}

	.error {
		color: red;
		font-weight: bold;
	}
</style>
