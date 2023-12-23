

class _CollisionDetector {

	constructor() {

	}

	resolveCollisions(_particles, _dt) {
		for (let p1 = 0; p1 < _particles.length; p1++) 
		{
			for (let p2 = p1 + 1; p2 < _particles.length; p2++) 
			{
				let particle1 = _particles[p1];
				let particle2 = _particles[p2];
				let dPos = particle1.position.difference(particle2.position);
				let length = dPos.getLength();
				let deltaLength = particle1.radius + particle2.radius - length;
				if (deltaLength < 0) continue;

				let normalVector = dPos;//.scale(1 / length);
				let projA = normalVector.getProjection(particle1.velocity);
				let projB = normalVector.getProjection(particle2.velocity);

				const mTot = particle1.mass + particle2.mass;
				let velocityA = projA.copy().scale((particle1.mass - particle2.mass) / mTot).add(projB.copy().scale(particle2.mass * 2 / mTot));
				let velocityB = projB.copy().scale((particle2.mass - particle1.mass) / mTot).add(projA.copy().scale(particle1.mass * 2 / mTot));
				let scalar = Physics.restitution;

				particle1.velocity = (velocityA.copy().scale(scalar));
				particle2.velocity = (velocityB.copy().scale(scalar));

				// Renderer.drawVector({start: particle1.position, delta: projA.copy().scale(1), color: '#00f'});
				// Renderer.drawVector({start: particle2.position, delta: projB.copy().scale(1), color: '#0f0'});
			}
		}
	}
}