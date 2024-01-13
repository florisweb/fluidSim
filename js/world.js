const Renderer = new _Renderer(worldCanvas);
const UI = new _UI();
const CollisionDetector = new _CollisionDetector();


const World = new class {
	size = new Vector(150, 120);
	systems = [
		new System({size: new Vector(100, 100), name: 'Big System'}),
		// new System({size: new Vector(50, 100),  name: 'Small System'})
	];

	setup() {
		Renderer.setup();
		for (let system of this.systems) system.setup();

	}
}






// World.systems[1].addParticle(new Particle({position: new Vector(50, 170), radius: 3}));
// World.systems[1].addParticle(new Particle({position: new Vector(100, 170), radius: 5}));
// World.systems[1].particles[1].applyForce(new Vector(-10000000, -10000000));

for (let x = 0; x < World.systems[0].size.value[0]; x += 5) 
{
	for (let y = 0; y < 50; y += 5) 
	{
		World.systems[0].addParticle(new Particle({position: new Vector(x + 0, y), radius: .5 + Math.random() * .5}));
	}
}


World.setup();



