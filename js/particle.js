class PhysicsEntity {
	position = new Vector(0, 0);
	prevDeltaPos = new Vector(0, 0);
	lastDt = 1;
	// velocity = new Vector(10 - Math.random() * 2 * 10, 10 - Math.random() * 2 * 10);
	// velocity = new Vector(0, 0);

	get velocity() {
		return this.prevDeltaPos.copy().scale(1 / this.lastDt);
	}

	constructor({position}) {
		this.position = position || new Vector(Math.random() * World.size.value[0], Math.random() * World.size.value[1]);
	}



	update(_dt) {
		this.lastDt = _dt;
		let acceleration = this.nettoForce.scale(1 / this.mass);
		this.nettoForce = new Vector(0, 0);

 
		let deltaPos = this.prevDeltaPos.copy().add(acceleration.scale(_dt**2));
		this.prevDeltaPos = deltaPos.copy();
		this.position.add(deltaPos);

		if (isNaN(this.position.value[0])) debugger;
		
		// Check for te worlds boundaries
		if (this.position.value[0] > World.size.value[0]) 
		{
			let antiVelocityForce = -Math.abs(this.velocity.value[0]) * this.mass / _dt;
			this.applyForce(new Vector(antiVelocityForce * (1 + Physics.restitution), 0));
			this.position.value[0] = World.size.value[0];
		} else if (this.position.value[0] < 0) 
		{
			let antiVelocityForce = Math.abs(this.velocity.value[0]) * this.mass / _dt;
			this.applyForce(new Vector(antiVelocityForce * (1 + Physics.restitution), 0));
			this.position.value[0] = 0;
		}
		if (this.position.value[1] > World.size.value[1]) 
		{
			let antiVelocityForce = -Math.abs(this.velocity.value[1]) * this.mass / _dt;
			this.applyForce(new Vector(0, antiVelocityForce * (1 + Physics.restitution)));
			this.position.value[1] = World.size.value[1];
		} else if (this.position.value[1] < 0) 
		{
			let antiVelocityForce = Math.abs(this.velocity.value[1]) * this.mass / _dt;
			this.applyForce(new Vector(0, antiVelocityForce * (1 + Physics.restitution)));
			this.position.value[1] = 0;
		}
	}


	nettoForce = new Vector(0, 0);
	applyForce(_force) {
		this.nettoForce.add(_force);
	}
}


class Particle extends PhysicsEntity {
	radius = 3;
	mass;

	constructor({position, radius}) {
		super({position: position});
		this.radius = radius || 3;
		this.mass = this.radius**3 * 4 / 3 * Math.PI;
	}

	update(_dt) {
		this.applyForce(new Vector(0, Physics.g * this.mass));
		super.update(_dt);
	}
}







