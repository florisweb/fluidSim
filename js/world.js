const Renderer = new _Renderer(worldCanvas);
const UI = new _UI();

const World = new class {
	size = new Vector(500, 500);
	speed = 1;
	particles = [];
	collisionDetector;
	constructor() {
		this.collisionDetector = new _CollisionDetector();
	}

	get totalEkin() {
		return this.particles.map((p) => .5 * p.mass * p.velocity.getSquaredLength()).reduce((a, b) => a + b, 0);
	}
	get totalEnergy() {
		return this.particles.map((p) => .5 * p.mass * p.velocity.getSquaredLength() + p.mass * (World.size.value[1] - p.position.value[1]) * Physics.g).reduce((a, b) => a + b, 0);
	}


	setup() {
		Renderer.setup();
		this.update();
	}

	#prevUpdate = new Date();
	update() {
		let dt = (new Date() - this.#prevUpdate) / 1000 * this.speed;
		this.#prevUpdate = new Date();

		this.collisionDetector.resolveCollisions(this.particles, dt);
		for (let particle of this.particles)
		{
			particle.update(dt);
		}

		setTimeout(() => this.update(), 5);

		let totalEnergy = this.totalEnergy;
		let base = Math.floor(Math.min(Math.log10(totalEnergy) - 2, 12) / 3) * 3;
		const units = ['', 'k', 'M', 'G', 'T'];
		let value = Math.round(totalEnergy / 10**base);


		energyLabel.innerHTML = 'Energy: ' + value + units[base / 3] + 'J';
	}
}

// World.particles.push(new Particle({position: new Vector(50, 70.2), radius: 5}));
// World.particles.push(new Particle({position: new Vector(100, 70), radius: 20}));
// World.particles[0].velocity = new Vector(0, 0);
// World.particles[1].velocity = new Vector(-30, 0);

for (let x = 0; x < World.size.value[0]; x += 10) 
{
	for (let y = 0; y < 100; y += 10) 
	{
		World.particles.push(new Particle({position: new Vector(x, y), radius: 1}));
	}
}


World.setup();



