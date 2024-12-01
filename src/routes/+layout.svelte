<script lang="ts">
	import { base } from '$app/paths';
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();
</script>

<header class="container">
	<nav>
		<ul>
			<li><strong><a href="{base}/">Svelte Qrcode Reader</a></strong></li>
		</ul>
		<ul>
			<li><a href="{base}/">Home</a></li>
			<li><a href="{base}/demos">Live Demos</a></li>
			<li><a href="{base}/api">API Reference</a></li>
		</ul>
	</nav>
</header>

<main class="container">
	{@render children?.()}
</main>
