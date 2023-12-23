const Renderer = new _Renderer(worldCanvas);

const World = new class {
	size = new Vector(200, 200);
	particles = [];
	collisionDetector;
	constructor() {
		this.collisionDetector = new _CollisionDetector();
	}


	setup() {
		Renderer.setup();
		this.update();
	}

	#prevUpdate = new Date();
	update() {
		let dt = (new Date() - this.#prevUpdate) / 1000;
		this.#prevUpdate = new Date();

		this.collisionDetector.resolveCollisions(this.particles, dt);
		for (let particle of this.particles)
		{
			particle.update(dt);
		}

		setTimeout(() => this.update(), 1);
	}
}

World.particles.push(new Particle({position: new Vector(50, 72), radius: 5}));
World.particles.push(new Particle({position: new Vector(100, 70), radius: 8}));
World.particles[0].velocity = new Vector(0, 0);
World.particles[1].velocity = new Vector(-30, 0);

// for (let i = 0; i < 100; i++) World.particles.push(new Particle({radius: 5}));


World.setup();



