export class Shape {
	/**
	 * @brief Checks if the HitBox is in another HitBox
	 * @param {Shape} hB the other HitBox
	 * @returns {Boolean} if the HitBox is in or not
	 */
	isInBox(hB) {}

	/**
	 * @brief Checks if the HitBox is in a position
	 * @param {Number} x
	 * @param {Number} y
	 * @returns {Boolean} if the pos is in the box or not
	 */
	isInXY({ x, y } = {}) {}
}

export class Rect extends Shape {
	w; h;

	constructor({ w = 10, h = 10 } = {}) {
		super()
		this.w = w
		this.h = h
	}

	/**
	 * @brief Checks if the HitBox is in a position
	 * @param {Shape} hB the other HitBox
	 * @returns {Boolean} if the HitBox is in or not
	 */
	isInBox(hB) {
		if (hB instanceof Rect) return (
			(this.w > hB.w && this.h > hB.h) ||
			(this.w > hB.w && this.h > hB.h)
		)
		if (hB instanceof Arc) return Math.hypot(this.w, this.h) < hB.r;
	}

	/**
	 * @brief Checks if the HitBox is in a position
	 * @param {Number} x
	 * @param {Number} y
	 * @returns {Boolean} if the pos is in the box or not
	 */
	isInXY({ x, y } = {}) {
		return (
			(x > 0 && x < this.w) ||
			(y > 0 && y < this.h)
		)
	}
}

export class Arc extends Shape {
	r;

	constructor({ r = 10 } = {}) {
		super()
		this.r = r
	}

	/**
	 * @param {Shape} hB the other HitBox
	 * @returns {Boolean} if the HitBox is in or not
	 * TODO: TEST
	 */
	isInBox(hB) {
		if (hB instanceof Arc) return Math.hypot(this.r, hB.r) < hB.r;
		if (hB instanceof RectHitBox) return (
			(this.r > hB.w && this.r > hB.h) ||
			(this.r > hB.w && this.r > hB.h)
		)
	}

	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @returns {Boolean} if the pos is in the box or not
	 */
	isInXY = ({ x, y } = {}) => Math.hypot(x, y) < this.r;
}

export class Line extends Shape {
	/** @type {Number} */ x1;
	/** @type {Number} */ y1;
	/** @type {Number} */ x2;
	/** @type {Number} */ y2;

	constructor({ x1 = 0, y1 = 0, x2 = 10, y2 = 10 } = {}) {
		super()
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
	}
}

export class Path extends Shape {
	/** @type {Point[]} */
	points = [];

	/**
	 * @param {Point[]} points
	 */
	constructor(points = []) {
		super()
		this.points = points
	}
}

export class complexShape extends Shape {
	/** @type {Shape[]} */
	shapes = [];

	/**
	 * @param {Shape[]} shapes
	 */
	constructor(shapes = []) {
		super()
		this.shapes = shapes
	}

	/**
	 * @param {Shape} hB the other HitBox
	 * @returns {Boolean} if the HitBox is in or not
	 */
	isInBox(hB) { return this.shapes.some(s => s.isInBox(hB)) }

	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @returns {Boolean} if the pos is in the box or not
	 */
	isInXY({ x, y } = {}) { return this.shapes.some(s => s.isInXY({ x, y })) }
}
