import { linear } from "./../Math.js";

// TODO: test

export class Key {
	/** @type {Number} */
	t = 0;

	/** @type {any} */
	v;

	constructor({ v, t = 0 } = {}) {
		this.v = v;
		this.t = t;
	}
}

export class KeysGroup {
	/** @type {Array<Key>} */
	list = [];
	/* list [
		instances of Key
	] */

	/**
	 * @param {Key[]} keys
	 */
	constructor(keys = []) {
		if (!Array.isArray(keys) || keys.some(v=>!(v instanceof Key))) throw new Error("keys must be an array of the Key instace")
		this.list = keys
	}

	sort() { this.list.sort((p, n)=> p.t - n.t ) }

	add(...keys) {
		keys.forEach(k=>{ if (!(k instanceof Key)) throw new Error("keys must be an instace of the Key class") })
		this.list.push(...keys)
		this.sort()
	}

	getNext(t=0) { return this.list.findIndex(v=>v.t > t) }
	getPrev(t=0) { return this.getPrev(t) - 1 }

	/**
	 * return the value of the key at the given time or create it with a linear interpolation
	 * @param {Number} t
	 * @returns 
	 */
	getV(t=0) {
		let i = this.getNext(t)
		if (i === -1) return this.list[this.list.length - 1].v // last
		else if (i === 0) return this.list[0].v // first
		else {
			// get prev and next key
			let prev = this.list[i - 1]
			let next = this.list[i]

			// linear(v, min, max, vMin, vMax)
			return linear(t, Math.min(prev.v, next.v), Math.max(prev.v, next.v), prev.t, next.t)
		}
	}
}

export class Animation {
	/** @type {KeysGroup} */ keys = new KeysGroup();
	/** @type {Boolean} */ playing = false;
	/** @type {Number} */ time = 0;
	/** @type {Number} */ speed = 1;
	/** @type {Boolean} */ loop = false;

	/**
	 * @param {KeysGroup} keys
	 */
	constructor({ keys = new KeysGroup(), playing = false, speed = 1, loop = false, onFrame = () => {} } = {}) {
		if (!(keys instanceof KeysGroup)) throw new Error("keys must be an instace of the KeysGroup class")
		this.keys = keys
		this.keys.sort()
		this.playing = playing
		this.speed = speed
		this.loop = loop
		this.onFrame = onFrame
	}

	play() { this.playing = true  }
	stop() { this.playing = false }
	start() {
		this.time = 0
		this.play()
	}
	reset() {
		this.time = 0
		this.stop()
	}
	
	update(speed = this.speed) {
		if (this.playing && (this.time += speed) > this.duration) {
			if (this.loop) this.time = 0
			else this.reset()
		}
		this.onFrame(this.time)
	}

	getCurrentV() {
		if (this.playing) return this.keys.getV(this.time)
		else return this.keys.getV(0)
	}

	get value() { return this.getCurrentV() }
	get duration() { return this.keys.list[this.keys.list.length - 1].t }
}


