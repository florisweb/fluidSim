class _UI {
	settingsPanel;
	constructor() {
		settingsPanel = new UI_settingsPanel();
	}
}

class UI_settingsPanel {
	HTML = {
		panel: $('#settingsPanel.panel')[0],
		speedSlider: $('#settingsPanel.panel #simulationSpeed')[0],
	}
	constructor() {
		this.HTML.speedSlider.addEventListener('input', () => {
			this.setSpeed(Math.pow(10, 2 * this.HTML.speedSlider.value) * .01 * 10);
		});
	}
	
	
	setSpeed(_speed) {
		World.speed = _speed;
		simulationSpeedLabel.innerHTML = 'Simulation Speed (' + Math.round(_speed * 100) / 100 + ')';
		this.HTML.speedSlider.value =  Math.log10(_speed / 10 * 100) / 2;
	}
}



function $(_query, _parent = document.body){
	return _parent.querySelectorAll(_query);
}
