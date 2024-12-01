<script lang="ts">
	import { base } from '$app/paths';
	import QrcodeStream from '$lib/components/qrcode-stream.svelte';

	let fullscreen = $state(false);
	let wrapper: HTMLDivElement;

	let fullscreenIcon = $derived(fullscreen ? '/fullscreen-exit.svg' : '/fullscreen.svg');

	function onError(error: Error) {
		console.error(error);
	}

	function onFullscreenChange() {
		// this becomes important when the user doesn't use the button to exit
		// fullscreen but hits ESC on desktop, pushes a physical back button on
		// mobile etc.
		fullscreen = document.fullscreenElement !== null;
	}

	function requestFullscreen() {
		const elem = wrapper;

		if (elem.requestFullscreen) {
			elem.requestFullscreen();
			// @ts-expect-error false positive
		} else if (elem.mozRequestFullScreen) {
			/* Firefox */
			// @ts-expect-error false positive
			elem.mozRequestFullScreen();
			// @ts-expect-error false positive
		} else if (elem.webkitRequestFullscreen) {
			/* Chrome, Safari and Opera */
			// @ts-expect-error false positive
			elem.webkitRequestFullscreen();
			// @ts-expect-error false positive
		} else if (elem.msRequestFullscreen) {
			/* IE/Edge */
			// @ts-expect-error false positive
			elem.msRequestFullscreen();
		}
	}

	function exitFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
			// @ts-expect-error false positive
		} else if (document.mozCancelFullScreen) {
			/* Firefox */
			// @ts-expect-error false positive
			document.mozCancelFullScreen();
			// @ts-expect-error false positive
		} else if (document.webkitExitFullscreen) {
			/* Chrome, Safari and Opera */
			// @ts-expect-error false positive
			document.webkitExitFullscreen();
			// @ts-expect-error false positive
		} else if (document.msExitFullscreen) {
			/* IE/Edge */
			// @ts-expect-error false positive
			document.msExitFullscreen();
		}
	}

	$effect(() => {
		if (fullscreen) {
			requestFullscreen();
		} else {
			exitFullscreen();
		}
	});
</script>

<h2>Fullscreen</h2>

<p>
	QrcodeStream always covers the entire space available. Not more, not less. So to go fullscreen,
	simply put the component in a wrapper element that occupies the entire screen.
</p>

<div class:fullscreen bind:this={wrapper} onfullscreenchange={onFullscreenChange}>
	<QrcodeStream {onError}>
		<button onclick={() => (fullscreen = !fullscreen)} class="fullscreen-button">
			<img src={base + fullscreenIcon} alt="toggle fullscreen" />
		</button>
	</QrcodeStream>
</div>

<style>
	.fullscreen {
		position: fixed;
		z-index: 1000;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
	}

	.fullscreen-button {
		background-color: white;
		position: absolute;
		bottom: 0;
		right: 0;
		margin: 1rem;
	}

	.fullscreen-button img {
		width: 2rem;
	}
</style>
