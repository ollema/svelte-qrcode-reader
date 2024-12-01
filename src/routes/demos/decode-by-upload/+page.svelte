<script lang="ts">
	import type { DetectedBarcode } from 'barcode-detector/pure';
	import QrcodeCapture from '$lib/components/qrcode-capture.svelte';

	const options = [
		{ text: 'rear camera (default)', value: 'environment' },
		{ text: 'front camera', value: 'user' },
		{ text: 'force file dialog', value: null }
	] as const;

	let result = $state('');
	let selected = $state(options[0]);

	function onDetect(detectedCodes: DetectedBarcode[]) {
		console.log(detectedCodes);
		result = JSON.stringify(detectedCodes.map((code) => code.rawValue));
	}
</script>

<h2>Decode by Upload</h2>

<p>
	Capture:
	<select bind:value={selected}>
		{#each options as option}
			<option value={option}>
				{option.text}
			</option>
		{/each}
	</select>
</p>

<hr />

<p>
	Last result: <b>{result}</b>
</p>

<QrcodeCapture {onDetect} capture={selected.value} />
