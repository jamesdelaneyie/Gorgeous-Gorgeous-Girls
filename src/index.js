let startTime = Date.now();
//import { projectSettings } from "./settings.js";
import * as PIXI from "pixi.js";
import { SmoothGraphics as Graphics } from "@pixi/graphics-smooth";
import { Mark, Marker, Move, line } from "./draw.js";
import { Fill, addFillBackground } from "./fill.js";
import { rand, randFloat, findClosestPoints } from "./math.js";
import { getPositionOnLine } from "./bezier.js";
import { bezier, getEasing  } from "./easing.js";
import { getColors } from "./colors.js";
import { Pencil2B, Pencil6B, Pen_1mm, Pen_2mm, feltMarker, Pencil6B2 } from "./pencil-case.js";
import { createBezierPoints } from "./bezier.js";
import { drawEllipse, drawEllipseCurves } from "./shapes.js";
import { controlPanel, addFXHashValues, addRenderTime, addColorSwatchButton, addColorSwatchesToAside } from "./UI.js";
// the 64 chars hex number fed to your algorithm
//console.log(fxhash);

// deterministic PRNG function, use it instead of Math.random()
//console.log(fxrand()); 


//----------------------
// defining features
//----------------------
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
window.$fxhashFeatures = {
   "Background": "Black",
   "Number of lines": 10,
   "Inverted": true
}



let projectSettings
if (!localStorage.getItem("projectSettings")) {
	projectSettings = {
		"colors": true,
	}
	localStorage.setItem("projectSettings", JSON.stringify(projectSettings));
} else {
	projectSettings = JSON.parse(localStorage.getItem("projectSettings"));
	if(projectSettings.colors) {
		//colorSwitchButton.innerHTML = "Use set colors";
	} else {
		//colorSwitchButton.innerHTML = "Use random colors";
	}
}

let colors
if(projectSettings.colors) {
	colors = getColors("random");
} else {
	colors = getColors();
}

let hairColor = colors[0]//.hairColor;
let highlightColor = colors[1]//.highlightColor;
let multiplyColor = colors[2]//multiplyColor;

console.log(colors)



Pencil6B2.color = multiplyColor



addFXHashValues()
addColorSwatchesToAside(colors)









// Don't print PIXI.js banner
PIXI.utils.skipHello();

// Create a Pixi Application
let app = new PIXI.Application({
	width: 2048,
	height: 2048,
	antialias: false,
	autoDensity: true,
	resolution: window.devicePixelRatio || 1,
	roundPixels: true,
	autoStart: false,
	powerPreference: "high-performance",
	backgroundColor: 0x00ff00,
});

//PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
//PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;

// Setup the mark making named function 
let canvas = app;
canvas.make = function (mark) {
	mark.make(canvas);
};

let center = { 
	x: app.view.width / (window.devicePixelRatio || 1) / 2, 
	y: app.view.height / (window.devicePixelRatio || 1) / 2
};

document.body.appendChild(app.view);
app.view.id = "canvas";


	







let debug = true
let drawWireframe = true



const artContainer = new PIXI.Container();
const backgroundContainer = new PIXI.Container();

let whiteTextureFill
if(drawWireframe) {
} else {
	let whiteTexture = addFillBackground(app, '#fcfcfc', backgroundContainer)
	let whiteTextureLayer = whiteTexture.fillTexture()
	canvas.stage.addChild(whiteTextureLayer)
	whiteTextureFill = new PIXI.Texture.from(app.view)
	let whiteTextureTest = new PIXI.Sprite(whiteTextureFill)
	canvas.stage.addChild(whiteTextureTest)
}


if(drawWireframe) {
	let backgroundColor = new PIXI.Graphics();
	backgroundColor.beginFill(PIXI.utils.string2hex(highlightColor));
	backgroundColor.drawRect(0, 0, app.view.width, app.view.height);
	backgroundColor.endFill();
	canvas.stage.addChild(backgroundColor)
} else {
	let backgroundTexture = addFillBackground(app, highlightColor, backgroundContainer)
	let backgroundLayer = backgroundTexture.fillTexture()
	canvas.stage.addChild(backgroundLayer)
}







const addReferenceImages = () => {

	let referenceImages = new PIXI.Container();
	let numberOfImages = 2
	for(var i=1; i<numberOfImages; i++) {
		let image = PIXI.Sprite.from(`./reference/headshape/${i}.png`);
		image.alpha = 0.4
		referenceImages.addChild(image)
	}
	artContainer.addChild(referenceImages)

}







/*
 *
 *  Draw the head shape
 * 
/*/

const YAxisMaxAngle = rand(0, 225)
const XAxisMaxAngle = rand(0, 225)

let YAxisEllipseWidth = -225//225//rand(-YAxisMaxAngle, YAxisMaxAngle)
let XAxisEllipseWidth = -225//rand(-XAxisMaxAngle, XAxisMaxAngle)

let isLeft = YAxisEllipseWidth < 0
let isDown = XAxisEllipseWidth < 0

let headTilt = 0//rand(-15, 15)

let eyePupilOffsetX = 0//rand(-20, 20)
let eyePupilOffsetY = 0//rand(-20, 20)

let headCentreX = app.view.width/2
let headCentreY = app.view.height/2 - (app.view.height/10)
const jawHeight = app.view.height/10
const headHeight = 440
const headWidth = 440

let shoulderSlant = 0//rand(-50, 100)
let shoulderAngle = 0

