import { Math } from "./../Math.js";

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
	#list = [];
	/* list [
		instances of Key
	] */

	get list() { return this.#list }

	sort() { this.#list.sort((p, n)=> p.v - n.v ) }

	add(...keys) {
		keys.forEach(k=>{ if (!(k instanceof Key)) throw new Error("keys must be an instace of the Key class") })
        this.#list.push(...keys)
		this.sort()
	}

    getNext(t=0) { return this.#list.findIndex(v=>v.t > t) }
    getPrev(t=0) { return this.getPrev(t) - 1 }

    /**
     * return the value of the key at the given time or create it with a linear interpolation
     * @param {Number} t
     * @returns 
     */
    getV(t=0) {
        let i = this.getNext(t)
        if (i === -1) return this.#list[this.#list.length - 1].v // last
        else if (i === 0) return this.#list[0].v // first
        else {
            // get prev and next key
            let prev = this.#list[i - 1]
            let next = this.#list[i]

            // Math.linear(v, min, max, vMin, vMax)
            return Math.linear(t, Math.min(prev.v, next.v), Math.max(prev.v, next.v), prev.t, next.t)
        }
    }
}


