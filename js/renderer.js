


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

		for (let particle of World.particles) this.#drawParticle(particle);

		requestAnimationFrame(() => this.render());
	}

	#drawParticle(_particle) {
		const pxRadius = _particle.radius * this.camera.getPxToWorldScalar();
		let pos = this.camera.worldToPxCoord(_particle.position);
		this.ctx.fillStyle = '#555';
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





function _Renderer_camera(_canvas) {
	let PxToWorld;
	let WorldToPx;

	window.onresize = function() {
		_canvas.width = _canvas.offsetWidth;
		_canvas.height = _canvas.offsetHeight;
		PxToWorld = _canvas.width / World.size.value[0];
		WorldToPx = 1 / PxToWorld;
		World.size.value[1] = WorldToPx * _canvas.height;
	}

	this.getPxToWorldScalar = function() {
		return PxToWorld;
	}

	this.worldToPxCoord = function(_coord) {
		return _coord.copy().scale(PxToWorld);
	}
	this.pxToWorldCoord = function(_coord) {
		return _coord.copy().scale(WorldToPx);
	}

}