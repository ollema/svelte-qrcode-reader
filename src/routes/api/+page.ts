import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';

export function load() {
	throw redirect(302, base + '/api/qrcode-stream');
}
