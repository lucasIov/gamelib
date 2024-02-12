/** render
 * render is a base class for:
 * - ImageRender
 * - ShapeRender
 */

import { Shape, Arc, Rect, Line, Path } from './Shape.js';
import { Transform } from './Transform.js';

export class Render {
	/** @type {Transform} */
	transform;

	// variable for the render
	strokeSize = 0;
	strokeColor = 'black';
	fillColor = 'black';

	constructor({ trn = new Transform(), strokeSize = 0, strokeColor = 'black', fillColor = 'black' } = {}) {
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		this.transform = trn;
		this.strokeSize = strokeSize;
		this.strokeColor = strokeColor;
		this.fillColor = fillColor;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render = (ctx, trns) => { }
}

export class ImageRender extends Render {
	/** @type {Image} */
	image;

	constructor({ image, trn = new Transform() } = {}) {
		if (!(image instanceof Image)) throw new Error('image must be an Image');
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super();
		this.image = image;
		this.transform = trn;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render = (ctx, trns = new Transform()) => {
		let trn = trns.clone().add(this.transform);
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.scale(trn.scaleX, trn.scaleY);
		ctx.drawImage(this.image, 0, 0);
		ctx.restore();
	}
}

export class RectRender extends Render {
	/** @type {Rect} */
	shape;

	constructor({ shape = new Rect(), trn = new Transform(), strokeSize = 0, strokeColor = 'black', fillColor = 'black' } = {}) {
		if (!(shape instanceof Rect)) throw new Error('shape must be a Shape');
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super({
			strokeSize,
			strokeColor,
			fillColor,
			trn
		});
		this.shape = shape;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render = (ctx, trns = new Transform()) => {
		let trn = trns.clone().add(this.transform);
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.scale(trn.scaleX, trn.scaleY);

		ctx.fillStyle = this.fillColor;
		ctx.fillRect(0, 0, this.shape.w, this.shape.h);
		ctx.strokeStyle = this.strokeColor;
		ctx.lineWidth = this.strokeSize;
		ctx.strokeRect(0, 0, this.shape.w, this.shape.h);

		ctx.restore();
	}
}

export class ArcRender extends Render {
	/** @type {Arc} */
	shape;

	constructor({ shape = new Arc(), trn = new Transform(), strokeSize = 0, strokeColor = 'black', fillColor = 'black' } = {}) {
		if (!(shape instanceof Arc)) throw new Error('shape must be a Shape');
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super({
			strokeSize,
			strokeColor,
			fillColor,
			trn
		});
		this.shape = shape;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render = (ctx, trns = new Transform()) => {
		let trn = trns.clone();
		trn.add(this.transform);

		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.scale(trn.scaleX, trn.scaleY);
		ctx.beginPath();

		ctx.fillStyle = this.fillColor;
		ctx.arc(0, 0, this.shape.r, 0, 2 * Math.PI);
		ctx.fill();
		ctx.strokeStyle = this.strokeColor;
		ctx.lineWidth = this.strokeSize;
		ctx.stroke();

		ctx.restore();
	}
}

export class LineRender extends Render {
	/** @type {Line} */
	shape;

	constructor({ shape = new Line(), trn = new Transform(), strokeSize = 0, strokeColor = 'black', fillColor = 'black' } = {}) {
		if (!(shape instanceof Line)) throw new Error('shape must be a Shape');
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super({
			strokeSize,
			strokeColor,
			fillColor,
			trn
		});
		this.shape = shape;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render = (ctx, trns = new Transform()) => {
		let trn = trns.clone().add(this.transform);
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.scale(trn.scaleX, trn.scaleY);

		ctx.beginPath();
		ctx.moveTo(this.shape.x1, this.shape.y1);
		ctx.lineTo(this.shape.x2, this.shape.y2);
		ctx.strokeStyle = this.strokeColor;
		ctx.lineWidth = this.strokeSize;
		ctx.stroke();

		ctx.restore();
	}
}

export class PathRender extends Render {
	/** @type {Path} */
	path;

	constructor({ path = new Path(), trn = new Transform(), strokeSize = 0, strokeColor = 'black', fillColor = 'black' } = {}) {
		if (!(path instanceof Path)) throw new Error('path must be a Path');
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super({
			strokeSize,
			strokeColor,
			fillColor,
			trn
		});
		this.path = path;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render = (ctx, trns = new Transform()) => {
		let trn = trns.clone().add(this.transform);
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.scale(trn.scaleX, trn.scaleY);

		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = this.strokeColor;
		ctx.lineWidth = this.strokeSize;

		ctx.beginPath();
		let coords = this.path.points;
		ctx.moveTo(coords[0].x, coords[0].y);
		for (let i = 1; i < coords.length; i++) ctx.lineTo(coords[i].x, coords[i].y);
		ctx.closePath();

		ctx.restore();
	}
}

export class TextRender extends Render {
	/** @type {string} */
	text;

	fontSize = 30;
	font = 'Arial';
	align = 'center';
	baseline = 'middle';

	constructor({ text = '', trn = new Transform(), fontSize = 30, font = 'Arial', align = 'center', baseline = 'middle', strokeSize = 0, strokeColor = 'black', fillColor = 'black'  } = {}) {
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super({
			strokeSize,
			strokeColor,
			fillColor,
			trn
		});
		this.text = text;
		this.fontSize = fontSize;
		this.font = font;
		this.align = align;
		this.baseline = baseline;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render = (ctx, trns = new Transform()) => {
		let trn = trns.clone().add(this.transform);
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.scale(trn.scaleX, trn.scaleY);

		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = this.strokeColor;
		ctx.lineWidth = this.strokeSize;
		ctx.font = `${this.fontSize}px ${this.font}`;
		ctx.textAlign = this.align;
		ctx.textBaseline = this.baseline;
		ctx.fillText(this.text, 0, 0);
		ctx.strokeText(this.text, 0, 0);

		ctx.restore();
	}
}
