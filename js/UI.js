const UI = new function() {
	this.curTool = 'drag'; // drag or cut


	this.settingsPanel = new UI_settingsPanel();
	this.toolPanel = new UI_toolPanel();

}

function UI_toolPanel() {
	const HTML = {
		panel: $('#toolPanel.panel')[0],
		options: $('#toolPanel.panel .option'),
	}

	this.selectTool = function(_tool, _html) {
		document.body.classList.remove(UI.curTool + 'Tool');
		UI.curTool = _tool;
		document.body.classList.add(UI.curTool + 'Tool');

		for (let option of HTML.options) option.classList.remove('selected');
		_html.classList.add('selected');
	}
}

function UI_settingsPanel() {
	const This = this;
	const HTML = {
		panel: $('#settingsPanel.panel')[0],
		speedSlider: $('#settingsPanel.panel #simulationSpeed')[0],
	}
	HTML.speedSlider.addEventListener('input', () => {
		This.setSpeed(Math.pow(10, 2 * HTML.speedSlider.value) * .01 * Simulation.maxSpeed);
	})
	this.setSpeed = function(_speed) {
		Simulation.speed = _speed;
		simulationSpeedLabel.innerHTML = 'Simulation Speed (' + Math.round(_speed * 100) / 100 + ')';
		HTML.speedSlider.value =  Math.log10(_speed / Simulation.maxSpeed * 100) / 2;
	}
}



function $(_query, _parent = document.body){
	return _parent.querySelectorAll(_query);
}
