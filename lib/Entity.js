import { Shape } from "./modules/Shape.js";
import { Transform } from "./modules/Transform.js";
import { Render } from "./modules/Render.js";
import { lerp } from "./Math.js";

export class Entity {
	shape = new Shape(); // controle the shape of the object and its interactions with other objects
	transform = new Transform(); // allow the object to be moved and deformed
	Render = new Render(); // allow the object to be rendered

	/**
	 * @param {object} options
	 * @param {Shape} options.shape - the shape of the object
	 * @param {Transform} options.transform - the transform of the object
	 * @param {Render} options.render - the render of the object
	 * @param {number} options.x - the x position of the object
	 * @param {number} options.y - the y position of the object
	 * @param {number} options.scale - the scale of the object
	 * @param {number} options.rotation - the rotation of the object
	 */
	constructor({ shape = new Shape(), transform = new Transform(), render = new Render(),
		x, y, scale, rotation,
	} = {}) {
		this.shape = shape;
		this.transform = transform;
		if (typeof x === 'number') this.transform.x = x;
		if (typeof y === 'number') this.transform.y = y;
		if (typeof scale === 'number') this.transform.scale = scale;
		if (typeof rotation === 'number') this.transform.rotation = rotation;
		this.Render = render;
	}

	render = (ctx, trns) => this.Render.render(ctx, this.resolveTransform(trns));

	resolveTransform(trns) { return this.transform.clone().apply(trns); }

	isInXY({ x, y } = {}) {
		return this.shape.isInXY({
			x: x - this.transform.x,
			y: y - this.transform.y
		});
	}

	isInEntity(e) { return Math.hypot(this.transform.x - e.transform.x, this.transform.y - e.transform.y) < this.shape.r + e.shape.r; }
}

export class Particle extends Entity {
	/** @type {number} */ maxLife = 0;
	/** @type {number} */ age = 0;
	startTransform = new Transform();
	endTransform = new Transform();

	startRenderTransform = new Transform();
	endRenderTransform = new Transform();

	startColor = [ 0, 0, 0, 1 ] // [ r, g, b, a ]
	endColor = [ 0, 0, 0, 1 ] // [ r, g, b, a ]

	intF = lerp;

	/**
	 * @param {object} options
	 * @param {Shape} options.shape - the shape of the object
	 * @param {Transform} options.transform - the transform of the object
	 * @param {Render} options.render - the render of the object
	 * @param {number} options.maxLife - the max life of the object
	 * @param {number} options.endTransform - the end transform of the object
	 * @param {number[]} options.startColor - the start color of the object
	 * @param {number[]} options.endColor - the end color of the object
	 */
	constructor({
		shape, transform, render,
		maxLife = 0,
		endTransform,
		endRenderTransform,
		startColor = [ 0, 0, 0, 1 ], endColor = [ 0, 0, 0, 1 ],
		/*interpolationFunction = lerp*/
	} = {}) {
		super({ shape, transform, render });
		this.maxLife = maxLife;

		this.startTransform = transform.clone();
		this.endTransform = endTransform || transform;

		this.startRenderTransform = render.transform.clone();
		this.endRenderTransform = endRenderTransform || render.transform;

		this.startColor = startColor;
		this.endColor = endColor;

		this.startRender = render.clone();

		// this.intF = interpolationFunction;
	}

	update = ({ state, selfRemove }) => {
		this.age++;
		if (this.age > this.maxLife) selfRemove();
		let p = this.age / this.maxLife;

		// transform
		this.transform.x = this.intF(p, this.startTransform.x, this.endTransform.x);
		this.transform.y = this.intF(p, this.startTransform.y, this.endTransform.y);
		this.transform.scaleY = this.intF(p, this.startTransform.scaleY, this.endTransform.scaleY);
		this.transform.scaleX = this.intF(p, this.startTransform.scaleX, this.endTransform.scaleX);
		this.transform.rotation = this.intF(p, this.startTransform.rotation, this.endTransform.rotation);

		// render
		this.Render.fill = `rgba(${this.intF(p, this.startColor[0], this.endColor[0])}, ${this.intF(p, this.startColor[1], this.endColor[1])}, ${this.intF(p, this.startColor[2], this.endColor[2])}, ${this.intF(p, this.startColor[3], this.endColor[3])})`;

		// render transform
		this.Render.transform.x = this.intF(p, this.startRenderTransform.x, this.endRenderTransform.x);
		this.Render.transform.y = this.intF(p, this.startRenderTransform.y, this.endRenderTransform.y);
		this.Render.transform.scaleY = this.intF(p, this.startRenderTransform.scaleY, this.endRenderTransform.scaleY);
		this.Render.transform.scaleX = this.intF(p, this.startRenderTransform.scaleX, this.endRenderTransform.scaleX);
		this.Render.transform.rotation = this.intF(p, this.startRenderTransform.rotation, this.endRenderTransform.rotation);
	}
}
