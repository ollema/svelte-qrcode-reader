<script lang="ts">
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import QrcodeStream from '$lib/components/qrcode-stream.svelte';

	let selected = $state<MediaDeviceInfo | null>(null);
	let devices = $state<MediaDeviceInfo[]>([]);
	let torchActive = $state(false);
	let torchNotSupported = $state(false);

	let icon = $derived(torchActive ? '/flash-off.svg' : '/flash-on.svg');

	onMount(async () => {
		devices = (await navigator.mediaDevices.enumerateDevices()).filter(
			({ kind }) => kind === 'videoinput'
		);

		if (devices.length > 0) {
			selected = devices[0];
		}
	});

	// eslint-disable-next-line no-undef
	function onCameraOn(capabilities: MediaTrackCapabilities) {
		console.log(capabilities);
		// @ts-expect-error torch is not in the MediaTrackConstraints type but it should be?
		torchNotSupported = !capabilities.torch;
	}

	function onError(err: Error) {
		console.error(err);
	}
</script>

<h2>Torch (Flashlight)</h2>

<p>
	Pick camera:
	<select bind:value={selected}>
		{#each devices as device}
			<option value={device}>
				{device.label}
			</option>
		{/each}
	</select>
</p>

{#if torchNotSupported}
	<p class="error">Torch not supported for active camera</p>
{/if}

{#if selected !== null}
	<div class="scanner">
		<QrcodeStream
			torch={torchActive}
			constraints={{ deviceId: selected.deviceId }}
			{onError}
			{onCameraOn}
		>
			<button onclick={() => (torchActive = !torchActive)} disabled={torchNotSupported}>
				<img src={base + icon} alt="toggle torch" />
			</button>
		</QrcodeStream>
	</div>
{/if}

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
