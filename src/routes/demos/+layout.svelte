<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();
</script>

<h1>Demos</h1>

<ul>
	<li><a href="/demos/full-demo">Full demo</a></li>
	<li><a href="/demos/show-loading-indicator">Show Loading Indicator</a></li>
	<li><a href="/demos/scan-same-qrcode-more-than-once">Scan Same Qrcode More Than Once</a></li>
	<li><a href="/demos/pause-and-validate">Pause & Validate</a></li>
	<li><a href="/demos/switch-to-front-camera">Switch to Front Camera</a></li>
	<li><a href="/demos/fullscreen">Fullscreen</a></li>
	<li><a href="/demos/torch">Torch (Flashlight)</a></li>
	<li><a href="/demos/decode-by-drag-and-drop">Decode by Drag & Drop</a></li>
	<li><a href="/demos/decode-by-upload">Decode by Upload</a></li>
</ul>

{@render children?.()}
