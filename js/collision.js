

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
		for (let particle of _system.particles) 
		{
			particle.resolved = false;
			particle.collisions = [];
		}

		let collisions = [];
		let collisionSets = [];

		for (let particle of _system.particles)
		{
			for (let other of particle.neighbours)
			{
				if (other.resolved) continue;
				// this.resolveCollision(particle, other, _dt);
				let collision = this.checkForCollision(particle, other);
				if (!collision) continue;
				other.neighbours.find((p) => p === particle).resolved = true;

				collisions.push(collision);
				particle.collisions.push(collision);
				other.collisions.push(collision);


				let foundSet = false;
				for (let set of collisionSets)
				{
					if (!set.particles.map(a => a.id).includes(particle.id) && !set.particles.map(a => a.id).includes(other.id)) continue;
					foundSet = true;
					if (!set.particles.map(a => a.id).includes(particle.id)) set.particles.push(particle);
					if (!set.particles.map(a => a.id).includes(other.id)) set.particles.push(other);
					break;
				}

				if (foundSet) continue;
				collisionSets.push({particles: [particle, other], Ekin: 0});
			}
		}

		for (let set of collisionSets)
		{
			set.Ekin = set.particles.map((p) => p.mass * p.velocity.getSquaredLength()).reduce((a, b) => a + b, 0);
		}


		for (let collision of collisions) this.resolveCollision(collision, _dt);
		for (let particle of _system.particles) particle.update(_dt);
		
		for (let set of collisionSets)
		{
			let newEkin = set.particles.map((p) => p.mass * p.velocity.getSquaredLength()).reduce((a, b) => a + b, 0);

			if (newEkin - set.Ekin === 0) continue;

			let scalar = Math.sqrt(set.Ekin / newEkin);

			for (let particle of set.particles)
			{
				let targetVelocity = particle.velocity.copy().scale(scalar);
				let delta = particle.velocity.difference(targetVelocity);
				particle.applyForce(delta.scale(particle.mass / _dt));
			}
		}
		for (let particle of _system.particles) particle.update(_dt);
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

	checkForCollision(_particle1, _particle2) {
		let dPos = _particle1.position.difference(_particle2.position);
		let length = dPos.getLength();
		if (length === 0) {
			dPos = new Vector(0.00001, 0);
			length = dPos.getLength();
		}
		
		let deltaLength = _particle1.radius + _particle2.radius - length;
		if (deltaLength < 0) return false;

		return {
			length: length,
			normalVector: dPos,
			deltaLength: deltaLength,
			particle1: _particle1,
			particle2: _particle2,
		}
	}

	resolveCollision({length, normalVector, deltaLength, particle1, particle2}, _dt) {
		let projA = normalVector.copy().getProjection(particle1.velocity);
		let projB = normalVector.copy().getProjection(particle2.velocity);

		const mTot = particle1.mass + particle2.mass;
		let velocityA = projA.copy().scale((particle1.mass - particle2.mass) / mTot).add(projB.copy().scale(particle2.mass * 2 / mTot));
		let velocityB = projB.copy().scale((particle2.mass - particle1.mass) / mTot).add(projA.copy().scale(particle1.mass * 2 / mTot));

		let forceA = projA.difference(velocityA).scale(particle1.mass / _dt);
		let forceB = projB.difference(velocityB).scale(particle2.mass / _dt);
		if (isNaN(forceA.value[0])) debugger;
		if (isNaN(forceB.value[0])) debugger;
		particle1.applyForce(forceA);
		particle2.applyForce(forceB);

		let displacement = normalVector.copy().scale(1 / length * deltaLength);
		particle1.displace(displacement.copy().scale(-particle2.mass / mTot));
		particle2.displace(displacement.copy().scale(particle1.mass / mTot));
	}

	// resolveCollision(_particle1, _particle2, _dt) {
	// 	let dPos = _particle1.position.difference(_particle2.position);
	// 	let length = dPos.getLength();
	// 	if (length === 0) {
	// 		dPos = new Vector(0.00001, 0);
	// 		length = dPos.getLength();
	// 	}
		
	// 	let deltaLength = _particle1.radius + _particle2.radius - length;
	// 	if (deltaLength < 0) return;

	// 	let normalVector = dPos.copy();
	// 	let projA = normalVector.getProjection(_particle1.velocity);
	// 	let projB = normalVector.getProjection(_particle2.velocity);

	// 	const mTot = _particle1.mass + _particle2.mass;
	// 	let velocityA = projA.copy().scale((_particle1.mass - _particle2.mass) / mTot).add(projB.copy().scale(_particle2.mass * 2 / mTot));
	// 	let velocityB = projB.copy().scale((_particle2.mass - _particle1.mass) / mTot).add(projA.copy().scale(_particle1.mass * 2 / mTot));

	// 	let forceA = projA.difference(velocityA).scale(_particle1.mass / _dt);
	// 	let forceB = projB.difference(velocityB).scale(_particle2.mass / _dt);
	// 	if (isNaN(forceA.value[0])) debugger;
	// 	if (isNaN(forceB.value[0])) debugger;
	// 	_particle1.applyForce(forceA);
	// 	_particle2.applyForce(forceB);

	// 	let displacement = normalVector.copy().scale(1 / length * deltaLength);
	// 	_particle1.displace(displacement.copy().scale(-_particle2.mass / mTot));
	// 	_particle2.displace(displacement.copy().scale(_particle1.mass / mTot));
	// }
}