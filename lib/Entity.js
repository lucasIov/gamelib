import { Shape } from "./modules/Shape.js";
import { Transform } from "./modules/Transform.js";
import { Render } from "./modules/Render.js";

export class Entity {
	shape = new Shape(); // controle the shape of the object and its interactions with other objects
	transform = new Transform(); // allow the object to be moved and deformed
	Render = new Render(); // allow the object to be rendered

	constructor({ shape = new Shape(), transform = new Transform(), render = new Render(),
		x = 0, y = 0, scale = 1, rotation = 0,
	} = {}) {
		this.shape = shape;
		this.transform = transform;
		if (typeof x === 'number') this.transform.x = x;
		if (typeof y === 'number') this.transform.y = y;
		if (typeof scale === 'number') this.transform.scale = scale;
		if (typeof rotation === 'number') this.transform.rotation = rotation;
		this.Render = render;
		this.Render.shape = this.shape;
		this.Render.transform = this.transform;
	}

	render = (ctx, trns) => this.Render.render(ctx, trns);

	resolveTransform(trns) { return this.transform.clone().add(trns); }

	isInXY({ x, y } = {}) {
		return this.shape.isInXY({
			x: x - this.transform.x,
			y: y - this.transform.y
		});
	}

	isInEntity(e) { return Math.hypot(this.transform.x - e.transform.x, this.transform.y - e.transform.y) < this.shape.r + e.shape.r; }
}
