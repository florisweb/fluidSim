


class _Renderer
{
	settings = {
		showForces: false
	}
	canvas;
	ctx;
	camera;


	constructor(_canvas) {
		this.canvas = _canvas;
		this.ctx = this.canvas.getContext('2d');
		this.ctx.circle = function(_x, _z, _radius) {
			this.beginPath();
			this.arc(_x, _z, _radius, 0, 2 * Math.PI);
		}

		this.camera = new _Renderer_camera(_canvas);
	}
	setup() {
		window.onresize();
		this.render();
	}

	render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let system of World.systems) this.renderSystem(system);
		requestAnimationFrame(() => this.render());
	}

	renderSystem(_system) {
		let topLeft = this.camera.worldToPxCoord(new Vector(0, 0), _system);
		let bottomRight = this.camera.worldToPxCoord(_system.size, _system);
		let delta = topLeft.difference(bottomRight);

		this.ctx.strokeStyle = '#ccc';
		this.ctx.fillStyle = '#fff';
		this.ctx.beginPath();
		this.ctx.rect(topLeft.value[0], topLeft.value[1], delta.value[0], delta.value[1]);
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.fill();


		let topTextPos = topLeft.add(new Vector(delta.value[0] / 2, 0));
		this.ctx.fillStyle = '#777';
		this.ctx.font = "15px Arial";
		this.ctx.textBaseline = 'bottom';
		this.ctx.textAlign = 'center';
		this.ctx.beginPath();
		this.ctx.fillText('< ' + _system.name + ' >', topTextPos.value[0], topTextPos.value[1] - 5);
		this.ctx.closePath();
		this.ctx.fill();

		let bottomTextPos = topTextPos.add(new Vector(1, delta.value[1]));
		this.ctx.fillStyle = '#aaa';
		this.ctx.font = "13px Arial";
		this.ctx.textBaseline = 'top';
		this.ctx.textAlign = 'center';
		this.ctx.beginPath();
		this.ctx.fillText('Area: ' + _system.size.value[0] * _system.size.value[1] + 'm^2', bottomTextPos.value[0], bottomTextPos.value[1] + 5);
		this.ctx.closePath();
		this.ctx.fill();


		for (let particle of _system.particles) this.#drawParticle(particle, _system);
	}




	#drawParticle(_particle, _system) {
		const pxRadius = _particle.radius * this.camera.getPxToWorldScalar();
		let pos = this.camera.worldToPxCoord(_particle.position, _system);
		// this.ctx.fillStyle = '#555';
		let log = Math.log(_particle.velocity.getSquaredLength());
		this.ctx.fillStyle = 'rgb(' + (log * 15) + ', ' + (255 - log * 15) + ', ' + (_particle.radius / 4 * 255) + ')';

		this.ctx.beginPath();
		this.ctx.circle(pos.value[0], pos.value[1], pxRadius);
		this.ctx.closePath();
		this.ctx.fill();

		if (!this.settings.showForces) return;
		this.drawVector({start: _particle.position, delta: _particle.velocity, color: '#f00'});
	}



	drawVector({start, delta, color = '#f00'}) {
		let posA = this.camera.worldToPxCoord(start);
		let posB = this.camera.worldToPxCoord(start.copy().add(delta));

		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = 2;
		this.ctx.beginPath()
		this.ctx.moveTo(posA.value[0], posA.value[1]);
		this.ctx.lineTo(posB.value[0], posB.value[1]);
		this.ctx.closePath();
		this.ctx.stroke();
		this.ctx.lineWidth = 1;
	}
}





class _Renderer_camera {
	#canvas;
	#PxToWorld;
	#WorldToPx;
	
	constructor(_canvas) {
		this.#canvas = _canvas;
		window.onresize = () => this.onResize();
	}
	
	onResize() {
		const pxMargin = new Vector(20, 20);
		this.#canvas.width = this.#canvas.offsetWidth;
		this.#canvas.height = this.#canvas.offsetHeight;


		this.#PxToWorld = this.#canvas.height / World.size.value[1];
		this.#WorldToPx = 1 / this.#PxToWorld;
		World.size.value[0] = this.#WorldToPx * this.#canvas.width;

		World.systems[0].position = World.size.copy().add(World.systems[0].size.copy().scale(-1)).scale(.5);
		World.systems[0].position.value[0] = 10;
		// World.systems[1].position = World.systems[0].position.copy().add(new Vector(110, 0));
	}

	getPxToWorldScalar() {
		return this.#PxToWorld;
	}

	worldToPxCoord(_coord, _system) {
		return _coord.copy().add(_system.position).scale(this.#PxToWorld)
	}
	pxToWorldCoord(_coord, _system) {
		return _coord.copy().scale(this.#WorldToPx).add(_system.position.copy().scale(-1));
	}
}
