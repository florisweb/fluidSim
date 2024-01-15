const Renderer = new _Renderer(worldCanvas);
const UI = new _UI();
const CollisionDetector = new _CollisionDetector();


const World = new class {
	size = new Vector(150, 120);
	systems = [
		new System({size: new Vector(50, 100), name: 'Big System'}),
		// new System({size: new Vector(50, 100),  name: 'Small System'})
	];

	setup() {
		Renderer.setup();
		for (let system of this.systems) system.setup();

	}
}






// World.systems[1].addParticle(new Particle({position: new Vector(50, 170), radius: 3}));
// World.systems[0].addParticle(new Particle({position: new Vector(50, 50), radius: 5}));
// World.systems[1].particles[1].applyForce(new Vector(-10000000, -10000000));

for (let x = 0; x < World.systems[0].size.value[0]; x += 5) 
{
	for (let y = 0; y < 50; y += 5) 
	{
		// World.systems[0].addParticle(new Particle({position: new Vector(x + 0, y), radius: .5}));
		World.systems[0].addParticle(new Particle({position: new Vector(x + 0, y), radius: 1}));
		const m = 10000;
		World.systems[0].particles[World.systems[0].particles.length - 1].applyForce(new Vector(m - 2 * m * Math.random(), m - 2 * m * Math.random()));
	}
}



// World.systems[0].particles[0].applyForce(new Vector(1000000, 672000));

World.setup();



