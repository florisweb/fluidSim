const Renderer = new _Renderer(worldCanvas);
const UI = new _UI();


const timers = [0, 0, 0, 0];
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
		let start = new Date();

		// let dt = Math.min((new Date() - this.#prevUpdate) / 1000 * this.speed, .1);
		let dt = 0.005;

		this.#prevUpdate = new Date();
		// this.collisionDetector.resolveCollisions(dt); // [34499, 267, 85, 0] = [98.99, 0.77, 0.24]
		this.collisionDetector.resolveCollisionSet(this.particles, dt); // [26264, 261, 102, 0]

		timers[0] += new Date() - start; start = new Date();
		for (let particle of this.particles)
		{
			particle.update(dt);
		}
		timers[1] += new Date() - start; start = new Date();

		let totalEnergy = this.totalEnergy;
		let base = Math.floor(Math.min(Math.log10(totalEnergy) - 2, 12) / 3) * 3;
		const units = ['', 'k', 'M', 'G', 'T'];
		let value = Math.round(totalEnergy / 10**base);


		energyLabel.innerHTML = 'Energy: ' + value + units[base / 3] + 'J';

		this.grid.assignParticles(this.particles);
		timers[2] += new Date() - start;

		setTimeout(() => this.update(), 5);
	}
}


function WorldGrid() {
	let grid = [];
	const gridSize = 50;
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
		// return this[x][y];
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

// World.particles.push(new Particle({position: new Vector(50, 170), radius: 5}));
// World.particles.push(new Particle({position: new Vector(100, 170), radius: 20}));

for (let x = 0; x < World.size.value[0]; x += 50) 
{
	for (let y = 0; y < 100; y += 50) 
	{
		World.particles.push(new Particle({position: new Vector(x, y), radius: 2 }));
	}
}


World.setup();



