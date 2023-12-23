const Renderer = new _Renderer(worldCanvas);

const World = new class {
	size = new Vector(200, 200);
	particles = [];


	setup() {
		Renderer.setup();
		this.update();
	}

	#prevUpdate = new Date();
	update() {
		let dt = (new Date() - this.#prevUpdate) / 1000;
		this.#prevUpdate = new Date();
		for (let particle of this.particles)
		{
			particle.update(dt);
		}

		requestAnimationFrame(() => this.update());
	}

}


World.particles.push(new Particle());

World.setup();