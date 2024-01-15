

class System {
	name;
	size = new Vector(500, 500);
	position = new Vector(0, 0);

	particles = [];
	#updateNeighbourRange = 30;


	config = {
		gravity: false,
		wrapParticles: false,
		dt: 0.003
	}


	#running = true;
	get running() {
		return this.#running;
	}
	set running(_running) {
		if (!this.#running) {
			this.#running = true;
			this.update();
		}
		this.#running = _running;
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
	get temperature() {
		return Physics.EkinToTemp(this.totalEkin / this.particles.length);
	}
	set temperature(_newTemp) {
		return this.setTemperature(_newTemp);
	}


	setup() {
		this.update();
	}

	updates = 0;
	update() {
		this.step();
		if (this.running) setTimeout(() => this.update(), 5);
	}


	wallBounces = [];

	step() {
		this.updates++;

		CollisionDetector.resolveNeighbourCollisions(this, this.config.dt);

		for (let particle of this.particles) particle.update(this.config.dt);


		if (this.updates % 10 !== 0) return;
		CollisionDetector.updateNeighbourTable(this, this.#updateNeighbourRange**2);
		this.updateMetaData();

	}

	updateMetaData() {
		let totalEnergy = this.totalEkin / this.particles.length;
		let base = Math.max(Math.floor(Math.min(Math.log10(totalEnergy) - 2, 12) / 3) * 3, 0);
		const units = ['', 'k', 'M', 'G', 'T'];
		let value = Math.round(totalEnergy / 10**base);


		energyLabel.innerHTML = `Ekin: ` + value + units[base / 3] + `J<br>` + 
								'Velocity: ' + Math.round(this.averageVelocity * 100) / 100 + 'm/s<br>' + 
								'Temp: ' + Math.round(Physics.EkinToTemp(totalEnergy) * 100) / 100 + 'K';
	}



	setTemperature(_T) {
		let targetEnergy = Physics.tempToEkin(_T) * this.particles.length;
		let actualEnergy = this.totalEkin;
		let scalar = Math.sqrt(targetEnergy / actualEnergy);

		for (let particle of this.particles)
		{
			let targetVelocity = particle.velocity.copy().scale(scalar);
			let delta = particle.velocity.difference(targetVelocity);
			particle.applyForce(delta.scale(particle.mass / this.config.dt));
		}
	}
}




