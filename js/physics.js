const Physics = new class {
	// g = 9.81;
	g = 98.1;
	restitution = 1;

	Kb = 1.380649 * 10**-23;
	Na = 6.02214076 * 10**23;
	R = this.Kb * this.Na;

	EkinToTemp(_energy) {
		return _energy * 2 / 3 / this.R;
	}
	tempToEkin(_temp) {
		return _temp * this.R /2 * 3;
	}

}