//create a variable to store the value of the slider
const updateDrawValues = async () => {

	startTime = Date.now();

	let XValue = XAxisSlider.value
	let YValue = YAxisSlider.value
	let headTiltValue = headTiltSlider.value
	let eyeOffsetXValue = eyeOffsetXSlider.value
	let eyeOffsetYValue = eyeOffsetYSlider.value
	let shoulderAngleValue = shoulderAngleSlider.value
	let shoulderSlantValue = shoulderSlantSlider.value


	XAxisSlider.setAttribute("value", XValue)
	YAxisSlider.setAttribute("value", YValue)
	headTiltSlider.setAttribute("value", headTiltValue)
	eyeOffsetXSlider.setAttribute("value", eyeOffsetXValue)
	eyeOffsetYSlider.setAttribute("value", eyeOffsetYValue)
	shoulderAngleSlider.setAttribute("value", shoulderAngleValue)
	shoulderSlantSlider.setAttribute("value", shoulderSlantValue)

	//use the variable to change the scale of the container
	XAxisEllipseWidth = Number(XValue)
	YAxisEllipseWidth = Number(YValue)
	headTilt = Number(headTiltValue)
	eyePupilOffsetX = Number(eyeOffsetXValue)
	eyePupilOffsetY = Number(eyeOffsetYValue)
	shoulderAngle = Number(shoulderAngleValue)
	shoulderSlant = Number(shoulderSlantValue)

	artContainer.removeChildren()
	debugNeckContainer.removeChildren()
	debugContainer.removeChildren()

	let faceDrawPositions = drawHeadSketch()
	let faceShape = drawFaceShape(faceDrawPositions)
	artContainer.addChild(faceShape)
	artContainer.addChild(faceDrawPositions.features)
	if(drawWireframe) {
		artContainer.addChild(faceDrawPositions.output)
	}


	app.render()
	app.stage.filters = [new PIXI.filters.FXAAFilter()];
	

	//Append the line isLeft to the aside in the DOM
	const headDirection = document.createElement('span');
	headDirection.classList.add('head-direction-left');
	headDirection.innerHTML = isLeft ? 'Facing Left' : 'Facing Right';
	// if the span is there, update it, otherwise append it
	controlPanel.querySelector('.head-direction-left')
		? controlPanel.querySelector('.head-direction-left').innerHTML = isLeft ? 'Facing Left' : 'Facing Right'
		: controlPanel.appendChild(headDirection);

	//Append the line isTop to the aside in the DOM
	const headDirection2 = document.createElement('span');
	headDirection2.classList.add('head-direction-down');
	headDirection2.innerHTML = isDown ? 'Facing Down' : 'Facing Up';
	// if the span is there, update it, otherwise append it
	controlPanel.querySelector('.head-direction-down')
		? controlPanel.querySelector('.head-direction-down').innerHTML = isDown ? 'Facing Down' : 'Facing Up'
		: controlPanel.appendChild(headDirection2);

	//aside.appendChild(headDirection2);

	/*
	*
	* 	Render the image to an img element
	*  and then setup a download link
	* 
	*/
	const dataUri = await app.renderer.plugins.extract.base64(app.stage);

	let downloadButton = document.querySelector("aside a")
	if(downloadButton) {
		downloadButton.href = dataUri
	}
	addRenderTime(startTime)

	const image = new Image()
	image.src = app.view.toDataURL('image/png');//await app.renderer.plugins.extract.image(canvas.stage);
	const oldImage = controlPanel.querySelector("img")
	if(oldImage) {
		oldImage.remove()
	}
	controlPanel.appendChild(image)


	

}



const createSlider = (name, min, max, value, step, type) => {
	var slider = document.createElement("INPUT");
	slider.setAttribute("max", max);
	slider.setAttribute("min", min);
	slider.setAttribute("value", value);
	slider.setAttribute("step", step);
	slider.setAttribute("type", type);
	slider.setAttribute("name", name);
	controlPanel.appendChild(slider);
	slider.addEventListener("input", updateDrawValues, false);
	return slider
}

const YAxisSlider = createSlider("X Axis", -225, 225, YAxisEllipseWidth, 1, "range")
const XAxisSlider = createSlider("Y Axis", -225, 225, XAxisEllipseWidth, 1, "range")
const headTiltSlider = createSlider("Tilt Angle", -20, 20, headTilt, 1, "range")
const eyeOffsetXSlider = createSlider("Eye Offset X", -20, 20, eyePupilOffsetX, 1, "range")
const eyeOffsetYSlider = createSlider("Eye Offset Y", -20, 20, eyePupilOffsetY, 1, "range")
const shoulderAngleSlider = createSlider("Shoulder Angle", -150, 150, shoulderAngle, 1, "range")
const shoulderSlantSlider = createSlider("Shoulder Slant", -100, 100, shoulderSlant, 1, "range")

//Create a range slider input element and add it to the page
//set the color for all inputs on the page to the highlight color
const inputs = document.querySelectorAll("input")
inputs.forEach(input => {
	input.style.color = highlightColor
})













