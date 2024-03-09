export function ImageLoader({ src, onload = () => { } }) {
	const img = new Image();
	img.src = src;
	img.onload = onload;
	return img;
}
