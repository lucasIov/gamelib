export class Point {
	x; y;
	constructor({ x = 0, y = 0 } = {}) {
		this.x = x;
		this.y = y;
	}
}

export class Transform extends Point {
	scaleX;
	scaleY;
	rotation;

	constructor({
		x = 0, y = 0,
		scaleX = 1,
		scaleY = 1,
		rotation = 0
	} = {}) {
		super({ x, y });
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.rotation = rotation;
	}

	/** @param {number} scale */
	set scale(scale) { this.scaleX = this.scaleY = scale; }

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} r
	 */
	rotateArround(x, y, r) {
		this.x = x + this.x * Math.cos(r) - this.y * Math.sin(r);
		this.y = y + this.x * Math.sin(r) + this.y * Math.cos(r);
		this.rotation += r;
	}

	/** @param {number} v distance */
	moveFoward(v) {
		this.x += v * Math.cos(this.rotation);
		this.y += v * Math.sin(this.rotation);
	}

	/** @param {number} v distance */
	moveBackward(v) {
		this.x -= v * Math.cos(this.rotation);
		this.y -= v * Math.sin(this.rotation);
	}

	/** @param {number} v distance */
	moveLeft(v) {
		this.x += v * Math.sin(this.rotation);
		this.y -= v * Math.cos(this.rotation);
	}

	/** @param {number} v distance */
	moveRight(v) {
		this.x -= v * Math.sin(this.rotation);
		this.y += v * Math.cos(this.rotation);
	}

	/** @param {Transform} trn */
	add(trn) {
		this.x += trn.x || 0;
		this.y += trn.y || 0;
		this.scaleX *= trn.scaleX || 1;
		this.scaleY *= trn.scaleY || 1;
		this.rotation += trn.rotation || 0;
		return this;
	}

	/** @param {Transform} trn */
	sub(trn) {
		this.x -= trn.x || 0;
		this.y -= trn.y || 0;
		this.scaleX /= trn.scaleX || 1;
		this.scaleY /= trn.scaleY || 1;
		this.rotation -= trn.rotation || 0;
		return this;
	}

	/** @param {Transform} trn */
	is(trn) {
		return this.x === trn.x &&
			this.y === trn.y &&
			this.scaleX === trn.scaleX &&
			this.scaleY === trn.scaleY &&
			this.rotation === trn.rotation;
	}

	/** @param {Transform} trn */
	set(trn) {
		this.x = trn.x;
		this.y = trn.y;
		this.scaleX = trn.scaleX;
		this.scaleY = trn.scaleY;
		this.rotation = trn.rotation;
	}

	/** @param {Transform} trn */
	distance(trn) { return Math.sqrt((this.x - trn.x) ** 2 + (this.y - trn.y) ** 2); }

	/** @param {Transform} trn */
	clone(trn = {}) {
		return new Transform({
			x: trn.x || this.x,
			y: trn.y || this.y,
			scaleX: trn.scaleX || this.scaleX,
			scaleY: trn.scaleY || this.scaleY,
			rotation: trn.rotation || this.rotation
		})
	}
}
