/**
 * Ressource is used to manage ressources
 * create blob from url
 * - loading, unloading, etc
 */

export class Asset {
	url = '';
	name = '';
	MIME = 'text/plain';
	blob = null;

	constructor({
		url = '',
		name = '',
		MIME = ''
	} = {}) {
		this.url = url;
		this.name = name;
		this.MIME = MIME;
		this.blob = null;
	}
	
	load(init) {
		return new Promise((resolve, reject) => {
			fetch(this.url, init)
				.then(res => {
					if (res.ok) return res.blob();
					throw new Error('Error loading ressource: ' + this.url);
				})
				.then(blob => resolve(this.blob = blob))
				.catch(reject);
		});
	}

	unload() { this.blob = null; }
}

export class Ressources extends Map {
	set(ressource) {
		if (!(ressource instanceof Asset)) throw new Error('Ressource must be an instance of Asset');
		super.set(ressource.name, ressource);
	}

	load(name) {
		if (!this.has(name)) throw new Error('Ressource not found: ' + name);
		return this.get(name).load();
	}

	unload(name) {
		if (!this.has(name)) throw new Error('Ressource not found: ' + name);
		return this.get(name).unload();
	}

	loadAll() { return Promise.all([...this.values()].map(ressource => ressource.load())) }
	unloadAll() { return Promise.all([...this.values()].map(ressource => ressource.unload())) }
}