const drawHeadSketch = () => {

	const headContainer = new PIXI.Container()

	isLeft = YAxisEllipseWidth < 0
	isDown = XAxisEllipseWidth < 0

	const YAxisEllipsePoints = []
	const XAxisEllipsePoints = []

	const skullColor = 0x0000ff
	const jawColor = 0x0000ff
	const centrePointColor = 0x0000ff
	const faceSketchesColor = 0xff0000

	

	let shouldersLeft
	if(shoulderAngle < 0) {
		shouldersLeft = true
	} else {
		shouldersLeft = false
	}
	shoulderAngle = Math.abs(shoulderAngle)

	// Skull Shape
	const headSkullShape = new Graphics()
	headSkullShape.lineStyle(2, skullColor, 1)
	let skullCentreX = headCentreX
	if(isLeft) {
		skullCentreX = headCentreX - (YAxisEllipseWidth/5)
	} else {
		skullCentreX = headCentreX - (YAxisEllipseWidth/5)
	}
	headSkullShape.drawEllipse(skullCentreX, headCentreY, headWidth, headHeight)
	headContainer.addChild(headSkullShape)

	// Get the top point of the skullshape
	const skullTopPoint = {x: headCentreX, y: headCentreY - headHeight}

	// Y Axis Sketch Line
	const Y_MIN_OUTCOME = 0.5;
	const Y_AXIS_LEFT_START = 90;
	const Y_AXIS_LEFT_END = 270;
	const Y_AXIS_RIGHT_START = 270;
	const Y_AXIS_RIGHT_END = 450;

	const YOutcome = rand(0, 1);
	//const isLeft = YOutcome > Y_MIN_OUTCOME;
	
	YAxisEllipseWidth = Math.abs(YAxisEllipseWidth)
	const YStartAngle = isLeft ? Y_AXIS_LEFT_START : Y_AXIS_RIGHT_START;
	const YEndAngle = isLeft ? Y_AXIS_LEFT_END : Y_AXIS_RIGHT_END;

	if(isLeft) {
		drawEllipseCurves(headCentreX - (YAxisEllipseWidth/5), headCentreY, YAxisEllipseWidth*2, headHeight*2, headContainer, isLeft)
		drawEllipse(headCentreX - (YAxisEllipseWidth/5), headCentreY, YStartAngle, YEndAngle, YAxisEllipseWidth, headHeight, YAxisEllipsePoints, headContainer, skullColor);
	} else {
		drawEllipseCurves(headCentreX + (YAxisEllipseWidth/5), headCentreY, YAxisEllipseWidth*2, headHeight*2, headContainer, isLeft)
		drawEllipse(headCentreX + (YAxisEllipseWidth/5), headCentreY, YStartAngle, YEndAngle, YAxisEllipseWidth, headHeight, YAxisEllipsePoints, headContainer, skullColor);
	}

	


	// X Axis Sketch Line
	const X_MIN_OUTCOME = 0.5;
	const X_AXIS_TOP_START = 0;
	const X_AXIS_TOP_END = 180;
	const X_AXIS_BOTTOM_START = 180;
	const X_AXIS_BOTTOM_END = 360;

	const XOutcome = rand(0, 1);
	//const isDown = XOutcome > X_MIN_OUTCOME;

	XAxisEllipseWidth = Math.abs(XAxisEllipseWidth)
	const XStartAngle = isDown ? X_AXIS_TOP_START : X_AXIS_BOTTOM_START;
	const XEndAngle = isDown ? X_AXIS_TOP_END : X_AXIS_BOTTOM_END;

	if(isLeft) {
		drawEllipseCurves(headCentreX + (YAxisEllipseWidth/5), headCentreY, headWidth*2, XAxisEllipseWidth*2, headContainer, isLeft)
		drawEllipse(headCentreX + (YAxisEllipseWidth/5), headCentreY, XStartAngle, XEndAngle, headWidth, XAxisEllipseWidth, XAxisEllipsePoints, headContainer, skullColor);
	} else {
		drawEllipseCurves(headCentreX - (YAxisEllipseWidth/5), headCentreY, headWidth*2, XAxisEllipseWidth*2, headContainer, isLeft)
		drawEllipse(headCentreX - (YAxisEllipseWidth/5), headCentreY, XStartAngle, XEndAngle, headWidth, XAxisEllipseWidth, XAxisEllipsePoints, headContainer, skullColor);
	}



	// Get the centre of the face
	const closestPoints = findClosestPoints(YAxisEllipsePoints, XAxisEllipsePoints)
	const faceCentreX = YAxisEllipsePoints[closestPoints[0]].x
	const faceCentreY = YAxisEllipsePoints[closestPoints[0]].y

	// Calculate the distance for x and y between the headCentre and the faceCentre
	const faceCentreDistanceX = faceCentreX - headCentreX
	const faceCentreDistanceY = faceCentreY - headCentreY

	// Draw a circle at the centre of the face
	const faceCentrePoint = new Graphics()
	faceCentrePoint.lineStyle(2, centrePointColor, 1)
	faceCentrePoint.drawCircle(faceCentreX, faceCentreY, 5)
	headContainer.addChild(faceCentrePoint)

	// Draw lines from the jaw to the chin to the centre of the face
	let rightCheekDistance = isLeft ? YAxisEllipseWidth : -YAxisEllipseWidth

	
	const jawBottomYStart = (headCentreY + headHeight + jawHeight)
	const jawBottomY = isDown ? jawBottomYStart - (faceCentreDistanceY/2) : jawBottomYStart + (faceCentreDistanceY * 1.5)
	
	let jawBottomX
	if(isLeft) {
		jawBottomX = headCentreX - rightCheekDistance - (faceCentreDistanceX / 2)// - (YAxisEllipseWidth/4)
		if(isDown) {
			jawBottomX = jawBottomX// + (XAxisEllipseWidth/4)
		}
	} else {
		jawBottomX = headCentreX - rightCheekDistance - (faceCentreDistanceX / 2)// + (YAxisEllipseWidth/4)
		if(isDown) {
			jawBottomX = jawBottomX //- (XAxisEllipseWidth/4)
		}
		
	}
	
	const jawEdgeY = isDown ? headCentreY + headHeight - (faceCentreDistanceY/2) : headCentreY + headHeight + (faceCentreDistanceY)
	const jawEdgeChinY = isDown ? headCentreY + headHeight - (faceCentreDistanceY/2) + (jawHeight - 30) : headCentreY + headHeight + (faceCentreDistanceY) + (jawHeight - 30) + (faceCentreDistanceY/4)


	let rightCheek = new Graphics()
	rightCheek.lineStyle(2, jawColor, 1)

	let rightJawStartX
	if(isLeft) {
		rightJawStartX = headCentreX + headWidth - (YAxisEllipseWidth/5)
	} else {
		rightJawStartX = headCentreX + headWidth - (YAxisEllipseWidth/3)
	}

	let rightJawChinEdgeX
	if(isLeft) {
		rightJawChinEdgeX = headCentreX + 120 - (YAxisEllipseWidth/3)
	} else {
		rightJawChinEdgeX = headCentreX + 120 + (YAxisEllipseWidth/3)
	}

	let rightJawEdgeX
	if(isLeft) {
		rightJawEdgeX = headCentreX + 320 - (YAxisEllipseWidth/3)
	} else {
		rightJawEdgeX = headCentreX + 320 
	}

	


	const rightJawStart = {x: rightJawStartX, y: headCentreY + 140}
	const rightJawEdge = {x: rightJawEdgeX, y: jawEdgeY}
	const rightJawChinEdge = {x: rightJawChinEdgeX, y: jawEdgeChinY}
	const rightJawBottom = {x: jawBottomX, y: jawBottomY}


	rightCheek.moveTo(rightJawStart.x, rightJawStart.y) // Right Jaw Top
	rightCheek.lineTo(rightJawEdge.x, rightJawEdge.y) // Jaw Edge
	rightCheek.lineTo(rightJawChinEdge.x, rightJawChinEdge.y) // Jaw Chin Edge
	rightCheek.lineTo(rightJawBottom.x, rightJawBottom.y) // Jaw Bottom
	headContainer.addChild(rightCheek)





	let leftCheek = new Graphics()
	leftCheek.lineStyle(2, jawColor, 1)

	let leftJawStartX 
	if(isLeft) {
		leftJawStartX = headCentreX - headWidth + (YAxisEllipseWidth/3)
	} else {
		leftJawStartX = headCentreX - headWidth + (YAxisEllipseWidth/5)
	}

	let leftJawEdgeX
	if(isLeft) {
		leftJawEdgeX = headCentreX - 320
	} else {
		leftJawEdgeX = headCentreX - 320 + (YAxisEllipseWidth/3)
	}

	let leftJawChinEdgeX
	if(isLeft) {
		leftJawChinEdgeX = headCentreX - 120 - (YAxisEllipseWidth/3)
	} else {
		leftJawChinEdgeX = headCentreX - 120 + (YAxisEllipseWidth/3)
	}

	const leftJawStart = {x: leftJawStartX, y: headCentreY + 140}
	const leftJawEdge = {x: leftJawEdgeX, y: jawEdgeY}
	const leftJawChinEdge = {x: leftJawChinEdgeX, y: jawEdgeChinY}
	const leftJawBottom = {x: jawBottomX, y: jawBottomY}


	leftCheek.moveTo(leftJawStart.x, leftJawStart.y) // Left Jaw Top
	leftCheek.lineTo(leftJawEdge.x, leftJawEdge.y) // Left Jaw Edge
	leftCheek.lineTo(leftJawChinEdge.x, leftJawChinEdge.y) // Left Jaw Chin Edge
	leftCheek.lineTo(leftJawBottom.x, leftJawBottom.y) // Left Jaw Bottom

	headContainer.addChild(leftCheek)
		
	// Draw a dotted line from the facecenter to jawbottomX and jawbottomY
	let dottedLine = new Graphics()
	dottedLine.lineStyle(2, jawColor, 1)
	dottedLine.moveTo(faceCentreX, faceCentreY)
	dottedLine.lineTo(jawBottomX, jawBottomY)
	headContainer.addChild(dottedLine)



	headContainer.pivot.x = headCentreX
	headContainer.pivot.y = headCentreY
	headContainer.x = headCentreX
	headContainer.y = headCentreY

	headContainer.angle = headTilt

	let featureContainer = new PIXI.Container()

	featureContainer.x = headCentreX
	featureContainer.y = headCentreY
	featureContainer.pivot.x = headCentreX
	featureContainer.pivot.y = headCentreY
	featureContainer.angle = headTilt

	if(isLeft) {
		if(YAxisEllipseWidth > 100) {
			let YAxisModifier = YAxisEllipseWidth - 100
			YAxisModifier = YAxisModifier / 2
			headContainer.x -= YAxisModifier
			featureContainer.x -= YAxisModifier
		}
	}


	let irisSize = 50
	let irisSizeY = 50

	let irisMarker = new Marker({
		color: hairColor,
		material: { size: 1 },
		nib: { type: "oval", size: irisSize, sizeY: irisSizeY, angle: 0 },
		alpha: 0.2,
		fillAreaReducer: 2,
		useSprites: true,
		moveStyles: {
			//alphaJitter: true,
		}
	})



	let leftEyeContainer = new PIXI.Container()
	let leftEyeX, leftEyeY, leftEyeWidth, leftEyeHeight

	let leftEyeSketch = new Graphics()
	leftEyeSketch.lineStyle(2, faceSketchesColor, 1)
	
	if(isLeft) {
		leftEyeWidth = 110 - (YAxisEllipseWidth/4)
		leftEyeHeight = 70
		leftEyeX = faceCentreX - 210 + (YAxisEllipseWidth/1.5)
		if(isDown) {
			leftEyeY = faceCentreY + 100 - (XAxisEllipseWidth/1.5)
			// - (YAxisEllipseWidth/8)
		} else {
			leftEyeY = faceCentreY + 100
		}
	} else {
		leftEyeWidth = 110 * (YAxisEllipseWidth/75)
		leftEyeHeight = 70
		leftEyeX = faceCentreX - 220 - (YAxisEllipseWidth/3)
		if(leftEyeWidth < 110) {
			leftEyeWidth = 110
		}
		if(leftEyeWidth > 120) {
			leftEyeWidth = 120
		}
		if(leftEyeHeight < 70) {
			leftEyeHeight = 70
		}
		if(leftEyeHeight > 80) {
			leftEyeHeight = 80
		}
		if(isDown) {
			leftEyeY = faceCentreY + 100 - (XAxisEllipseWidth/2)
		} else {
			leftEyeY = faceCentreY + 100
		}
	}
	leftEyeSketch.drawEllipse(leftEyeX, leftEyeY, leftEyeWidth, leftEyeHeight)

	let leftEyeMask = new Graphics()
	leftEyeMask.beginFill(0x000000)
	leftEyeMask.lineStyle(2, 0x000000, 1)
	leftEyeMask.drawEllipse(leftEyeX, leftEyeY, leftEyeWidth, leftEyeHeight)
	leftEyeMask.endFill()
	
	leftEyeContainer.mask = leftEyeMask

	leftEyeContainer.addChild(leftEyeSketch)
	leftEyeContainer.addChild(leftEyeMask)

	featureContainer.addChild(leftEyeContainer)

	let leftEyeBrow = new Graphics()
	leftEyeBrow.lineStyle(2, faceSketchesColor, 1)
	let leftEyeBrowXStart
	let leftEyeBrowYStart
	let leftEyeBrowXEnd
	let leftEyeBrowYEnd
	if(isLeft) {
		leftEyeBrowXStart = faceCentreX - 100 + (YAxisEllipseWidth/2)
		leftEyeBrowXEnd = faceCentreX - 320 + (YAxisEllipseWidth/2)
		if(isDown) {
			leftEyeBrowYStart = faceCentreY - 60 - (XAxisEllipseWidth/2)
			leftEyeBrowYEnd = faceCentreY - 60 - (XAxisEllipseWidth/2)
		} else {
			leftEyeBrowYStart = faceCentreY - 60 + (XAxisEllipseWidth/6)
			leftEyeBrowYEnd = faceCentreY - 60 + (XAxisEllipseWidth/6)
		}
	} else {
		leftEyeBrowXStart = faceCentreX - 100 + (YAxisEllipseWidth/3)
		leftEyeBrowXEnd = faceCentreX - 320 - (YAxisEllipseWidth/1)
		if(isDown) {
			leftEyeBrowYStart = faceCentreY - 60 - (XAxisEllipseWidth/2)
			leftEyeBrowYEnd = faceCentreY - 60 - (XAxisEllipseWidth/2)
		} else {
			leftEyeBrowYStart = faceCentreY - 60 + (XAxisEllipseWidth/6)
			leftEyeBrowYEnd = faceCentreY - 60 + (XAxisEllipseWidth/6)
		}
	}
	leftEyeBrow.moveTo(leftEyeBrowXStart, leftEyeBrowYStart)
	leftEyeBrow.lineTo(leftEyeBrowXEnd, leftEyeBrowYEnd)
	featureContainer.addChild(leftEyeBrow)



	let leftPupil = new Graphics()
	
	let leftPupilX 
	let leftPupilY
	if(isLeft) {
		leftPupilX = faceCentreX - 210 + (YAxisEllipseWidth/1.2)
		if(isDown) {
			leftPupilY = faceCentreY + 100 - (XAxisEllipseWidth/1.5)// - (YAxisEllipseWidth/8)
		} else {
			leftPupilY = faceCentreY + 100
		}
	} else {
		leftPupilX = faceCentreX - 210 - (YAxisEllipseWidth/3)
		if(isDown) {
			leftPupilY = faceCentreY + 100 - (XAxisEllipseWidth/2)
		} else {
			leftPupilY = faceCentreY + 100
		}
	}
	leftPupilX = leftPupilX + eyePupilOffsetX
	leftPupilY = leftPupilY + eyePupilOffsetY
	

	let leftIrisMove = new Move({
		iterations: 4,
		line: new line({
			x: leftPupilX,
			y: leftPupilY,
			x2: 1,
			y2: 1,
			density: 10
		})
	})
	
	let leftIrisMark = new Mark({
		name: "Iris",
		marker: irisMarker,
		move: leftIrisMove,
		layer: leftEyeContainer
	})

	if(drawWireframe) {
		leftPupil.beginFill(PIXI.utils.string2hex(hairColor))
		leftPupil.drawEllipse(leftPupilX, leftPupilY, irisSize, irisSizeY)
		leftPupil.endFill()
	} else {
		canvas.make(leftIrisMark)
	}
	leftPupil.beginFill(multiplyColor)
	leftPupil.drawCircle(leftPupilX, leftPupilY, 10)
	leftPupil.endFill()
	

	leftEyeContainer.addChild(leftPupil)











	let rightEyeContainer = new PIXI.Container()
	let rightEyeX, rightEyeY, rightEyeWidth, rightEyeHeight
	let rightEyeSketch = new Graphics()
	rightEyeSketch.lineStyle(2, faceSketchesColor, 1)
	if(isLeft) {
		rightEyeWidth = 110 * (YAxisEllipseWidth/75)
		rightEyeHeight = 70 * (YAxisEllipseWidth/75)
		rightEyeX = faceCentreX + 220 + (YAxisEllipseWidth/2.2)
		if(rightEyeWidth < 110) {
			rightEyeWidth = 110
		}
		if(rightEyeWidth > 120) {
			rightEyeWidth = 120
		}
		if(rightEyeHeight < 70) {
			rightEyeHeight = 70
		}
		if(rightEyeHeight > 80) {
			rightEyeHeight = 80
		}
		
		if(isDown) {
			rightEyeY = faceCentreY + 100 - (XAxisEllipseWidth/2)
		} else {
			rightEyeY = faceCentreY + 100
		}
	} else {
		rightEyeWidth = 110 - (YAxisEllipseWidth/4)
		rightEyeHeight = 70
		rightEyeX = faceCentreX + 210 - (YAxisEllipseWidth/1.4)
		rightEyeY
		if(isDown) {
			rightEyeY = faceCentreY + 100 - (XAxisEllipseWidth/2) - (YAxisEllipseWidth/8)
		} else {
			rightEyeY = faceCentreY + 100
		}
		
	}
	rightEyeSketch.drawEllipse(rightEyeX, rightEyeY, rightEyeWidth, rightEyeHeight)


	let rightEyeMask = new Graphics()
	rightEyeMask.beginFill(0x000000)
	rightEyeMask.lineStyle(2, 0x000000, 1)
	rightEyeMask.drawEllipse(rightEyeX, rightEyeY, rightEyeWidth, rightEyeHeight)
	rightEyeMask.endFill()

	rightEyeContainer.mask = rightEyeMask

	rightEyeContainer.addChild(rightEyeSketch)
	rightEyeContainer.addChild(rightEyeMask)
	

	let rightEyeBrow = new Graphics()
	rightEyeBrow.lineStyle(2, faceSketchesColor, 1)
	let rightEyeBrowXStart
	let rightEyeBrowYStart
	let rightEyeBrowXEnd
	let rightEyeBrowYEnd
	if(isLeft) {
		rightEyeBrowXStart = faceCentreX + 100 + (YAxisEllipseWidth/2)
		rightEyeBrowYStart = faceCentreY - 60 - (XAxisEllipseWidth/1.5)
		rightEyeBrowXEnd = faceCentreX + 320 + (YAxisEllipseWidth/2)
		rightEyeBrowYEnd = faceCentreY - 60 - (XAxisEllipseWidth/1.5)
		if(isDown) {
			rightEyeBrowYStart = faceCentreY - 60 - (XAxisEllipseWidth/2)
			rightEyeBrowYEnd = faceCentreY - 60 - (XAxisEllipseWidth/2)
		} else {
			rightEyeBrowYStart = faceCentreY - 60 + (XAxisEllipseWidth/6)
			rightEyeBrowYEnd = faceCentreY - 60 + (XAxisEllipseWidth/6)
		}
		
	} else {
		rightEyeBrowXStart = faceCentreX + 100 - (YAxisEllipseWidth/2)
		rightEyeBrowXEnd = faceCentreX + 320 - (YAxisEllipseWidth/1.1)
		if(isDown) {
			rightEyeBrowYStart = faceCentreY - 60 - (XAxisEllipseWidth/2)
			rightEyeBrowYEnd = faceCentreY - 60 - (XAxisEllipseWidth/2)
		} else {
			rightEyeBrowYStart = faceCentreY - 60 + (XAxisEllipseWidth/6)
			rightEyeBrowYEnd = faceCentreY - 60 + (XAxisEllipseWidth/6)
		}
		
	}
	rightEyeBrow.moveTo(rightEyeBrowXStart, rightEyeBrowYStart)
	rightEyeBrow.lineTo(rightEyeBrowXEnd, rightEyeBrowYEnd)
	featureContainer.addChild(rightEyeBrow)



	

	let rightPupil = new Graphics()
	rightPupil.beginFill(multiplyColor)
	let rightPupilX
	let rightPupilY
	if(isLeft) {
		rightPupilX = faceCentreX + 210 + (YAxisEllipseWidth/2)
		if(isDown) {
			rightPupilY = faceCentreY + 100 - (XAxisEllipseWidth/2)
		} else {
			rightPupilY = faceCentreY + 100
		}
	} else {
		rightPupilX = faceCentreX + 210 - (YAxisEllipseWidth/1.2)
		
		if(isDown) {
			rightPupilY = faceCentreY + 100 - (XAxisEllipseWidth/2) - (YAxisEllipseWidth/8)
		} else {
			rightPupilY = faceCentreY + 100
		}

	}
	rightPupilX = rightPupilX + eyePupilOffsetX
	rightPupilY = rightPupilY + eyePupilOffsetY
	
	rightEyeContainer.addChild(rightEyeSketch)


	
	
	let irisMove = new Move({
		iterations: 4,
		line: new line({
			x: rightPupilX,
			y: rightPupilY,
			x2: 1,
			y2: 1,
			density: 10
		})
	})
	
	let irisMark = new Mark({
		name: "Iris",
		marker: irisMarker,
		move: irisMove,
		layer: rightEyeContainer
	})

	
	if(drawWireframe) {
		rightPupil.beginFill(PIXI.utils.string2hex(hairColor))
		rightPupil.drawEllipse(rightPupilX, rightPupilY, irisSize, irisSizeY)
		rightPupil.endFill()
	} else {
		canvas.make(irisMark)
	}

	rightPupil.beginFill(multiplyColor)
	rightPupil.drawCircle(rightPupilX, rightPupilY, 10)
	rightPupil.endFill()

	rightEyeContainer.addChild(rightPupil)
	featureContainer.addChild(rightEyeContainer)
	



	let leftEar = new Graphics()
	leftEar.lineStyle(2, faceSketchesColor, 1)
	leftEar.drawEllipse(leftJawStart.x, leftJawStart.y, YAxisEllipseWidth/5, 50)
	if(isLeft) {
		if(YAxisEllipseWidth > 50) {

		} else {
			featureContainer.addChild(leftEar)
		}
	} else {
		featureContainer.addChild(leftEar)
	}

	let rightEar = new Graphics()
	rightEar.lineStyle(2, faceSketchesColor, 1)
	rightEar.drawEllipse(rightJawStart.x, rightJawStart.y, YAxisEllipseWidth/5, 50)
	if(isLeft) {
		featureContainer.addChild(rightEar)
	} else {
		if(YAxisEllipseWidth > 50) {

		} else {
			featureContainer.addChild(rightEar)
		}
	}

	
	

	let noseBottomSketch = new Graphics()
	noseBottomSketch.lineStyle(2, faceSketchesColor, 1)


	let noseCentreX = faceCentreX - 40
	let noseCentreY = faceCentreY + 360
	if(isLeft) {
		noseCentreX = noseCentreX + (YAxisEllipseWidth/5)
		if(isDown) {
			noseCentreX = noseCentreX + (XAxisEllipseWidth/10)
		} else {

		}
	} else {
		noseCentreX = noseCentreX - (YAxisEllipseWidth/5)
		if(isDown) {
			noseCentreX = noseCentreX - (XAxisEllipseWidth/10)
		} else {

		}
	}
	
	if(isDown) {
		noseCentreY = noseCentreY - XAxisEllipseWidth + YAxisEllipseWidth/5
	} else {
		noseCentreY = noseCentreY - (XAxisEllipseWidth/3)
	}
	let noseXStart = noseCentreX
	let noseXEnd = noseXStart + 80

	noseBottomSketch.moveTo(noseXStart, noseCentreY)
	noseBottomSketch.lineTo(noseXEnd, noseCentreY)
	featureContainer.addChild(noseBottomSketch)




	let mouthXStart = faceCentreX - 100
	let mouthYStart = faceCentreY + 340 + (jawHeight/2)
	if(isLeft) {
		mouthXStart = mouthXStart + (YAxisEllipseWidth/3)
		if(isDown) {
			mouthXStart = mouthXStart + (XAxisEllipseWidth/4)
			mouthYStart = mouthYStart + (XAxisEllipseWidth/4)
		}
	} else {
		mouthXStart = mouthXStart - (YAxisEllipseWidth/3)
		if(isDown) {
			mouthXStart = mouthXStart + (XAxisEllipseWidth/4)
			mouthYStart = mouthYStart + (XAxisEllipseWidth/4)
		}
	}
	if(isDown) {
		mouthYStart = mouthYStart - (XAxisEllipseWidth/1)
	} else {
		mouthYStart = mouthYStart - (XAxisEllipseWidth/2.5)
	}

	let mouthXEnd = mouthXStart + 200

	let mouthSketch = new Graphics()
	mouthSketch.lineStyle(2, faceSketchesColor, 1)
	mouthSketch.moveTo(mouthXStart, mouthYStart)
	mouthSketch.lineTo(mouthXEnd, mouthYStart)
	featureContainer.addChild(mouthSketch)


	artContainer.addChild(headContainer)
	artContainer.addChild(featureContainer)
	headContainer.alpha = 0.2



	let leftShoulderPoint = new Graphics()
	leftShoulderPoint.lineStyle(2, 0x000000, 1)
	let leftShoulderPointX = headCentreX - headWidth - 250 + /*(YAxisEllipseWidth/4) +*/ shoulderAngle
	let leftShoulderPointY = headCentreY + headHeight + jawHeight + 300 + shoulderSlant
	leftShoulderPoint.drawCircle(leftShoulderPointX, leftShoulderPointY, 10)
	artContainer.addChild(leftShoulderPoint)

	let leftNeckStartX
	let leftNeckEndX
	if(isLeft) {
		leftNeckStartX = leftJawStart.x + 130
		leftNeckEndX = leftShoulderPointX - leftJawStart.x - 120
	} else {
		leftNeckStartX = leftJawStart.x + 130 - (YAxisEllipseWidth/2)
		leftNeckEndX = leftShoulderPointX - leftJawStart.x - 120 + (YAxisEllipseWidth/2)
	}
	let leftNextLine = new line({
		x: leftNeckStartX,
		y: leftJawStart.y,
		cp1: 200 - (YAxisEllipseWidth/2),
		cp2: 500,
		x2: leftNeckEndX,
		y2: leftShoulderPointY - leftJawStart.y,
		cp3: 200,
		cp4: 600,
	})
	if(debug) {
		let debugLine = leftNextLine.debug()
		debugNeckContainer.addChild(debugLine)
	}
	let leftShoulderLine = new line({
		x: leftShoulderPointX,
		y: leftShoulderPointY,
		cp1: -100,
		cp2: 50,
		x2: -150,
		y2: app.view.height - leftShoulderPointY,
		cp3: -130,
		cp4: app.view.height - leftShoulderPointY - 200 + shoulderSlant,
	})
	if(debug) {
		let debugLine = leftShoulderLine.debug()
		debugNeckContainer.addChild(debugLine)
	}

	
	


	let rightShoulderPoint = new Graphics()
	rightShoulderPoint.lineStyle(2, 0x000000, 1)
	let rightShoulderPointX = headCentreX + headWidth + 250 + /*(YAxisEllipseWidth/4)*/ - shoulderAngle
	let rightShoulderPointY = headCentreY + headHeight + jawHeight + 300 - shoulderSlant
	rightShoulderPoint.drawCircle(rightShoulderPointX, rightShoulderPointY, 10)
	artContainer.addChild(rightShoulderPoint)

		
	let rightNeckStartX
	let rightNeckEndX
	if(isLeft) {
		let YAxisModifier = 0
		if(YAxisEllipseWidth > 100) {
			YAxisModifier = YAxisEllipseWidth - 100
			YAxisModifier = YAxisModifier / 2
		}
		rightNeckStartX = rightJawStart.x - 130 + (YAxisEllipseWidth/2) - YAxisModifier
		rightNeckEndX = rightShoulderPointX - rightJawStart.x + 120 - (YAxisEllipseWidth/2) + YAxisModifier
	} else {
		rightNeckStartX = rightJawStart.x - 130
		rightNeckEndX = rightShoulderPointX - rightJawStart.x + 120
	}

	let rightNextLine = new line({
		x: rightNeckStartX,
		y: rightJawStart.y,
		cp1: -200 + (YAxisEllipseWidth/2),
		cp2: 500,
		x2: rightNeckEndX,
		y2: rightShoulderPointY - rightJawStart.y,
		cp3: -200,
		cp4: 600,
	})
	if(debug) {
		let debugLine = rightNextLine.debug()
		debugNeckContainer.addChild(debugLine)
	}

	let rightShoulderLine = new line({
		x: rightShoulderPointX,
		y: rightShoulderPointY,
		cp1: 100,
		cp2: 50,
		x2: 150,
		y2: app.view.height - rightShoulderPointY,
		cp3: 130,
		cp4: app.view.height - rightShoulderPointY - 200 - shoulderSlant,
	})
	if(debug) {
		let debugLine = rightShoulderLine.debug()
		debugNeckContainer.addChild(debugLine)
	}


	let leftArmLineX
	if(shouldersLeft) {	
		leftArmLineX = leftShoulderPointX + 130 + shoulderAngle
	} else {
		leftArmLineX = leftShoulderPointX + 130 - shoulderAngle
	}
	let leftArmLine = new line({
		x: leftArmLineX,
		y: leftShoulderPointY + 200,
		cp1: 0,
		cp2: 0,
		x2: 0,
		y2: 200,
	})
	if(debug) {
		let debugLine = leftArmLine.debug()
		debugNeckContainer.addChild(debugLine)
	}


	let rightArmLineX
	if(shouldersLeft) {
		rightArmLineX = rightShoulderPointX - 130 + shoulderAngle
	} else {
		rightArmLineX = rightShoulderPointX - 130 - shoulderAngle
	}
	let rightArmLine = new line({
		x: rightArmLineX,
		y: rightShoulderPointY + 200,
		cp1: 0,
		cp2: 0,
		x2: 0,
		y2: 200,
	})
	if(debug) {
		let debugLine = rightArmLine.debug()
		debugNeckContainer.addChild(debugLine)
	}


	

	

	let neckShapeFill = new Graphics()
	neckShapeFill.beginFill(0xffffff)
	neckShapeFill.lineStyle(2, 0xffffff, 1)

	let leftNextLinePoints = createBezierPoints(leftNextLine)
	let leftShoulderLinePoints = createBezierPoints(leftShoulderLine)
	let rightShoulderLinePoints = createBezierPoints(rightShoulderLine)
	let rightNextLinePoints = createBezierPoints(rightNextLine)

	let neckShapePoints = leftNextLinePoints.concat(leftShoulderLinePoints).concat(rightShoulderLinePoints.reverse()).concat(rightNextLinePoints.reverse())

	neckShapeFill.drawPolygon(neckShapePoints)
	neckShapeFill.endFill()
	artContainer.addChild(neckShapeFill)

	let neckShadow = new Graphics()
	neckShadow.beginFill(PIXI.utils.string2hex(highlightColor))
	neckShadow.moveTo(leftJawStart.x, leftJawStart.y)
	neckShadow.lineTo(leftJawStart.x + ((rightJawStartX - leftJawStartX)/2), jawBottomY + 200)
	neckShadow.lineTo(rightJawStart.x, rightJawStart.y)
	neckShadow.closePath()
	neckShadow.endFill()
	neckShadow.alpha = 0.2
	artContainer.addChild(neckShadow)

	
	
	
	

	



	return {
		headWidth: headWidth,
		headHeight: headHeight,
		skullTopPoint: skullTopPoint, 
		rightJawStart: rightJawStart, 
		rightJawEdge: rightJawEdge, 
		rightJawChinEdge: rightJawChinEdge,
		rightJawBottom: rightJawBottom, 
		leftJawStart: leftJawStart, 
		leftJawEdge: leftJawEdge, 
		leftJawChinEdge: leftJawChinEdge,
		leftJawBottom: leftJawBottom,
		output: headContainer,
		features: featureContainer
	}

}




