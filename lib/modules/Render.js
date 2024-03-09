/** render
 * render is a base class for:
 * - ImageRender
 * - ShapeRender
 */

import { Shape, Arc, Rect, Line, Path } from './Shape.js';
import { Transform } from './Transform.js';

Math.TAU = Math.PI * 2;

export class Render {
	/** @type {Transform} */ transform;
	/** @type {Object[]} */ childrens = [];

	// variable for the render
	strokeSize = 0;
	stroke = 'black';
	fill = 'black';

	constructor({ trn = new Transform(), childrens = [], strokeSize = 0, stroke = 'black', fill = 'black' } = {}) {
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		this.transform = trn;
		this.strokeSize = strokeSize;
		this.stroke = stroke;
		this.fill = fill;
		this.childrens = childrens;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render (ctx, trns) {
		if (this.childrens.length === 0) return;
		let trn = this.transform.clone().apply(trns)
		for (let child of this.childrens) if (typeof child.render === 'function') child.render(ctx, trn);
	}

	clone() {
		return new Render({
			trn: this.transform.clone(),
			childrens: this.childrens.map(c => c.clone ? c.clone() : c),
			strokeSize: this.strokeSize,
			stroke: this.stroke,
			fill: this.fill
		});
	}
}

export class ImageRender extends Render {
	/** @type {Image} */
	image;

	constructor({ image, trn = new Transform(), childrens = [] } = {}) {
		if (!(image instanceof Image)) throw new Error('image must be an Image');
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super({ trn, childrens });
		this.image = image;
		this.transform = trn;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render (ctx, trns = new Transform()) {
		let trn = this.transform.clone().apply(trns);
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.scale(trn.scaleX, trn.scaleY);
		ctx.drawImage(this.image, 0, 0);
		ctx.restore();
		super.render(ctx, trns);
	}
}

export class RectRender extends Render {
	/** @type {Rect} */
	shape;

	constructor({ shape = new Rect(), trn = new Transform(), childrens = [], strokeSize = 0, stroke = 'black', fill = 'black' } = {}) {
		if (!(shape instanceof Rect)) throw new Error('shape must be a Rect Shape');
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super({ trn, childrens, strokeSize, stroke, fill });
		this.shape = shape;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render (ctx, trns = new Transform()) {
		let trn = this.transform.clone().apply(trns);
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.scale(trn.scaleX, trn.scaleY);

		ctx.fillStyle = this.fill;
		ctx.fillRect(0, 0, this.shape.w, this.shape.h);
		ctx.strokeStyle = this.stroke;
		ctx.lineWidth = this.strokeSize;
		ctx.strokeRect(0, 0, this.shape.w, this.shape.h);
		ctx.restore();
		super.render(ctx, trns);
	}
}

export class ArcRender extends Render {
	/** @type {Arc} */
	shape;

	constructor({ shape = new Arc(), trn = new Transform(), childrens = [], strokeSize = 0, stroke = 'black', fill = 'black' } = {}) {
		if (!(shape instanceof Arc)) throw new Error('shape must be a Arc Shape');
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super({ trn, childrens, strokeSize, stroke, fill });
		this.shape = shape;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render (ctx, trns = new Transform()) {
		let trn = this.transform.clone().apply(trns);
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.scale(trn.scaleX, trn.scaleY);
		ctx.beginPath();

		ctx.fillStyle = this.fill;
		ctx.arc(0, 0, this.shape.r, 0, Math.TAU);
		ctx.fill();
		ctx.strokeStyle = this.stroke;
		ctx.lineWidth = this.strokeSize;
		ctx.stroke();
		ctx.restore();
		super.render(ctx, trns);
	}
}

export class LineRender extends Render {
	/** @type {Line} */
	shape;

	constructor({ shape = new Line(), trn = new Transform(), childrens = [], strokeSize = 0, stroke = 'black', fill = 'black' } = {}) {
		if (!(shape instanceof Line)) throw new Error('shape must be a Line Shape');
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super({ trn, childrens, strokeSize, stroke, fill });
		this.shape = shape;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render = (ctx, trns = new Transform()) => {
		let trn = this.transform.clone().apply(trns);
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.scale(trn.scaleX, trn.scaleY);

		ctx.beginPath();
		ctx.moveTo(this.shape.x1, this.shape.y1);
		ctx.lineTo(this.shape.x2, this.shape.y2);
		ctx.strokeStyle = this.stroke;
		ctx.lineWidth = this.strokeSize;
		ctx.stroke();
		ctx.restore();
		super.render(ctx, trns);
	}
}

export class PathRender extends Render {
	/** @type {Path} */
	path;

