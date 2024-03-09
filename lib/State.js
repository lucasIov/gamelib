import { Transform } from './modules/Transform.js';

/**
 * @property {object} keys - keys pressed (undefined | false = not pressed, true = pressed)
 * @property {object} mouse - mouse position and buttons pressed
 * @property {number} width - width of the canvas
 * @property {number} height - height of the canvas
 * @property {number} frame - actual frame number
 * @property {objectGroup} objects - objects in the game that can be updated and rendered
 * @property {Camera} camera - the camera used to move the rendering
 * @property {CanvasRenderingContext2D} ctx - the canvas context
 * 
 * @property {number} lastFrame - the time of the last rendered frame
 * @property {number} deltaTime - the time between the last two frames
 * 
 * @method init - initialize the state (event listeners)
 * @method render - render the game objects
 * @method update - update the game objects
 * @method RAFrame - the main loop of the game
 * 
 * @event init - after the state is initialized (called by init method)
 * @event render - after the rendering (called by render method)
 * @event update - after the update (called by update method)
 *
 * state is a global object that contains the state of the game:
 * - the keys pressed
 * - the mouse position
 * - the mouse buttons pressed
 * - the game objects
 * - the camera
 */
export class State extends EventTarget {
	keys = {}; // keys pressed (undefined | false = not pressed, true = pressed)
	mouse = {
		x: 0,
		y: 0,
		buttons: {
			left: false,
			right: false,
			middle: false
		},
		get down() { return this.buttons.left || this.buttons.right || this.buttons.middle; },
	};
	width = 0; // width of the canvas
	height = 0; // height of the canvas
	frame = 0; // frame number
	objects = new namedGroup(); // objects in the game
	camera = new Camera();
	pause = false;
	ctx = null; // canvas context

	// time
	lastFrame = new Date();
	deltaTime = 0;
	calcDeltaTime() { this.deltaTime = new Date() - this.lastFrame; }

	constructor({ canvas, width = 0, height = 0, ctx, objects = new namedGroup(), camera = new Camera() } = {}) {
		super();
		this.canvas  = canvas;
		this.width   = canvas ? canvas.width : width;
		this.height  = canvas ? canvas.height : height;
		this.ctx     = canvas ? canvas.getContext('2d') : ctx;
		this.objects = objects
		this.camera  = camera;
	}

	init() {
		window.addEventListener('keydown', e => this.keys[e.key.toLowerCase()] = true);
		window.addEventListener('keyup', e => this.keys[e.key.toLowerCase()] = false);
		window.addEventListener('mousemove', e => {
			this.mouse.x = e.clientX;
			this.mouse.y = e.clientY;
		});
		window.addEventListener('mousedown', e => {
			if (e.buttons & 1) this.mouse.buttons.left = true;
			if (e.buttons & 2) this.mouse.buttons.right = true;
			if (e.buttons & 4) this.mouse.buttons.middle = true;
		});
		window.addEventListener('mouseup', e => {
			if (!(e.buttons & 1)) this.mouse.buttons.left = false;
			if (!(e.buttons & 2)) this.mouse.buttons.right = false;
			if (!(e.buttons & 4)) this.mouse.buttons.middle = false;
		});

		if (this.canvas) {
			// this.canvas.addEventListener('contextmenu', e => e.preventDefault());
			window.addEventListener('resize', e => {
				this.width  = this.canvas.width  = window.innerWidth;
				this.height = this.canvas.height = window.innerHeight;
			});
		}

		this.dispatchEvent(new Event('init'));
	}

	render() {
		this.frame++
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.objects.render(this.ctx, this.camera.transform);
		this.dispatchEvent(new Event('render'));
	}

	update() {
		this.objects.update({ state: this });
		this.dispatchEvent(new Event('update'));
	}

	RAFrame = () => {
		if (this.pause) {
			this.dispatchEvent(new Event('pause'));
			return requestAnimationFrame(this.RAFrame);
		}
		this.calcDeltaTime();
		this.update();
		this.render();
		requestAnimationFrame(this.RAFrame);
	}
}

export class Camera {
	transform = new Transform();

	realize(trns) { return this.transform.clone().add(trns); }

	constructor(trn = new Transform()) {
		this.transform = trn;
	}
}

export class objectGroup {
	/** @type {boolean} */ needUpdate = true;
	/** @type {boolean} */ needRender = true;

	hide(name) {}
	show(name) {}

	add(name, obj) {}
	remove(name) {}

	constructor(children) {}

	/** @type {number} */
	get length() { return 0; }
	update({state, name, selfRemove}) {}
	render(ctx, trns) {}
}

export class namedGroup extends objectGroup {
	needUpdate = true;
	needRender = true;

	hide(name) { this[name].hidden = true; }
	show(name) { this[name].hidden = false; }

	add(name, obj) {
		this[name] = obj;
		return name;
	}
	remove(name) { delete this[name]; }
	get(name) { return this[name]; }

	constructor(children = {}) {
		super();
		for (let o in children) this[o] = children[o];
	}

	/** @type {number} */
	get length() { return Object.keys(this).length; }

	/** @type {State} */
	update({state, name, selfRemove}) {
		for (let o in this) {
			let obj = this[o];
			if (typeof obj === 'object' && typeof obj.update === 'function' && obj.needUpdate !== false) obj.update({
				state,
				name: o,
				selfRemove: () => this.remove(o),
			})
		}
	}

	/** @type {CanvasRenderingContext2D} */
	render(ctx, trns) {
		for (let o in this) {
			let obj = this[o];
			if (typeof obj === 'object' && typeof obj.render === 'function' && obj.needRender !== false) obj.render(ctx, trns)
		}
	}
}

export class unamedGroup extends objectGroup {
	children = [];
	needUpdate = true;
	needRender = true;

	hide(i) { this.children[i].hidden = true; }
	show(i) { this.children[i].hidden = false; }

	add(obj) { return this.children.push(obj) - 1; }
	remove(i) { this.children.splice(i, 1); }
	get(i) { return this.children[i]; }

	constructor(children = []) {
		super();
		this.children = children;
	}

	/** @type {number} */
	get length() { return this.children.length; }

	/** @type {State} */
	update({ state }) {
		for (let o in this.children) {
			let obj = this.children[o];
			if (typeof obj === 'object' && typeof obj.update === 'function' && obj.needUpdate !== false) obj.update({
				state,
				name: o,
				selfRemove: () => this.remove(o),
			})
		}
	}

	/** @type {CanvasRenderingContext2D} */
	render(ctx, trns) {
		for (let o in this.children) {
			let obj = this.children[o];
			if (typeof obj === 'object' && typeof obj.render === 'function' && obj.needRender !== false) obj.render(ctx, trns)
		}
	}
}
