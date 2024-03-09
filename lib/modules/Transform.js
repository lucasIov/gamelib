export class Point {
	x; y;
	constructor({ x = 0, y = 0 } = {}) {
		this.x = x;
		this.y = y;
	}

	translade({ x = 0, y = 0 } = {}) {
		this.x += x;
		this.y += y;
		return this;
	}

	clone(p = {}) {
		return new Point({ x: p.x || this.x, y: p.y || this.y });
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
		scale = 1,
		rotation = 0
	} = {}) {
		super({ x, y });
		this.scaleX = scaleX;
		this.scaleY = scaleY;
		this.rotation = rotation;
		if (scale !== 1) this.scale = scale;
	}

	/** @param {number} scale */
	set scale(scale) { this.scaleX = this.scaleY = scale; }

	// === movements ===
	/**
	 * @param {Transform} trn
	 * @param {number} trn.x
	 * @param {number} trn.y
	 * @param {number} trn.rotation
	 */
	rotateArround({ x = 0, y = 0, rotation = 0} = {}) {
		this.x = x + this.x * Math.cos(rotation) - this.y * Math.sin(rotation);
		this.y = y + this.x * Math.sin(rotation) + this.y * Math.cos(rotation);
		this.rotation += rotation;
		return this;
	}

	/** @param {number} v distance */
	moveFoward(v) {
		this.x += v * Math.cos(this.rotation);
		this.y += v * Math.sin(this.rotation);
		return this;
	}

	/** @param {number} v distance */
	moveBackward(v) {
		this.x -= v * Math.cos(this.rotation);
		this.y -= v * Math.sin(this.rotation);
		return this;
	}

	/** @param {number} v distance */
	moveLeft(v) {
		this.x += v * Math.sin(this.rotation);
		this.y -= v * Math.cos(this.rotation);
		return this;
	}

	/** @param {number} v distance */
	moveRight(v) {
		this.x -= v * Math.sin(this.rotation);
		this.y += v * Math.cos(this.rotation);
		return this;
	}

	/**
	 * compute
	 * 	x, y translation, rotation and scale 
	 *  rotation
	 * @param {Transform} trn
	 */
	apply(trn) {
		this.x *= (this.scaleX *= trn.scaleX);
		this.y *= (this.scaleY *= trn.scaleY);
		if (trn.rotation !== 0) {
			// 2D rotation matrix
			const cos = Math.cos(trn.rotation);
			const sin = Math.sin(trn.rotation);
			const x = this.x;
			const y = this.y;
			this.x = x * cos - y * sin;
			this.y = x * sin + y * cos;
			this.rotation += trn.rotation;
		}
		this.x += trn.x;
		this.y += trn.y;
		return this;
	}

	// === operations ===
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

	// === comparison ===
	/** @param {Transform} trn */
	is(trn) {
		return this.x === trn.x &&
			this.y === trn.y &&
			this.scaleX === trn.scaleX &&
			this.scaleY === trn.scaleY &&
			this.rotation === trn.rotation;
	}

	/** @param {Transform} trn */
	distance(trn) { return Math.sqrt((this.x - trn.x) ** 2 + (this.y - trn.y) ** 2); }

	// === set ===
	/** @param {Transform} trn */
	set(trn) {
		this.x = trn.x;
		this.y = trn.y;
		this.scaleX = trn.scaleX;
		this.scaleY = trn.scaleY;
		this.rotation = trn.rotation;
		return this;
	}

	// === clone ===
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
