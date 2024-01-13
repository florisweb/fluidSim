

class System {
	name;
	size = new Vector(500, 500);
	position = new Vector(0, 0);

	particles = [];
	#updateNeighbourRange = 30;


	#running = true;
	get running() {
		return this.#running;
	}
	set running(_running) {
		this.#running = _running;
		if (this.#running) this.update();
	}


	addParticle(_particle) {
		_particle.setSystem(this);
		this.particles.push(_particle);
	}

	constructor({size, name}) {
		this.size = size;
		this.name = name || 'Unnamed system';
	}


	get totalEkin() {
		return this.particles.map((p) => .5 * p.mass * p.velocity.getSquaredLength()).reduce((a, b) => a + b, 0);
	}
	get totalEnergy() {
		return this.particles.map((p) => .5 * p.mass * p.velocity.getSquaredLength() + p.mass * (this.size.value[1] - p.position.value[1]) * Physics.g).reduce((a, b) => a + b, 0);
	}
	get averageVelocity() {
		let velocitySquared = this.particles.map((p) => p.velocity.getSquaredLength()).reduce((a, b) => a + b, 0);
		return Math.sqrt(velocitySquared) / this.particles.length
	}


	setup() {
		this.update();
	}

	updates = 0;
	update() {
		this.updates++;
		let dt = 0.003;

		CollisionDetector.resolveNeighbourCollisions(this, dt);
		for (let particle of this.particles) particle.update(dt);

		
		if (this.running) setTimeout(() => this.update(), 5);		
		if (this.updates % 10 !== 0) return;
		CollisionDetector.updateNeighbourTable(this, this.#updateNeighbourRange**2);
		this.updateMetaData();
	}

	updateMetaData() {
		let totalEnergy = this.totalEkin / this.particles.length;
		let base = Math.floor(Math.min(Math.log10(totalEnergy) - 2, 12) / 3) * 3;
		const units = ['', 'k', 'M', 'G', 'T'];
		let value = Math.round(totalEnergy / 10**base);


		energyLabel.innerHTML = 'Average Ekin: ' + value + units[base / 3] + 'J<br>' + Math.round(this.averageVelocity * 100) / 100 + 'm/s';
	}
}




