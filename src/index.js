let startTime = Date.now();
//import { projectSettings } from "./settings.js";
import * as PIXI from "pixi.js";
import { SmoothGraphics as Graphics } from "@pixi/graphics-smooth";
import { Mark, Marker, Move, line } from "./draw.js";
import { Fill } from "./fill.js";
import { rand, randFloat, findClosestPoints } from "./math.js";
import { getPositionOnLine } from "./bezier.js";
import { bezier, getEasing  } from "./easing.js";
import { getColors } from "./colors.js";
import { Pencil2B, Pencil6B, Pen_1mm, Pen_2mm, feltMarker, Pencil6B2 } from "./pencil-case.js";
import { createBezierPoints } from "./bezier.js";
import { drawEllipse, drawEllipseCurves } from "./shapes.js";
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







const addAside = () => {
	const aside = document.createElement("aside")
	document.body.appendChild(aside)
}

const addFXHashValues = () => {
	const fxhashDiv = document.createElement("div")
	fxhashDiv.innerText = `fxHash: ${fxhash}\n\npseudo random values:\n[\n\t${fxrand()},\n\t${fxrand()},\n\t${fxrand()},\n\t${fxrand()}\n]`;
	document.querySelector("aside").appendChild(fxhashDiv)
}

const addRenderTime = () => {
	const endTime = Date.now()
	const renderTime = (endTime - startTime) / 1000

	const renderTimeDiv = document.createElement("div")
	renderTimeDiv.innerHTML = "Render time: " + renderTime + " seconds"
	renderTimeDiv.setAttribute("id", "renderTime")
	document.querySelector("aside").appendChild(renderTimeDiv)
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

addAside()
addFXHashValues()
addColorSwatchButton()





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









// Don't print PIXI.js banner
PIXI.utils.skipHello();

// Create a Pixi Application
let app = new PIXI.Application({
	width: 1024,
	height: 1024,
	antialias: false,
	//useContextAlpha: false,
	autoDensity: true,
	resolution: window.devicePixelRatio || 1,
	roundPixels: true,
	autoStart: false,
	powerPreference: "high-performance",
	backgroundColor: 0x00ff00,
});

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

const addColorSwatchesToAside = (colors) => {
	const colorSwatches = document.createElement("div")
	colorSwatches.setAttribute("id", "color-swatches")
	for(let i = 0; i < colors.length; i++) {
		const colorSwatch = document.createElement("div")
		colorSwatch.style.backgroundColor = colors[i]
		colorSwatches.appendChild(colorSwatch)
	}
	document.querySelector("aside").appendChild(colorSwatches)
}

addColorSwatchesToAside(colors)


const addFillBackground = (color, layer) => {

	let fillBackgroundMarker = new Marker({
		material: {size: 0.5, sizeJitter: 0.2},
		nib: { type: "round", size: 2},
		alpha: 0.5
	});

	let backgroundTexture = new Fill({
		x: 0, 
		y: 0,
		color: color,
		width: app.view.width, 
		height: app.view.height, 
		shape: "circle",
		layer: layer,
		angle: rand(0, 360),
		gap: rand(8, 12),
		marker: fillBackgroundMarker,
		moveStyles: {
			iterations: 10,
			jitter: 2,
			noise: {
				frequency: 0,
				magnitude: 0,
				smoothing: 0,
			}
		}
	});

	return backgroundTexture

}







const artContainer = new PIXI.Container();
const backgroundContainer = new PIXI.Container();

let whiteTexture = addFillBackground('#fcfcfc', backgroundContainer)
let whiteTextureLayer = whiteTexture.fillTexture()
//canvas.stage.addChild(whiteTextureLayer)

let theCanvas = document.getElementById('canvas')
let whiteTextureFill = new PIXI.Texture.from(theCanvas)
//artContainer.addChild(whiteTextureLayer)




let backgroundTexture = addFillBackground('#fcfcfc'/*highlightColor*/, backgroundContainer)
let backgroundLayer = backgroundTexture.fillTexture()
//canvas.stage.addChild(backgroundLayer)






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

const YAxisMaxAngle = 0//200
const XAxisMaxAngle = 0//200

let YAxisEllipseWidth = 80//rand(0, YAxisMaxAngle)
let XAxisEllipseWidth = rand(0, XAxisMaxAngle)

//Create a range slider input element and add it to the page
var YAxisSlider = document.createElement("INPUT");
YAxisSlider.setAttribute("max", "80");
YAxisSlider.setAttribute("min", "-80");
YAxisSlider.setAttribute("value", "-80");
YAxisSlider.setAttribute("step", "1");
YAxisSlider.setAttribute("orient", "horizontal");
YAxisSlider.setAttribute("type", "range");
document.body.appendChild(YAxisSlider);

var XAxisSlider = document.createElement("INPUT");
XAxisSlider.setAttribute("max", "80");
XAxisSlider.setAttribute("min", "-80");
XAxisSlider.setAttribute("value", "-80");
XAxisSlider.setAttribute("step", "1");
XAxisSlider.setAttribute("orient", "vertical");
XAxisSlider.setAttribute("type", "range");
document.body.appendChild(XAxisSlider);



//create a variable to store the value of the slider
const updateDrawValues = () => {

	  let XValue = XAxisSlider.value
	  let YValue = YAxisSlider.value

	  //use the variable to change the scale of the container
	  XAxisEllipseWidth = Number(XValue)
	  YAxisEllipseWidth = Number(YValue)

	  artContainer.removeChildren()

	  let faceDrawPositions = drawHeadSketch()
	  artContainer.addChild(faceDrawPositions.output)
	  //addReferenceImages()

	  app.render()
}

//add an event listener to the slider that calls the function updateValue when the value changes
YAxisSlider.addEventListener("input", updateDrawValues, false);
XAxisSlider.addEventListener("input", updateDrawValues, false);


const drawHeadSketch = () => {

	const headContainer = new PIXI.Container()
	const headHeight = 220//rand(300, 350)
	const headWidth = 220//rand(270, 300)

	const headCentreX = 510//rand(500, 550)
	const headCentreY = 400//rand(500, 550)

	const YAxisEllipsePoints = []
	const XAxisEllipsePoints = []

	const skullColor = 0x0000ff
	const jawColor = 0x0000ff
	const centrePointColor = 0x0000ff
	const faceSketchesColor = 0xff0000

	const isLeft = YAxisEllipseWidth < 0

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

	//Append the line isLeft to the aside in the DOM
	const aside = document.querySelector('aside');
	const headDirection = document.createElement('span');
	headDirection.classList.add('head-direction');
	headDirection.innerHTML = isLeft ? 'Facing Left' : 'Facing Right';
	aside.appendChild(headDirection);


	// X Axis Sketch Line
	const X_MIN_OUTCOME = 0.5;
	const X_AXIS_TOP_START = 0;
	const X_AXIS_TOP_END = 180;
	const X_AXIS_BOTTOM_START = 180;
	const X_AXIS_BOTTOM_END = 360;

	const XOutcome = rand(0, 1);
	//const isDown = XOutcome > X_MIN_OUTCOME;
	const isDown = XAxisEllipseWidth < 0
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

	//Append the line isTop to the aside in the DOM
	const headDirection2 = document.createElement('span');
	headDirection2.classList.add('head-direction');
	headDirection2.innerHTML = isDown ? 'Facing Down' : 'Facing Up';
	aside.appendChild(headDirection2);

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
	let leftCheekDistance = isLeft ? (headWidth - YAxisEllipseWidth) : (headWidth + YAxisEllipseWidth)

	const jawHeight = 100//rand(50, 100)
	const jawBottomYStart = (headCentreY + headHeight + jawHeight)
	const jawBottomY = isDown ? jawBottomYStart - (faceCentreDistanceY/2) : jawBottomYStart + (faceCentreDistanceY * 1.5)
	
	let jawBottomX
	if(isLeft) {
		jawBottomX = headCentreX - rightCheekDistance - (faceCentreDistanceX / 2) - (YAxisEllipseWidth/4)
	} else {
		jawBottomX = headCentreX - rightCheekDistance - (faceCentreDistanceX / 2) + (YAxisEllipseWidth/4)
	}
	//const jawBottomX = headCentreX - rightCheekDistance - (faceCentreDistanceX / 2) + (YAxisEllipseWidth/4)
	
	const jawEdgeY = isDown ? headCentreY + headHeight - (faceCentreDistanceY/2) : headCentreY + headHeight + (faceCentreDistanceY)

	let rightCheek = new Graphics()
	rightCheek.lineStyle(2, jawColor, 1)

	let rightJawStartX
	if(isLeft) {
		rightJawStartX = headCentreX + headWidth - (YAxisEllipseWidth/5)
	} else {
		rightJawStartX = headCentreX + headWidth - (YAxisEllipseWidth/5)
	}
	const rightJawStart = {x: rightJawStartX, y: headCentreY + 50}

	let rightJawEdgeX
	if(isLeft) {
		rightJawEdgeX = headCentreX + 160 - (YAxisEllipseWidth/3)
	} else {
		rightJawEdgeX = headCentreX + 160 
	}

	const rightJawEdge = {x: rightJawEdgeX, y: jawEdgeY}
	const rightJawBottom = {x: jawBottomX, y: jawBottomY}


	rightCheek.moveTo(rightJawStart.x, rightJawStart.y) // Right Jaw Top
	rightCheek.lineTo(rightJawEdge.x, rightJawEdge.y) // Jaw Edge
	rightCheek.lineTo(rightJawBottom.x, rightJawBottom.y) // Jaw Bottom
	headContainer.addChild(rightCheek)

	let leftCheek = new Graphics()
	leftCheek.lineStyle(2, jawColor, 1)

	let leftJawStartX 
	if(isLeft) {
		leftJawStartX = headCentreX - headWidth + (YAxisEllipseWidth/5)
	} else {
		leftJawStartX = headCentreX - headWidth + (YAxisEllipseWidth/5)
	}
	const leftJawStart = {x: leftJawStartX, y: headCentreY + 50}

	let leftJawEdgeX
	if(isLeft) {
		leftJawEdgeX = headCentreX - 160
	} else {
		leftJawEdgeX = headCentreX - 160 + (YAxisEllipseWidth/3)
	}
	const leftJawEdge = {x: leftJawEdgeX, y: jawEdgeY}
	const leftJawBottom = {x: jawBottomX, y: jawBottomY}

	leftCheek.moveTo(leftJawStart.x, leftJawStart.y) // Left Jaw Top
	leftCheek.lineTo(leftJawEdge.x, leftJawEdge.y) // Left Jaw Edge
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

	const headTiltAngle = 0// //rand(-15, 15)
	headContainer.angle = headTiltAngle

	//headContainer.skew.x = 1//rand(-0.1, 0.1)

	const headTilt = document.createElement('span');
	headTilt.innerHTML = 'Head Tilt: ' + headTiltAngle + '°';
	aside.appendChild(headTilt);


	let leftEyeSketch = new Graphics()
	leftEyeSketch.lineStyle(2, faceSketchesColor, 1)
	if(isLeft) {
		let leftEyeWidth = 55 - (YAxisEllipseWidth/4)
		let leftEyeHeight = 35
		let leftEyeX = faceCentreX - 110 + (YAxisEllipseWidth/1.5)
		let leftEyeY
		if(isDown) {
			leftEyeY = faceCentreY + 50 - (XAxisEllipseWidth/1.5)
		} else {
			leftEyeY = faceCentreY + 50 + (XAxisEllipseWidth/3)
		}
		leftEyeSketch.drawEllipse(leftEyeX, leftEyeY, leftEyeWidth, leftEyeHeight)
	} else {
		let leftEyeWidth = 55 * (YAxisEllipseWidth/75)
		let leftEyeHeight = 35 * (YAxisEllipseWidth/75)
		let leftEyeX = faceCentreX - 110
		if(leftEyeWidth < 55) {
			leftEyeWidth = 55
		}
		if(leftEyeHeight < 35) {
			leftEyeHeight = 35
		}
		let leftEyeY
		if(isDown) {
			leftEyeY = faceCentreY + 50 - (XAxisEllipseWidth/2)
		} else {
			leftEyeY = faceCentreY + 50 + (XAxisEllipseWidth/3)
		}
		leftEyeSketch.drawEllipse(leftEyeX, leftEyeY, leftEyeWidth, leftEyeHeight)
	}
	headContainer.addChild(leftEyeSketch)

	let leftPupil = new Graphics()
	leftPupil.beginFill(0x000000)
	let leftPupilX 
	let leftPupilY
	if(isLeft) {
		leftPupilX = faceCentreX - 110 + (YAxisEllipseWidth/1.1)
		if(isDown) {
			leftPupilY = faceCentreY + 50 - (XAxisEllipseWidth/1.5)
		} else {
			leftPupilY = faceCentreY + 50 + (XAxisEllipseWidth/3)
		}
	} else {
		leftPupilX = faceCentreX - 110
		if(isDown) {
			leftPupilY = faceCentreY + 50 - (XAxisEllipseWidth/2)
		} else {
			leftPupilY = faceCentreY + 50 + (XAxisEllipseWidth/3)
		}
		//leftPupilY = faceCentreY + 50
	}
	leftPupil.drawCircle(leftPupilX, leftPupilY, 5)
	leftPupil.endFill()
	headContainer.addChild(leftPupil)












	let rightEyeSketch = new Graphics()
	rightEyeSketch.lineStyle(2, faceSketchesColor, 1)
	if(isLeft) {
		let rightEyeWidth = 55 * (YAxisEllipseWidth/75)
		let rightEyeHeight = 35 * (YAxisEllipseWidth/75)
		let rightEyeX = faceCentreX + 110
		if(rightEyeWidth < 55) {
			rightEyeWidth = 55
		}
		if(rightEyeHeight < 35) {
			rightEyeHeight = 35
		}
		let rightEyeY
		if(isDown) {
			rightEyeY = faceCentreY + 50 - (XAxisEllipseWidth/2)
		} else {
			rightEyeY = faceCentreY + 50// + (XAxisEllipseWidth/2)
		}
		rightEyeSketch.drawEllipse(rightEyeX, rightEyeY, rightEyeWidth, rightEyeHeight)
	} else {
		let rightEyeWidth = 55 - (YAxisEllipseWidth/4)
		let rightEyeHeight = 35
		let rightEyeX = faceCentreX + 110 - (YAxisEllipseWidth/1.5)
		let rightEyeY
		if(isDown) {
			rightEyeY = faceCentreY + 50 - (XAxisEllipseWidth/1.5)
		} else {
			rightEyeY = faceCentreY + 50 + (XAxisEllipseWidth/3)
		}
		rightEyeSketch.drawEllipse(rightEyeX, rightEyeY, rightEyeWidth, rightEyeHeight)
		//rightEyeSketch.drawEllipse(faceCentreX + 110 - (YAxisEllipseWidth/1.5), faceCentreY + 50, (55 - (YAxisEllipseWidth/4)), 35)
	}

	let rightPupil = new Graphics()
	rightPupil.beginFill(0x000000)
	let rightPupilX
	let rightPupilY
	if(isLeft) {
		rightPupilX = faceCentreX + 110
		if(isDown) {
			rightPupilY = faceCentreY + 50 - (XAxisEllipseWidth/2)
		} else {
			rightPupilY = faceCentreY + 50// + (XAxisEllipseWidth/3)
		}
	} else {
		rightPupilX = faceCentreX + 110 - (YAxisEllipseWidth/1.1)
		if(isDown) {
			rightPupilY = faceCentreY + 50 - (XAxisEllipseWidth/2)
		} else {
			rightPupilY = faceCentreY + 50 + (XAxisEllipseWidth/3)
		}

	}
	rightPupil.drawCircle(rightPupilX, rightPupilY, 5)
	rightPupil.endFill()
	headContainer.addChild(rightPupil)

	

	headContainer.addChild(rightEyeSketch)

	let noseBottomSketch = new Graphics()
	noseBottomSketch.lineStyle(2, faceSketchesColor, 1)


	let noseCentreX = faceCentreX - 20
	let noseCentreY = faceCentreY + 180
	if(isLeft) {
		noseCentreX = noseCentreX + (YAxisEllipseWidth/5)
	} else {
		noseCentreX = noseCentreX - (YAxisEllipseWidth/5)
	}
	if(isDown) {
		noseCentreY = noseCentreY - XAxisEllipseWidth
	} else {
		noseCentreY = noseCentreY - (XAxisEllipseWidth/3)
	}
	let noseXStart = noseCentreX
	let noseXEnd = noseXStart + 40

	noseBottomSketch.moveTo(noseXStart, noseCentreY)
	noseBottomSketch.lineTo(noseXEnd, noseCentreY)
	headContainer.addChild(noseBottomSketch)




	let mouthXStart = faceCentreX - 50
	let mouthYStart = faceCentreY + 170 + (jawHeight/2)
	if(isLeft) {
		mouthXStart = mouthXStart + (YAxisEllipseWidth/3)
	} else {
		mouthXStart = mouthXStart - (YAxisEllipseWidth/3)
	}
	if(isDown) {
		mouthYStart = mouthYStart - (XAxisEllipseWidth/1)
	} else {
		mouthYStart = mouthYStart - (XAxisEllipseWidth/2.5)
	}

	let mouthXEnd = mouthXStart + 100

	let mouthSketch = new Graphics()
	mouthSketch.lineStyle(2, faceSketchesColor, 1)
	mouthSketch.moveTo(mouthXStart, mouthYStart)
	mouthSketch.lineTo(mouthXEnd, mouthYStart)
	headContainer.addChild(mouthSketch)


	artContainer.addChild(headContainer)
	headContainer.alpha = 0.2

	return {
		headWidth: headWidth,
		headHeight: headHeight,
		skullTopPoint: skullTopPoint, 
		rightJawStart: rightJawStart, 
		rightJawEdge: rightJawEdge, 
		rightJawBottom: rightJawBottom, 
		leftJawStart: leftJawStart, 
		leftJawEdge: leftJawEdge, 
		leftJawBottom: leftJawBottom,
		output: headContainer
	}

}








const drawFaceShape = (positions) => {

	let faceShape = new PIXI.Container()

	let skullTopToRightJawLine = new line({
		x: positions.skullTopPoint.x,
		y: positions.skullTopPoint.y,
		cp1: positions.headWidth,
		cp2: 0,
		x2: positions.rightJawStart.x - positions.skullTopPoint.x,
		y2: positions.rightJawStart.y - positions.skullTopPoint.y,
	})
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




	let skullTopToLeftJawLine = new line({
		x: positions.skullTopPoint.x,
		y: positions.skullTopPoint.y,
		cp1: -positions.headWidth,
		cp2: 0,
		x2: positions.leftJawStart.x - positions.skullTopPoint.x,
		y2: positions.leftJawStart.y - positions.skullTopPoint.y,
	})
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
		cp1: 0,
		cp2: 150,
		x2: positions.rightJawBottom.x - positions.rightJawStart.x,
		y2: positions.rightJawBottom.y - positions.rightJawStart.y, 
		cp3: positions.rightJawBottom.x - positions.rightJawStart.x + 100,
	})
	let leftJawLine = new line({
		x: positions.leftJawStart.x,
		y: positions.leftJawStart.y,
		cp1: 0,
		cp2: 150,
		x2: positions.leftJawBottom.x - positions.leftJawStart.x,
		y2: positions.leftJawBottom.y - positions.leftJawStart.y, 
		cp3: positions.leftJawBottom.x - positions.leftJawStart.x - 100,
	})



	let rightJawDrawLine = new Move({
		iterations: 1,
		line: rightJawLine,
		lines: [[rightJawLine, false], [leftJawLine, true]]
	})
	let rightJawMark = new Mark({
		name: "rightJaw",
		marker: Pencil6B2,
		move: rightJawDrawLine,
		layer: faceShape
	})






	let leftJawDrawLine = new Move({
		iterations: 1,
		line: leftJawLine
	})
	let leftJawMark = new Mark({
		name: "leftJaw",
		marker: Pencil6B2,
		move: leftJawDrawLine,
		layer: faceShape
	})



	let rightNeckLine = new line({
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
	faceShape.addChild(neckShape)



	let skullTopToRightJawLinePoints = createBezierPoints(skullTopToRightJawLine)
	let skullTopToLeftJawLinePoints = createBezierPoints(skullTopToLeftJawLine)
	let rightJawLinePoints = createBezierPoints(rightJawLine)
	let leftJawLinePoints = createBezierPoints(leftJawLine)

	let headShapePoints = skullTopToRightJawLinePoints.concat(skullTopToLeftJawLinePoints.reverse()).concat(leftJawLinePoints.reverse()).concat(rightJawLinePoints)

	let headShape = new PIXI.Graphics()
	//headShape.beginTextureFill({texture: whiteTextureSpriteLayer})
	headShape.beginFill(0xffffff)
	headShape.lineStyle(0, 0xffffff, 1)
	headShape.drawPolygon(headShapePoints)
	headShape.endFill()

	canvas.make(rightNeckMark)
	canvas.make(leftNeckMark)

	canvas.make(skullTopToRightJawMark)
	canvas.make(skullTopToLeftJawMark)
	canvas.make(rightJawMark)
	canvas.make(leftJawMark)

	faceShape.addChild(headShape)

	return faceShape;

}



updateDrawValues()


canvas.stage.addChild(artContainer)

setTimeout(() => {
	updateDrawValues()
}, 100)






app.render();
addRenderTime();


/*
 *
 * 	Render the image to an img element
 *  and then setup a download link
 * 
 */

(async () => {
	const dataUri = app.renderer.plugins.extract.base64(app.stage);
	const res = await fetch(dataUri);
	const blob = await res.blob();
	
	const img = document.createElement('img');
	img.src = URL.createObjectURL(blob);
	document.querySelector("aside").appendChild(img)


	const link = document.createElement('a');
	link.href = dataUri;
	link.download = ''+fxhash+'.png';
	link.innerHTML = 'Download';
	document.querySelector("aside").appendChild(link);

})();




