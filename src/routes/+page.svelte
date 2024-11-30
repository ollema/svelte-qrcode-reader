<script lang="ts">
	import { goto } from '$app/navigation';

	function gotoDemos() {
		goto('/demos');
	}

	function gotoGithub() {
		window.location.href = 'https://github.com/ollema/svelte-qrcode-reader';
	}
</script>

<h1>Svelte Qrcode Reader</h1>

<h4>A set of Svelte 5 components for detecting and decoding QR-codes.</h4>

<div class="buttons">
	<button onclick={gotoDemos}> See Demos </button>
	<button class="secondary" onclick={gotoGithub}> View on GitHub </button>
</div>

<style>
	h4 {
		max-width: 30rem;
	}

	.buttons {
		margin-top: 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>
