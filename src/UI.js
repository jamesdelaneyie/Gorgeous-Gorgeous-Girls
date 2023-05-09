let controlPanel = document.createElement("div")
controlPanel.setAttribute("id", "control-panel")
document.body.appendChild(controlPanel)


const addFXHashValues = () => {
	const fxhashDiv = document.createElement("div")
	fxhashDiv.innerHTML = `fxHash: <span>${fxhash}</span>`
    fxhashDiv.setAttribute("id", "fxhash");
    //\n\npseudo random values:\n[\n\t${fxrand()},\n\t${fxrand()},\n\t${fxrand()},\n\t${fxrand()}\n]`;
    controlPanel.appendChild(fxhashDiv);
}

const addRenderTime = (startTime) => {
	const endTime = Date.now()
	const renderTime = (endTime - startTime) / 1000

	//if renderTime div already exists, update it
	if(document.getElementById("renderTime")) {
		let renderTimeDiv = document.getElementById("renderTime")
		renderTimeDiv.innerHTML = "Initial render time: " + renderTime + " seconds"
	} else {
		const renderTimeDiv = document.createElement("div")
		renderTimeDiv.innerHTML = "Initial render time: " + renderTime + " seconds"
		renderTimeDiv.setAttribute("id", "renderTime")
		controlPanel.appendChild(renderTimeDiv)
	}
	
}

const addColorSwatchButton = () => {
	let colorSwitchButton = document.createElement("button");
	colorSwitchButton.innerHTML = "Use set colors";
	document.querySelector("aside").appendChild(colorSwitchButton);

	colorSwitchButton.onclick = function () {
		projectSettings.colors = !projectSettings.colors;
		localStorage.setItem("projectSettings", JSON.stringify(projectSettings));
		window.location.reload();
	}
}

const addColorSwatchesToAside = (colors) => {
	const colorSwatches = document.createElement("div")
	colorSwatches.setAttribute("id", "color-swatches")
	for(let i = 0; i < colors.length; i++) {
		const colorSwatch = document.createElement("div")
		colorSwatch.style.backgroundColor = colors[i]
		colorSwatches.appendChild(colorSwatch)
        const colorSwatchWrapper = document.createElement("div")
        colorSwatchWrapper.appendChild(colorSwatch)
        colorSwatches.appendChild(colorSwatchWrapper)
	}
	controlPanel.appendChild(colorSwatches)
}

export { controlPanel, addFXHashValues, addRenderTime, addColorSwatchButton, addColorSwatchesToAside }