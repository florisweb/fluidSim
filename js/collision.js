

class _CollisionDetector {

	resolveCollisions(_dt) {
		for (let x = 0; x < World.grid.length; x++) 
		{
			for (let y = 0; y < World.grid[x].length; y++) 
			{
				let particles = World.grid.getParticlesByXY(x, y);
				if (particles.length < 2) continue;
				this.resolveCollisionSet(particles, _dt);
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
				let dPos = particle1.position.difference(particle2.position);
				let length = dPos.getLength();
				if (length === 0) {
					const errorMargin = 0.01;
					dPos = new Vector(errorMargin - 2 * errorMargin * Math.random(), errorMargin - 2 * errorMargin * Math.random());
					length = dPos.getLength();
				}
				

				let deltaLength = particle1.radius + particle2.radius - length;
				if (deltaLength < 0) continue;

				let normalVector = dPos.copy();//.scale(1 / length);
				let projA = normalVector.getProjection(particle1.velocity);
				let projB = normalVector.getProjection(particle2.velocity);

				const mTot = particle1.mass + particle2.mass;
				let velocityA = projA.copy().scale((particle1.mass - particle2.mass) / mTot).add(projB.copy().scale(particle2.mass * 2 / mTot));
				let velocityB = projB.copy().scale((particle2.mass - particle1.mass) / mTot).add(projA.copy().scale(particle1.mass * 2 / mTot));

				let forceA = projA.difference(velocityA).scale(particle1.mass / _dt);
				let forceB = projB.difference(velocityB).scale(particle2.mass / _dt);
				if (isNaN(forceA.value[0])) debugger;
				if (isNaN(forceB.value[0])) debugger;
				particle1.applyForce(forceA);
				particle2.applyForce(forceB);

				let displacement = dPos.copy().scale(1 / length * deltaLength)
				particle1.position.add(displacement.copy().scale(-particle2.mass / mTot));
				particle2.position.add(displacement.copy().scale(particle1.mass / mTot));


				// Renderer.drawVector({start: particle1.position, delta: projA.copy().scale(1), color: '#00f'});
				// Renderer.drawVector({start: particle2.position, delta: projB.copy().scale(1), color: '#0f0'});
			}
		}
	}
}