	constructor({ path = new Path(), trn = new Transform(), childrens = [], strokeSize = 0, stroke = 'black', fill = 'black' } = {}) {
		if (!(path instanceof Path)) throw new Error('path must be a Path');
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super({ trn, childrens, strokeSize, stroke, fill });
		this.path = path;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render = (ctx, trns = new Transform()) => {
		let trn = this.transform.clone().apply(trns);
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.scale(trn.scaleX, trn.scaleY);

		ctx.fillStyle = this.fill;
		ctx.strokeStyle = this.stroke;
		ctx.lineWidth = this.strokeSize;

		ctx.beginPath();
		let coords = this.path.points;
		ctx.moveTo(coords[0].x, coords[0].y);
		for (let i = 1; i < coords.length; i++) ctx.lineTo(coords[i].x, coords[i].y);
		ctx.closePath();
		ctx.restore();
		super.render(ctx, trns);
	}
}

export class TextRender extends Render {
	/** @type {string} */
	text;

	fontSize = 30;
	font = 'Arial';
	align = 'center';
	baseline = 'middle';

	constructor({ text = '', trn = new Transform(), childrens = [], fontSize = 30, font = 'Arial', align = 'center', baseline = 'middle', strokeSize = 0, stroke = 'black', fill = 'black'  } = {}) {
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super({ trn, childrens, strokeSize, stroke, fill });
		this.text = text;
		this.fontSize = fontSize;
		this.font = font;
		this.align = align;
		this.baseline = baseline;
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render (ctx, trns = new Transform()) {
		let trn = this.transform.clone().apply(trns);
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.scale(trn.scaleX, trn.scaleY);

		ctx.fillStyle = this.fill;
		ctx.strokeStyle = this.stroke;
		ctx.lineWidth = this.strokeSize;
		ctx.font = `${this.fontSize}px ${this.font}`;
		ctx.textAlign = this.align;
		ctx.textBaseline = this.baseline;
		ctx.fillText(this.text, 0, 0);
		ctx.strokeText(this.text, 0, 0);
		ctx.restore();
		super.render(ctx, trns);
	}
}

/**
 * @note this render is not meant to be used in production
 * @note this render does not support childrens, strokeSize, stroke, fill, transform
 */
export class transformDebugRender extends Render {
	constructor({ trn = new Transform() } = {}) {
		if (!(trn instanceof Transform)) throw new Error('trn must be a transform');
		super();
	}

	/** @param {CanvasRenderingContext2D} ctx */
	render (ctx, trns = new Transform()) {
		let trn = trns.clone()
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		// ctx.scale(trn.scaleX, trn.scaleY);

		// x and y axis
		ctx.fillStyle = 'black';
		ctx.lineWidth = 1;
		ctx.font = '10px Arial';

		// x axis
		ctx.beginPath();
		ctx.strokeStyle = 'red';
		ctx.moveTo(0, 0);
		ctx.lineTo(trn.scaleX * 20, 0);
		ctx.stroke();

		// y axis
		ctx.beginPath();
		ctx.strokeStyle = 'green';
		ctx.moveTo(0, 0);
		ctx.lineTo(0, trn.scaleY * 20);
		ctx.stroke();

		// point
		ctx.beginPath();
		ctx.arc(0, 0, 5, 0, Math.TAU);
		ctx.fill();
		ctx.restore();

		// info without rotation or scale
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.fillStyle = 'black';

		// x, y world position (show above the point)
		let posText = `(${trn.x.toFixed(2).toString().padStart(5, ' ')} : ${trn.y.toFixed(2).toString().padStart(5, ' ')})`;
		ctx.textAlign = 'center';
		ctx.fillText(posText, 0, -10);
		ctx.textAlign = 'start';

		// rotation (represent with an arc)
		ctx.font = '8px Arial';
		let rotationText = `${trn.rotation.toFixed(2).toString().padStart(5, ' ')}rad`;
		ctx.fillText(rotationText, 10, 4);
		ctx.beginPath();
		ctx.arc(0, 0, 10, 0, trn.rotation % Math.TAU);
		ctx.stroke();
		ctx.restore();

		// info without scale
		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation);
		ctx.fillStyle = 'black';
		ctx.font = '8px Arial';

		// x, y scale (colored lines with fixed size)
		ctx.beginPath();
		ctx.strokeStyle = 'red';
		ctx.moveTo(20, -5);
		ctx.lineTo(20, 5);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = 'green';
		ctx.moveTo(-5, 20);
		ctx.lineTo(5, 20);
		ctx.stroke();
		ctx.fillText(trn.scaleY.toFixed(2).toString().padStart(5, ' '), 0, 15);
		ctx.restore();

		ctx.save();
		ctx.translate(trn.x, trn.y);
		ctx.rotate(trn.rotation - Math.PI / 2);
		ctx.fillStyle = 'black';
		ctx.font = '8px Arial';
		ctx.fillText(trn.scaleX.toFixed(2).toString().padStart(5, ' '), 0, 15);
		ctx.restore();
	}
}