const easingWrapper = document.createElement('div');
easingWrapper.id = 'easing-wrapper';
easingWrapper.style = 'position: fixed; bottom: 0; left: 400px; width: calc(100% - 400px); height: 140px; overflow-x:scroll; display: flex; background-color:grey;opacity:1;z-index:10';
document.body.appendChild(easingWrapper);

let debugContainer = new PIXI.Container()
let debugNeckContainer = new PIXI.Container()

const drawFaceShape = (positions) => {

	let faceShape = new PIXI.Container()


	faceShape.x = headCentreX
	faceShape.y = headCentreY
	faceShape.pivot.x = headCentreX
	faceShape.pivot.y = headCentreY
	faceShape.angle = headTilt

	if(isLeft) {
		if(YAxisEllipseWidth > 100) {
			let YAxisModifier = YAxisEllipseWidth - 100
			YAxisModifier = YAxisModifier / 2
			faceShape.x -= YAxisModifier
		}
	}

	let skullTopToRightJawLineCP1
	if(isLeft) {
		skullTopToRightJawLineCP1 = positions.headWidth + 100 + YAxisEllipseWidth/2
	} else {
		skullTopToRightJawLineCP1 = positions.headWidth + 100 - YAxisEllipseWidth/2
	}

	let skullTopToRightJawLine = new line({
		x: positions.skullTopPoint.x,
		y: positions.skullTopPoint.y,
		cp1: skullTopToRightJawLineCP1,
		cp2: 0,
		x2: positions.rightJawStart.x - positions.skullTopPoint.x,
		y2: positions.rightJawStart.y - positions.skullTopPoint.y,
	})


	if(debug) {
		let debugLine = skullTopToRightJawLine.debug()
		debugContainer.addChild(debugLine)
	}

	let skullTopToRightJaw = new Move({
		iterations: 1,
		line: skullTopToRightJawLine
	})
	let skullTopToRightJawMark = new Mark({
		name: "skullTopToRightJaw",
		marker: Pencil6B2,
		move: skullTopToRightJaw,
		layer: faceShape
	})



	let skullTopToLeftJawLineCP1
	if(isLeft) {
		skullTopToLeftJawLineCP1 = -positions.headWidth - 100 + YAxisEllipseWidth/2
	} else {
		skullTopToLeftJawLineCP1 = -positions.headWidth - 100 - YAxisEllipseWidth/2
	}

	let skullTopToLeftJawLine = new line({
		x: positions.skullTopPoint.x,
		y: positions.skullTopPoint.y,
		cp1: skullTopToLeftJawLineCP1,
		cp2: 0,
		x2: positions.leftJawStart.x - positions.skullTopPoint.x,
		y2: positions.leftJawStart.y - positions.skullTopPoint.y,
	})
	if(debug) {
		let debugLine = skullTopToLeftJawLine.debug()
		debugContainer.addChild(debugLine)
	}
	let skullTopToLeftJaw = new Move({
		iterations: 1,
		line: skullTopToLeftJawLine
	})
	let skullTopToLeftJawMark = new Mark({
		name: "skullTopToLeftJaw",
		marker: Pencil6B2,
		move: skullTopToLeftJaw,
		layer: faceShape
	})





	let rightJawLine = new line({
		x: positions.rightJawStart.x,
		y: positions.rightJawStart.y,
		cp1: -40,
		cp2: 300,
		x2: positions.rightJawBottom.x - positions.rightJawStart.x,
		y2: positions.rightJawBottom.y - positions.rightJawStart.y, 
		cp3: positions.rightJawBottom.x - positions.rightJawStart.x + 100,
	})

	if(debug) {
		let debugLine = rightJawLine.debug()
		//debugContainer.addChild(debugLine)
	}








	let rightJawLineOne = new line({
		x: positions.rightJawStart.x,
		y: positions.rightJawStart.y,
		x2: positions.rightJawEdge.x - positions.rightJawStart.x,
		y2: positions.rightJawEdge.y - positions.rightJawStart.y,
	})
	if(debug) {
		let debugLine = rightJawLineOne.debug()
		debugContainer.addChild(debugLine)
	}
	let rightJawLineTwo = new line({
		x: positions.rightJawEdge.x,
		y: positions.rightJawEdge.y,
		x2: positions.rightJawChinEdge.x - positions.rightJawEdge.x,
		y2: positions.rightJawChinEdge.y - positions.rightJawEdge.y,
	})
	if(debug) {
		let debugLine = rightJawLineTwo.debug()
		debugContainer.addChild(debugLine)
	}
	let rightJawLineThree = new line({
		x: positions.rightJawChinEdge.x,
		y: positions.rightJawChinEdge.y,
		x2: positions.rightJawBottom.x - positions.rightJawChinEdge.x,
		y2: positions.rightJawBottom.y - positions.rightJawChinEdge.y,
	})
	if(debug) {
		let debugLine = rightJawLineThree.debug()
		debugContainer.addChild(debugLine)
	}


	let rightJawLineOnePoints = createBezierPoints(rightJawLineOne)
	let rightJawLineTwoPoints = createBezierPoints(rightJawLineTwo)
	let rightJawLineThreePoints = createBezierPoints(rightJawLineThree)

	let rightJawLinePoints = rightJawLineOnePoints.concat(rightJawLineTwoPoints).concat(rightJawLineThreePoints)


	

	let leftJawLine = new line({
		x: positions.leftJawStart.x,
		y: positions.leftJawStart.y,
		cp1: 40,
		cp2: 300,
		x2: positions.leftJawBottom.x - positions.leftJawStart.x,
		y2: positions.leftJawBottom.y - positions.leftJawStart.y, 
		cp3: positions.leftJawBottom.x - positions.leftJawStart.x - 100,
	})

	if(debug) {
		let debugLine = leftJawLine.debug()
		debugContainer.addChild(debugLine)
	}


	let leftJawLineOne = new line({
		x: positions.leftJawStart.x,
		y: positions.leftJawStart.y,
		x2: positions.leftJawEdge.x - positions.leftJawStart.x,
		y2: positions.leftJawEdge.y - positions.leftJawStart.y,
	})
	if(debug) {
		let debugLine = leftJawLineOne.debug()
		debugContainer.addChild(debugLine)
	}
	let leftJawLineTwo = new line({
		x: positions.leftJawEdge.x,
		y: positions.leftJawEdge.y,
		x2: positions.leftJawChinEdge.x - positions.leftJawEdge.x,
		y2: positions.leftJawChinEdge.y - positions.leftJawEdge.y,
	})
	if(debug) {
		let debugLine = leftJawLineTwo.debug()
		debugContainer.addChild(debugLine)
	}
	let leftJawLineThree = new line({
		x: positions.leftJawChinEdge.x,	
		y: positions.leftJawChinEdge.y,
		x2: positions.leftJawBottom.x - positions.leftJawChinEdge.x,
		y2: positions.leftJawBottom.y - positions.leftJawChinEdge.y,
	})
	if(debug) {
		let debugLine = leftJawLineThree.debug()
		debugContainer.addChild(debugLine)
	}

	let leftJawLineOnePoints = createBezierPoints(leftJawLineOne)
	let leftJawLineTwoPoints = createBezierPoints(leftJawLineTwo)
	let leftJawLineThreePoints = createBezierPoints(leftJawLineThree)

	let leftJawLinePoints = leftJawLineOnePoints.concat(leftJawLineTwoPoints).concat(leftJawLineThreePoints)
	



	let rightJawDrawLine = new Move({
		iterations: 1,
		lines: [[rightJawLine, false], [leftJawLine, true]],
	})
	let rightJawMark = new Mark({
		name: "rightJaw",
		marker: Pencil6B2,
		move: rightJawDrawLine,
		layer: faceShape
	})




	/*let rightNeckLine = new line({
		x: positions.rightJawStart.x - 25,
		y: positions.rightJawStart.y,
		cp1: -100,
		cp2: 300,
		x2: -80,
		y2: 450,
		cp3: -150,
		cp4: 300,
	})

	let rightNeckDrawLine = new Move({
		iterations: 1,
		line: rightNeckLine
	})

	let rightNeckMark = new Mark({
		name: "rightNeck",
		marker: Pencil6B2,
		move: rightNeckDrawLine,
		layer: faceShape
	})

	let leftNextLine = new line({
		x: positions.leftJawStart.x + 25,
		y: positions.leftJawStart.y,
		cp1: 100,
		cp2: 300,
		x2: 80,
		y2: 450,
		cp3: 150,
		cp4: 300,
	})

	let leftNeckDrawLine = new Move({
		iterations: 1,
		line: leftNextLine
	})

	let leftNeckMark = new Mark({
		name: "leftNeck",
		marker: Pencil6B2,
		move: leftNeckDrawLine,
		layer: faceShape
	})


	let rightNeckDrawLinePoints = createBezierPoints(rightNeckLine)
	let leftNeckDrawLinePoints = createBezierPoints(leftNextLine)
	let neckShapePoints = rightNeckDrawLinePoints.concat(leftNeckDrawLinePoints.reverse())

	let neckShape = new PIXI.Graphics()
	//neckShape.beginTextureFill({texture: whiteTextureSpriteLayer})
	neckShape.beginFill(0xffffff)
	neckShape.lineStyle(6, 0xffffff, 1)
	neckShape.drawPolygon(neckShapePoints)
	neckShape.endFill()
	//faceShape.addChild(neckShape)*/

	


	let skullTopToRightJawLinePoints = createBezierPoints(skullTopToRightJawLine)
	let skullTopToLeftJawLinePoints = createBezierPoints(skullTopToLeftJawLine)
	//let rightJawLinePoints = createBezierPoints(rightJawLine)
	//let leftJawLinePoints = createBezierPoints(leftJawLine)

	let headShapePoints = skullTopToRightJawLinePoints.concat(rightJawLinePoints).concat(leftJawLinePoints.reverse()).concat(skullTopToLeftJawLinePoints.reverse())

	let headShape = new PIXI.Graphics()
	if(drawWireframe) {
		headShape.beginFill(0xffffff)
	} else {
		headShape.beginTextureFill({texture: whiteTextureFill})
	}
	headShape.lineStyle(20, 0xffffff, 1)
	headShape.drawPolygon(headShapePoints)
	headShape.endFill()
	faceShape.addChild(headShape)

	

	//canvas.make(rightNeckMark)
	//canvas.make(leftNeckMark)

	
	if(drawWireframe) {
	} else {
		canvas.make(skullTopToRightJawMark)
		canvas.make(skullTopToLeftJawMark)
		canvas.make(rightJawMark)
	}

	faceShape.addChild(debugContainer)
	artContainer.addChild(debugNeckContainer)

	return faceShape;

}



updateDrawValues()

canvas.stage.addChild(artContainer)

app.render();









