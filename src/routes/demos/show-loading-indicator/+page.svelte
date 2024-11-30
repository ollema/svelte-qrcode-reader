<script lang="ts">
	import { tick } from 'svelte';
	import QrcodeStream from '$lib/components/qrcode-stream.svelte';

	let loading = $state(true);
	let destroyed = $state(false);

	function onCameraOn() {
		loading = false;
	}

	async function reload() {
		destroyed = true;
		await tick();
		destroyed = false;
		loading = true;
	}
</script>

<h2>Show Loading Indicator</h2>

<p>
	There is some delay between mounting the component and the camera stream becoming visible. Listen
	for the onCameraOn event to show a loading indicator.
</p>

<p>Push the button below to force destroy and re-create the component.</p>

<div>
	<button onclick={reload}>Destroy And Re-Create Component</button>

	{#if !destroyed}
		<QrcodeStream {onCameraOn}>
			{#if loading}
				<div class="loading-indicator">Loading...</div>
			{/if}
		</QrcodeStream>
	{/if}
</div>

<style>
	button {
		margin-bottom: 20px;
	}

	.loading-indicator {
		font-weight: bold;
		font-size: 2rem;
		text-align: center;
	}
</style>
