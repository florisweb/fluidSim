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




// Bugs: 
// - creates energy upon bouncing with wall AND other particle
// - creates energy upon bouncing with itself? (three particles at once)


// for (let x = 0; x < World.systems[0].size.value[0]; x += 15) 
// {
	// World.systems[0].addParticle(new Particle({position: new Vector(x + 5, 50), radius: 3}));
	// World.systems[0].addParticle(new Particle({position: new Vector(70, 50), radius: 5}));
	// World.systems[0].addParticle(new Particle({position: new Vector(90, 50), radius: 7}));
// }



// 3 particle collision
// let p1 = new Particle({position: new Vector(10, 50), radius: 3});
// let p2 = new Particle({position: new Vector(50, 50), radius: 3});
// let p3 = new Particle({position: new Vector(50, 10), radius: 3});
// p3.applyForce(new Vector(0, 1000000));
// p1.applyForce(new Vector(1000000, 0));

// World.systems[0].addParticle(p1);
// World.systems[0].addParticle(p3);
// World.systems[0].addParticle(p2);


// let p1 = new Particle({position: new Vector(10, 50), radius: 3});
// let p2 = new Particle({position: new Vector(50, 50), radius: 3});
// let p3 = new Particle({position: new Vector(50, 10), radius: 3});
// let p4 = new Particle({position: new Vector(50, 90), radius: 3});

// p3.applyForce(new Vector(0, 1000000));
// p4.applyForce(new Vector(0, -1000000));
// p1.applyForce(new Vector(1000000, 0));


// World.systems[0].addParticle(p1);
// World.systems[0].addParticle(p2);
// World.systems[0].addParticle(p3);
// World.systems[0].addParticle(p4);





// World.systems[0].addParticle(new Particle({position: new Vector(20, 20), radius: 3}));
// World.systems[0].addParticle(new Particle({position: new Vector(50, 50), radius: 3}));
// World.systems[0].particles[0].applyForce(new Vector(1000000, 1000000));






// World.systems[0].particles[2].applyForce(new Vector(-100000000, 0));

setTimeout(() => World.systems[0].temperature = 10, 10);

for (let x = 0; x < World.systems[0].size.value[0]; x += 5) 
{
	for (let y = 0; y < 50; y += 5) 
	{
		// World.systems[0].addParticle(new Particle({position: new Vector(x + 0, y), radius: .5}));
		World.systems[0].addParticle(new Particle({position: new Vector(x + 0, y), radius: .5}));
		const m = 100;
		World.systems[0].particles[World.systems[0].particles.length - 1].applyForce(new Vector(m - 2 * m * Math.random(), m - 2 * m * Math.random()));
	}
}



// World.systems[0].particles[0].applyForce(new Vector(1000000, 672000));

World.setup();



