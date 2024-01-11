const Renderer = new _Renderer(worldCanvas);
const UI = new _UI();

const World = new class {
	size = new Vector(500, 500);
	speed = 1;
	particles = [];
	grid;

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
		let dt = Math.min((new Date() - this.#prevUpdate) / 1000 * this.speed, .1);

		this.#prevUpdate = new Date();

		// this.collisionDetector.resolveCollisions(dt);
		this.collisionDetector.resolveCollisionSet(this.particles, dt);
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

		// this.grid.assignParticles(this.particles);
	}
}


function WorldGrid() {
	let grid = [];
	const gridSize = 10;
	for (let x = 0; x < World.size.value[0] / gridSize; x++)
	{
		grid[x] = [];
		for (let y = 0; y < World.size.value[1] / gridSize; y++)
		{
			grid[x][y] = [];
		}
	}

	grid.clear = function() {
		for (let x = 0; x < this.length; x++) 
		{
			for (let y = 0; y < this[x].length; y++) this[x][y] = [];
		}
	}
	grid.posToXY = function(_pos) {
		return new Vector(Math.min(Math.floor(_pos.value[0] / gridSize), this.length - 1), Math.min(Math.floor(_pos.value[1] / gridSize), this[0].length - 1));
	}

	grid.assignParticles = function() {
		this.clear();
		for (let p of World.particles)
		{
			let pos = grid.posToXY(p.position);
			this[pos.value[0]][pos.value[1]].push(p);
		}
	}
	grid.getParticlesByXY = function(x, y) {
		let squares = [
			[x - 1, y - 1], [x, y - 1], [x + 1, y - 1], 
			[x - 1, y], [x + 1, y],
			[x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
		];

		let particles = this[x][y];
		for (let coord of squares)
		{
			if (!this[x]) continue;
			if (!this[x][y]) continue;
			particles = particles.concat(this[x][y]);
		}
		return particles;
	}
	grid.getParticlesByPos = function(_pos) {
		let xy = this.posToXY(_pos);
		return this.getParticlesByXY(...xy.value)
	}

	return grid;
}

// World.particles.push(new Particle({position: new Vector(50, 70.2), radius: 5}));
// World.particles.push(new Particle({position: new Vector(100, 70), radius: 20}));
// World.particles[0].velocity = new Vector(0, 0);
// World.particles[1].velocity = new Vector(-30, 0);

for (let x = 0; x < World.size.value[0]; x += 10) 
{
	for (let y = 0; y < 300; y += 20) 
	{
		World.particles.push(new Particle({position: new Vector(x, y), radius: 1}));
	}
}


World.setup();



