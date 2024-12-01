<script lang="ts">
	import ieUrl from '../ie_32x32.png';
	import edge2019Url from '../edge2019_32x32.png';
	import firefoxUrl from '../firefox_32x32.png';
	import chromeUrl from '../chrome_32x32.png';
	import safariUrl from '../safari_32x32.png';
</script>

<main>
	<section id="qrcode-capture">
		<h1>QrcodeDropZone</h1>

		<section id="browser-support">
			<h2>Browser Support</h2>
			<p>
				The newest API this component depend on is the
				<a href="https://caniuse.com/#feat=filereader"> FileReader API </a>.
			</p>

			<table>
				<thead>
					<tr>
						<td align="center"><img src={ieUrl} alt="Internet Explorer" /></td>
						<td align="center"><img src={edge2019Url} alt="Edge" /></td>
						<td align="center"><img src={firefoxUrl} alt="Firefox" /></td>
						<td align="center"><img src={chromeUrl} alt="Chrome" /></td>
						<td align="center"><img src={safariUrl} alt="Safari" /></td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td align="center">10+</td>
						<td align="center">Yes</td>
						<td align="center">Yes</td>
						<td align="center">Yes</td>
						<td align="center">Yes¹</td>
					</tr>
				</tbody>
			</table>

			<p>
				<small>
					1. It doesn't work in web apps added to home screen (PWA mode) on iOS prior to 11.3 (see
					<a
						href="https://stackoverflow.com/questions/46228218/how-to-access-camera-on-ios11-home-screen-web-app"
						>this StackOverflow question</a
					>)
				</small>
			</p>
		</section>
	</section>
</main>
