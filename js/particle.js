class PhysicsEntity {
	position = new Vector(0, 0);
	prevPos = new Vector(0, 0);
	// velocity = new Vector(10 - Math.random() * 2 * 10, 10 - Math.random() * 2 * 10);
	velocity = new Vector(0, 0);

	constructor({position}) {
		this.position = position || new Vector(Math.random() * World.size.value[0], Math.random() * World.size.value[1]);
	}

	update(_dt) {
		let acceleration = this.nettoForce.scale(1 / this.mass);
		this.nettoForce = new Vector(0, 0);
		this.velocity.add(acceleration.scale(_dt));
		this.prevPos = this.position.copy();
		this.position.add(this.velocity.copy().scale(_dt));
		if (isNaN(this.position.value[0])) {
			console.log(_dt);
			debugger;
		}


		if (this.position.value[0] > World.size.value[0]) 
		{
			this.velocity.value = [-Math.abs(this.velocity.value[0]) * Physics.restitution, this.velocity.value[1]];
			this.position.value[0] = World.size.value[0];
		} else if (this.position.value[0] < 0) 
		{
			this.velocity.value = [Math.abs(this.velocity.value[0]) * Physics.restitution, this.velocity.value[1]];
			this.position.value[0] = 0;
		}
		if (this.position.value[1] > World.size.value[1]) 
		{
			this.velocity.value = [this.velocity.value[0], -Math.abs(this.velocity.value[1]) * Physics.restitution];
			this.position.value[1] = World.size.value[1];
		} else if (this.position.value[1] < 0) 
		{
			this.velocity.value = [this.velocity.value[0], Math.abs(this.velocity.value[1]) * Physics.restitution];
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







