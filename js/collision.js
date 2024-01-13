

class _CollisionDetector {
	resolveCollisions(_dt) {
		let curUpdate = Math.random() * 1000000;
		let checked = 0;
		let resolveals = 0;
		for (let particle of World.particles)
		{
			if (particle.lastUpdate === curUpdate) continue;
			checked++;
			let xy = World.grid.posToXY(particle.position);
			let particles = World.grid.getParticlesByXY(xy.value[0], xy.value[1]);
			if (particles.length < 2) continue;
			resolveals += particles.length;
			this.resolveCollisionSet(particles, _dt);
			for (let p of particles) p.lastUpdate = curUpdate;
		}
		// console.log(checked / World.particles.length, resolveals / World.particles.length);

		// for (let x = 0; x < World.grid.length; x++) 
		// {
		// 	for (let y = 0; y < World.grid[x].length; y++) 
		// 	{
		// 		let particles = World.grid.getParticlesByXY(x, y);
		// 		if (particles.length < 2) continue;
		// 		this.resolveCollisionSet(particles, _dt);
		// 	}
		// }
	}

	resolveNeighbourCollisions(_system, _dt) {
		for (let particle of _system.particles) particle.resolved = false;

		for (let particle of _system.particles)
		{
			for (let other of particle.neighbours)
			{
				if (other.resolved) continue;
				this.resolveCollision(particle, other, _dt);
				other.neighbours.find((p) => p === particle).resolved = true;
			}
		}
	}


	updateNeighbourTable(_system, _rangeSquared) {
		for (let particle of _system.particles) particle.neighbours = [];

		for (let p1 = 0; p1 < _system.particles.length; p1++) 
		{
			for (let p2 = p1 + 1; p2 < _system.particles.length; p2++) 
			{
				let particle1 = _system.particles[p1];
				let particle2 = _system.particles[p2];
				let delta = particle1.position.difference(particle2.position);
				let distanceSq = delta.getSquaredLength();
				if (distanceSq > _rangeSquared) continue;
				particle1.neighbours.push(particle2);
				particle2.neighbours.push(particle1);
			}
		}
	}


	resolveCollisionSet(_particles, _dt) {
		for (let p1 = 0; p1 < _particles.length; p1++) 
		{
			for (let p2 = p1 + 1; p2 < _particles.length; p2++) 
			{
				let particle1 = _particles[p1];
				let particle2 = _particles[p2];
				this.resolveCollision(particle1, particle2);
			}
		}
	}

	resolveCollision(_particle1, _particle2, _dt) {
		let dPos = _particle1.position.difference(_particle2.position);
		let length = dPos.getLength();
		if (length === 0) {
			const errorMargin = 0.01;
			dPos = new Vector(errorMargin - 2 * errorMargin * Math.random(), errorMargin - 2 * errorMargin * Math.random());
			length = dPos.getLength();
		}
		
		let deltaLength = _particle1.radius + _particle2.radius - length;
		if (deltaLength < 0) return;

		let normalVector = dPos.copy();
		let projA = normalVector.getProjection(_particle1.velocity);
		let projB = normalVector.getProjection(_particle2.velocity);

		const mTot = _particle1.mass + _particle2.mass;
		let velocityA = projA.copy().scale((_particle1.mass - _particle2.mass) / mTot).add(projB.copy().scale(_particle2.mass * 2 / mTot));
		let velocityB = projB.copy().scale((_particle2.mass - _particle1.mass) / mTot).add(projA.copy().scale(_particle1.mass * 2 / mTot));

		let forceA = projA.difference(velocityA).scale(_particle1.mass / _dt);
		let forceB = projB.difference(velocityB).scale(_particle2.mass / _dt);
		if (isNaN(forceA.value[0])) debugger;
		if (isNaN(forceB.value[0])) debugger;
		_particle1.applyForce(forceA);
		_particle2.applyForce(forceB);

		let displacement = dPos.copy().scale(1 / length * deltaLength)
		_particle1.position.add(displacement.copy().scale(-_particle2.mass / mTot));
		_particle2.position.add(displacement.copy().scale(_particle1.mass / mTot));
	}
}