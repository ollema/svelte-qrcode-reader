<script lang="ts">
	import type { DetectedBarcode, BarcodeFormat, Point2D } from 'barcode-detector/pure';
	import { keepScanning, setScanningFormats } from '../misc/scanner.js';
	import * as cameraController from '../misc/camera.js';
	import type { Point } from '../types/types.js';
	import { assert } from '../misc/util.js';
	import { onDestroy, onMount, type Snippet } from 'svelte';

	type Props = {
		// eslint-disable-next-line no-undef
		constraints?: MediaTrackConstraints;
		formats?: BarcodeFormat[];
		paused?: boolean;
		torch?: boolean;
		track?: (
			adjustedCodes: {
				cornerPoints: { x: number; y: number }[];
				boundingBox: DOMRectReadOnly;
				rawValue: string;
				format: Exclude<BarcodeFormat, 'linear_codes' | 'matrix_codes'>;
			}[],
			ctx: CanvasRenderingContext2D
		) => void;
		// eslint-disable-next-line no-undef
		onCameraOn?: (capabilities: MediaTrackCapabilities) => void;
		onError?: (error: Error) => void;
		onCameraOff?: () => void;
		onDetect?: (detectedCodes: DetectedBarcode[]) => void;
		children?: Snippet;
	};

	let {
		// props
		constraints = { facingMode: 'environment' },
		formats = ['qr_code'] as BarcodeFormat[],
		paused = $bindable(false),
		torch = false,
		track,
		// "events"?
		onCameraOn,
		onError,
		onCameraOff,
		onDetect,
		// optional overlay
		children
	}: Props = $props();

	// state
	let videoRef: HTMLVideoElement;
	let pauseFrameRef: HTMLCanvasElement;
	let trackingLayerRef: HTMLCanvasElement;
	let cameraActive = $state(false);
	let isMounted = $state(false);

	// camera settings computed value
	let cameraSettings = $derived({
		torch,
		constraints: constraints,
		shouldStream: isMounted && !paused
	});

	// handle camera settings changes
	$effect(() => {
		const settings = cameraSettings;

		assert(videoRef !== undefined, 'Video element must be defined');
		assert(pauseFrameRef !== undefined, 'Canvas must be defined');
		const ctx = pauseFrameRef.getContext('2d');
		assert(ctx !== null, 'Canvas 2d context must be non-null');

		if (settings.shouldStream) {
			cameraController.stop();
			cameraActive = false;

			// start camera
			try {
				cameraController
					.start(videoRef, settings)
					.then((capabilities) => {
						if (isMounted) {
							cameraActive = true;
							onCameraOn?.(capabilities);
						} else {
							cameraController.stop();
						}
					})
					.catch((error) => {
						onError?.(error);
					});
			} catch (error) {
				onError?.(error as Error);
			}
		} else {
			// stop camera
			pauseFrameRef.width = videoRef.videoWidth;
			pauseFrameRef.height = videoRef.videoHeight;
			ctx.drawImage(videoRef, 0, 0, videoRef.videoWidth, videoRef.videoHeight);

			cameraController.stop();
			cameraActive = false;
			onCameraOff?.();
		}
	});

	// watch formats
	$effect(() => {
		if (isMounted) {
			setScanningFormats(formats);
		}
	});

	// should scan computed
	let shouldScan = $derived(cameraSettings.shouldStream && cameraActive);

	// handle scanning
	$effect(() => {
		if (shouldScan) {
			assert(pauseFrameRef !== undefined, 'Pause frame canvas must be defined');
			clearCanvas(pauseFrameRef);

			assert(trackingLayerRef !== undefined, 'Tracking canvas must be defined');
			clearCanvas(trackingLayerRef);

			const scanInterval = track === undefined ? 500 : 40;

			assert(videoRef !== undefined, 'Video element must be defined');
			keepScanning(videoRef, {
				detectHandler: (detectedCodes: DetectedBarcode[]) => onDetect?.(detectedCodes),
				formats: formats,
				locateHandler: onLocate,
				minDelay: scanInterval
			});
		}
	});

	// helper functions
	function clearCanvas(canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext('2d');
		assert(ctx !== null, 'Canvas 2d context should be non-null');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function onLocate(detectedCodes: DetectedBarcode[]) {
		assert(trackingLayerRef !== undefined, 'Tracking canvas must be defined');
		assert(videoRef !== undefined, 'Video element must be defined');

		if (detectedCodes.length === 0 || track === undefined) {
			clearCanvas(trackingLayerRef);
		} else {
			const displayWidth = videoRef.offsetWidth;
			const displayHeight = videoRef.offsetHeight;
			const resolutionWidth = videoRef.videoWidth;
			const resolutionHeight = videoRef.videoHeight;

			const largerRatio = Math.max(
				displayWidth / resolutionWidth,
				displayHeight / resolutionHeight
			);
			const uncutWidth = resolutionWidth * largerRatio;
			const uncutHeight = resolutionHeight * largerRatio;

			const xScalar = uncutWidth / resolutionWidth;
			const yScalar = uncutHeight / resolutionHeight;
			const xOffset = (displayWidth - uncutWidth) / 2;
			const yOffset = (displayHeight - uncutHeight) / 2;

			const scale = ({ x, y }: Point) => ({
				x: Math.floor(x * xScalar),
				y: Math.floor(y * yScalar)
			});

			const translate = ({ x, y }: Point) => ({
				x: Math.floor(x + xOffset),
				y: Math.floor(y + yOffset)
			});

			const adjustedCodes = detectedCodes.map((detectedCode) => {
				const { boundingBox, cornerPoints } = detectedCode;
				const { x, y } = translate(scale({ x: boundingBox.x, y: boundingBox.y }));
				const { x: width, y: height } = scale({
					x: boundingBox.width,
					y: boundingBox.height
				});

				return {
					...detectedCode,
					cornerPoints: cornerPoints.map((point: Point2D) => translate(scale(point))),
					boundingBox: DOMRectReadOnly.fromRect({ x, y, width, height })
				};
			});

			trackingLayerRef.width = videoRef.offsetWidth;
			trackingLayerRef.height = videoRef.offsetHeight;
			const ctx = trackingLayerRef.getContext('2d') as CanvasRenderingContext2D;
			track?.(adjustedCodes, ctx);
		}
	}

	// lifecycle
	onMount(() => {
		isMounted = true;
	});

	onDestroy(() => {
		cameraController.stop();
	});
</script>

<div class="wrapper">
	<video bind:this={videoRef} class="camera" class:hidden={!shouldScan} autoplay muted playsinline>
	</video>

	<canvas
		id="qrcode-stream-pause-frame"
		bind:this={pauseFrameRef}
		class="camera"
		class:hidden={shouldScan}
	>
	</canvas>

	<canvas id="qrcode-stream-tracking-layer" bind:this={trackingLayerRef} class="overlay"></canvas>

	<div class="overlay">
		{@render children?.()}
	</div>
</div>

<style>
	.wrapper {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 0;
	}

	.camera {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hidden {
		visibility: hidden;
		position: absolute;
	}

	.overlay {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
