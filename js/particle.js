class PhysicsEntity {
	position = new Vector(0, 0);
	velocity = new Vector(50, 0);

	update(_dt) {
		this.position.add(this.velocity.copy().scale(_dt));

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
}


class Particle extends PhysicsEntity {
	radius = 3;
	mass;

	constructor() {
		super();
		this.mass = this.radius**3 * 4 / 3 * Math.PI;
	}

	update(_dt) {
		let force = new Vector(0, 0);
		force.add(new Vector(0, Physics.g * this.mass));

		let acceleration = force.scale(1 / this.mass);
		this.velocity.add(acceleration.copy().scale(_dt));
		super.update(_dt);
	}
}







