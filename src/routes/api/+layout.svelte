<script lang="ts">
	import { base } from '$app/paths';
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();
</script>

<h1>API reference (uh not really at this point)</h1>

<ul>
	<li><a href="{base}/api/qrcode-stream"><code>&lt;QrcodeStream/&gt;</code></a></li>
	<li><a href="{base}/api/qrcode-drop-zone"><code>&lt;QrcodeDropZone/&gt;</code></a></li>
	<li><a href="{base}/api/qrcode-capture"><code>&lt;QrcodeCapture/&gt;</code></a></li>
</ul>

{@render children?.()}
