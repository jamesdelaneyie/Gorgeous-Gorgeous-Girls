let startTime = Date.now();
//import { projectSettings } from "./settings.js";
import * as PIXI from "pixi.js";
import { Mark, Marker, Move, line } from "./draw.js";
import { Fill } from "./fill.js";
import { rand, randFloat } from "./math.js";
import { getPositionOnLine } from "./bezier.js";
import { bezier, getEasing  } from "./easing.js";
import { getColors } from "./colors.js";
import { Pencil2B, Pencil6B, Pen_1mm, Pen_2mm, feltMarker } from "./pencil-case.js";
import { createBezierPoints } from "./bezier.js";
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
addRenderTime()
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







const easingWrapper = document.createElement('div');
easingWrapper.id = 'easing-wrapper';
easingWrapper.style = 'position: fixed; bottom: 0; left: 0; width: calc(100% - 300px); height: 140px; overflow-x:scroll; display: flex; background-color:grey;opacity:1;z-index:10';
document.body.appendChild(easingWrapper);

const easingWrapperToggle = document.createElement('div');
easingWrapperToggle.id = 'easing-wrapper-toggle';
easingWrapperToggle.style = 'position: fixed; top: 50px; right: 0; height: 40px; ;background-color:blue; width:40px; opacity:1';
easingWrapperToggle.onclick = function () {
	easingWrapper.style.opacity = easingWrapper.style.opacity == '1' ? '0' : '1';
}
//document.body.appendChild(easingWrapperToggle);


const exampleGallery = document.createElement('div');
exampleGallery.id = 'example-gallery';
exampleGallery.style = 'position: fixed; top: 200px; right: 0; width: 500px; height: 500px; overflow: scroll;background-color:grey;opacity:1';
for(let i = 1; i < 14; i++) {
	let exampleImage = document.createElement('img');
	exampleImage.src = './inputs/'+i+'.png';
	exampleImage.style = 'width: 100%; height: 100%; display: block';
	exampleGallery.append(exampleImage);
}
//document.body.appendChild(exampleGallery);



// Don't print PIXI.js banner
PIXI.utils.skipHello();

// Create a Pixi Application
let app = new PIXI.Application({
	width: 2048,
	height: 2048,
	antialias: true,
	autoDensity: true,
	resolution: window.devicePixelRatio || 1,
	roundPixels: true,
	autoStart: false,
	powerPreference: "high-performance",
	backgroundColor: 0xff00ff,
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

const addCanvasBackground = () => {

	var artContainer = new PIXI.Container();
	/*var background = new PIXI.Graphics();
	background.beginFill(0xffffff);
	background.drawRect(0, 0, app.view.width, app.view.height);
	background.endFill();
	artContainer.addChild(background);*/
	
	app.stage.addChild(artContainer)
	return artContainer
}

const artContainer = addCanvasBackground()



	

let colors
if(projectSettings.colors) {
	
	colors = getColors("random");

} else {

	colors = getColors();

}

let hairColor = colors.hairColor;
let highlightColor = colors.highlightColor;
let multiplyColor = colors.multiplyColor;
//console.log(colors);


const addFillBackground = (color) => {

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
		layer: artContainer,
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

	//backgroundTexture.fillTexture(canvas)
	return backgroundTexture

}




let drawEye = function(x, y, irisSize, irisSizeY, pupilSize, eyeBrowMaxWidth, reverse=false) {

	let eyeContainer = new PIXI.Container();
	let eyeBallContainer = new PIXI.Container();
	
	
	let leftEyeX = x
	let leftEyeY = y
	
	let pupilMarker = new Marker({
		color: multiplyColor,
		nib: { type: "round", size: pupilSize, sizeJitter: 1 },
		alpha: 0.25,
		fillAreaReducer: pupilSize / 5,
	})

	let pupilX = leftEyeX + pupilDirectionX
	let pupilDrawX = pupilX + pupilOffsetX

	let pupilY = leftEyeY + pupilDirectionY
	let pupilDrawY = pupilY + pupilOffsetY

	let pupilMove = new Move({
		iterations: 2,
		jitter: 0.2,
		line: new line({
			x: pupilDrawX,
			y: pupilDrawY,
			x2: 1,
			y2: 1,
		})
	})
	
	let pupilMark = new Mark({
		name: "Pupil",
		marker: pupilMarker,
		move: pupilMove,
		layer: eyeBallContainer
	})
	
	
		
	let irisMarker = new Marker({
		color: hairColor,
		material: { size: 1 },
		nib: { type: "oval", size: irisSize, sizeY: irisSizeY, angle: 0 },
		alpha: 0.12,
		fillAreaReducer: irisSize / 5
	})
	
	let irisMove = new Move({
		iterations: 1,
		jitter: 0,
		line: new line({
			x: pupilX,
			y: pupilY,
			x2: 1,
			y2: 1,
		})
	})
	
	let irisMark = new Mark({
		name: "Iris",
		marker: irisMarker,
		move: irisMove,
		layer: eyeBallContainer
	})
	
	
	let irisBorder1StartWidth = irisBorderWidth
	let irisBorder1EndWidth = Math.abs(irisBorderWidth / 2)

	let irisBorder2StartWidth = irisBorder1EndWidth
	let irisBorder2EndWidth = irisBorder2StartWidth * 2

	
	let irisBorder = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "round", size: irisBorder1StartWidth, endSize: irisBorder1EndWidth },
		alpha: 0.1,
	})
	
	let irisBorderMoveOne = new Move({
		iterations: 1,
		jitter: 0.2,
		pressure: {
			start: 10,
		},
		line: new line({
			x: pupilX + irisSize + 5,
			y: pupilY,
			cp1: 0,
			cp2: 0,
			x2: -irisSize,
			y2: irisSizeY + 2,
			cp3: 0,
			cp4: irisSizeY,
			density: rand(3,6),
			straighten: 2
		})
	})
	
	let irisBorderTwo = new Marker({
		color: multiplyColor,
		material: { size: 1},
		nib: { type: "round", size: irisBorder2EndWidth, endSize: irisBorder2StartWidth },
		alpha: 0.08,
	})
	
	let irisBorderMoveTwo = new Move({
		pressure: {
			start: 10,
		},
		iterations: 2,
		jitter: 0.2,
		reverse: true,
		line: new line({
			x: pupilX  + 3,
			y: pupilY + irisSizeY + 1,
			cp1: 0,
			cp2: 0,
			x2: -irisSize - 8,
			y2: -irisSizeY,
			cp3: -irisSize,
			cp4: 0,
			density: rand(3,6),
			straighten: 2
		})
	})
	
	
	let irisBorderThree = new Marker({
		color: multiplyColor,
		material: { size: 1},
		nib: { type: "round", size: irisBorder2EndWidth, endSize: irisBorder2EndWidth-1 },
		alpha: 0.08,
	})
	
	let irisBorderMoveThree = new Move({
		pressure: {
			start: 10,
		},
		iterations: 2,
		jitter: 0.1,
		line: new line({
			x: pupilX  - irisSize - 3,
			y: pupilY + 2,
			cp1: 0,
			cp2: 0,
			x2: irisSize,
			y2: -irisSizeY - 5,
			cp3: -10,
			cp4: -irisSize,
			density: rand(3,4),
			straighten: 2
		})
	})

	let irisBorderFour = new Marker({
		color: multiplyColor,
		material: { size: 1},
		nib: { type: "round", size: irisBorder2EndWidth-1, endSize: irisBorder1StartWidth },
		alpha: 0.08,
	})

	let irisBorderMoveFour = new Move({
		pressure: {
			start: 10,
		},
		iterations: 2,
		jitter: 0.1,
		line: new line({
			x: pupilX  ,
			y: pupilY - irisSizeY - 3,
			cp1: 0,
			cp2: 0,
			x2: irisSize + 5,
			y2: irisSizeY + 2,
			cp3: irisSize,
			cp4: 0,
			density: rand(4,5),
			straighten: 2
		})
	})
	
	
	let irisBorderMark = new Mark({
		name: "Iris Border",
		marker: irisBorder,
		move: irisBorderMoveOne,
		layer: eyeBallContainer
	})
	
	
	let irisBorderMarkTwo = new Mark({
		name: "Iris Border 2",
		marker: irisBorderTwo,
		move: irisBorderMoveTwo,
		layer: eyeBallContainer
	})
	
	let irisBorderMarkThree = new Mark({
		name: "Iris Border 3",
		marker: irisBorderThree,
		move: irisBorderMoveThree,
		layer: eyeBallContainer
	})

	let irisBorderMarkFour = new Mark({
		name: "Iris Border 4",
		marker: irisBorderFour,
		move: irisBorderMoveFour,
		layer: eyeBallContainer
	})
	

	const drawPupil = () => {
		canvas.make(irisMark)
		canvas.make(irisBorderMark)
		canvas.make(irisBorderMarkTwo)
		canvas.make(irisBorderMarkThree)
		canvas.make(irisBorderMarkFour)
		canvas.make(pupilMark)
	}

	drawPupil()



	
	if(reverse) {
		let eyeMask = new PIXI.Graphics();
		eyeMask.beginFill(0x000000);
		eyeMask.moveTo(leftEyeX - 100, leftEyeY + 50)
		eyeMask.bezierCurveTo(leftEyeX - 40, leftEyeY - 70, leftEyeX + 110, leftEyeY-35, leftEyeX + 110, leftEyeY-35)
		eyeMask.bezierCurveTo(leftEyeX + 70, leftEyeY + 55, leftEyeX + 50, leftEyeY + 55, leftEyeX, leftEyeY + 60)
		eyeMask.endFill();
		eyeBallContainer.mask = eyeMask;
		eyeBallContainer.addChild(eyeMask);
	} else {
		let eyeMask = new PIXI.Graphics();
		eyeMask.beginFill(0x000000);
		eyeMask.moveTo(leftEyeX + 100, leftEyeY + 50)
		eyeMask.bezierCurveTo(leftEyeX + 40, leftEyeY - 70, leftEyeX-110, leftEyeY-35, leftEyeX-110, leftEyeY-35)
		eyeMask.bezierCurveTo(leftEyeX - 70, leftEyeY + 55, leftEyeX - 50, leftEyeY + 55, leftEyeX, leftEyeY + 60)
		eyeMask.endFill();
		
		var eyeMaskSprite = new PIXI.Sprite(app.renderer.generateTexture(eyeMask));
	
		var eyeMaskSpriteWidth = eyeMaskSprite.width;
		var eyeMaskSpriteHeight = eyeMaskSprite.height;
		var blur = new PIXI.filters.BlurFilter(5);
		eyeMaskSprite.filters = [blur];


		eyeMaskSprite.x = leftEyeX - eyeMaskSpriteWidth/2;
		eyeMaskSprite.y = leftEyeY - eyeMaskSpriteHeight/2;
		
		//eyeBallContainer.mask = eyeMaskSprite;
		eyeBallContainer.mask = eyeMask;
		eyeBallContainer.addChild(eyeMask)
		
		//eyeBallContainer.addChild(eyeMaskSprite);
		
		//eyeBallContainer.mask = eyeMaskSprite;
	}
	
	
	eyeContainer.addChild(eyeBallContainer)
	
	
	


	let eyeLidMarker = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "oval", size: 1, endSize: eyeBrowMaxWidth},
		alpha: 0.12,
		fadeEdges: true,
	})

	let eyeLidMove

	if(reverse) {
		var endEyeLidX = rand(240, 200)
		var endEyeLidY = rand(-110, -90)
		eyeLidMove = new Move({
			iterations: 10,
			jitter: 0.7,
			pressure: {
				start: 10,
				easing: "ease-in-out",
				map: {
		
				}
			},
			noise: {
				frequency: 0,//randFloat(0.01, 0.03),
				magnitude: 0,//rand(0, 50),
				smoothing: 0,
			},
			line: new line({
				x: leftEyeX - 100, 
				y: leftEyeY + 45,
				cp1: rand(110, 70),
				cp2: rand(-150, -130),
				x2: endEyeLidX,
				y2: endEyeLidY,
				cp3: rand(210, 190),
				cp4: rand(-50, -30),
			})
		})
	} else {
		var endEyeLidX = rand(-240, -200)
		var endEyeLidY = rand(-110, -90)
		eyeLidMove = new Move({
			iterations: 10,
			jitter: 0.6,
			pressure: {
				start: 10,
				end: 0,
				map: {
		
				}
			},
			noise: {
				frequency: 0,//randFloat(0.01, 0.03),
				magnitude: 0,//rand(0, 50),
				smoothing: 0,
			},
			line: new line({
				x: leftEyeX + 100, 
				y: leftEyeY + 45,
				cp1: rand(-110, -70),
				cp2: rand(-150, -130),
				x2: endEyeLidX,
				y2: endEyeLidY,
				cp3: rand(-210, -190),
				cp4: rand(-50, -30),
			})
		})
	}
	
	
	
	

	let eyeLidMark = new Mark({
		name: "eyeLid",
		marker: eyeLidMarker,
		move: eyeLidMove,
		layer: eyeContainer
	})
	
	canvas.make(eyeLidMark)





	
	let eyeLidBottomMarker = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "round", size: 1},
		alpha: 0.1,
	})

	let eyeLidBottomMove
	if(reverse) {
	
		eyeLidBottomMove = new Move({
			iterations: 1,
			jitter: 0,
			line: new line({
				x: leftEyeX - 95,
				y: leftEyeY + 55,
				cp1: 100,
				cp2: 20,
				x2: endEyeLidX - 20,
				y2: endEyeLidY + 50,
				cp3: 190,
				cp4: 20
			})
		})
	} else {
		eyeLidBottomMove = new Move({
			iterations: 1,
			jitter: 0,
			line: new line({
				x: leftEyeX + 95,
				y: leftEyeY + 55,
				cp1: -100,
				cp2: 20,
				x2: endEyeLidX + 20,
				y2: endEyeLidY + 50,
				cp3: -190,
				cp4: 20
			})
		})
	}
	
	let eyeLidBottomMark = new Mark({
		marker: eyeLidBottomMarker,
		move: eyeLidBottomMove,
		layer: eyeContainer
	})
	
	//canvas.make(eyeLidBottomMark)
	
	
	
	let eyeLashBottomTwoStart = getPositionOnLine(eyeLidBottomMove.line, 0.5)
	let eyeLashBottomMoveTwo
	if(reverse) {
		eyeLashBottomMoveTwo = new Move({
			iterations: 1,
			jitter: 1,
			alphaJitter: 0.1,
			line: new line({
				x: eyeLashBottomTwoStart.x,
				y: eyeLashBottomTwoStart.y,
				x2: 80,
				y2: -80,
				cp1: 70,
			})	
		})
	} else {
		eyeLashBottomMoveTwo = new Move({
			iterations: 1,
			jitter: 1,
			alphaJitter: 0.1,
			line: new line({
				x: eyeLashBottomTwoStart.x,
				y: eyeLashBottomTwoStart.y,
				x2: -80,
				y2: -80,
				cp1: -70,
			})	
		})
	}
	
	let eyeLidBottomMarkerTwo = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "round", size: 2},
		alpha: 0.1,
	})
	
	
	let eyeLashBottomMarkTwo = new Mark({
		marker: eyeLidBottomMarkerTwo,
		move: eyeLashBottomMoveTwo,
		layer: eyeContainer
	})
	
	//canvas.make(eyeLashBottomMarkTwo)
	
	
	let eyeLashMarker = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "round", size: 4, endSize: 2, maxSize: 10},
		alpha: 0.12,
	})
	
	
	let eyeLashMarksTop = []
	if(reverse) { 
		//Draw Top Eyelashes
		let eyeLashEasing = getEasing('slight-ease')
		eyeLashEasing = bezier(eyeLashEasing[0], eyeLashEasing[1], eyeLashEasing[2], eyeLashEasing[3])
		let eyeLashGap = 0.075
		let startingPoint = 0.55//randFloatTwo(0.45, 0.65)
		for(let i = 1; i < 4; i++) {
			let eyeLashStart = eyeLashGap + startingPoint
			let eyeLashPositionEase = eyeLashEasing(eyeLashStart)
			let eyeLashPosition = getPositionOnLine(eyeLidMove.line, eyeLashPositionEase)
			let eyeLashMove = new Move({
				iterations: 1,
				jitter: 0.5,
				pressure: {
					start: 5,
					easing: 'last-out'
				},
				line: new line({
					x: eyeLashPosition.x,
					y: eyeLashPosition.y,
					x2: i * 7.5,
					y2: -20 + (i * -10),
					cp3: i * 7.5,
					cp4: 10,
					density: 30
				})
			})
			let eyeLashMark = new Mark({
				marker: eyeLashMarker,
				move: eyeLashMove,
				layer: eyeContainer
			})
			eyeLashMarksTop.push(eyeLashMark)
			eyeLashGap += (eyeLashGap / i) + 0.02
		}
	} else {
		let eyeLashEasing = getEasing('slight-ease')
		eyeLashEasing = bezier(eyeLashEasing[0], eyeLashEasing[1], eyeLashEasing[2], eyeLashEasing[3])
		let eyeLashGap = 0.075
		let startingPoint = 0.55//randFloatTwo(0.45, 0.65)
		for(let i = 1; i < 4; i++) {
			let eyeLashStart = eyeLashGap + startingPoint
			let eyeLashPositionEase = eyeLashEasing(eyeLashStart)
			let eyeLashPosition = getPositionOnLine(eyeLidMove.line, eyeLashPositionEase)
			let eyeLashMove = new Move({
				iterations: 1,
				jitter: 0.5,
				pressure: {
					start: 5,
					easing: 'last-out'
				},
				line: new line({
					x: eyeLashPosition.x,
					y: eyeLashPosition.y,
					x2: i * -7.5,
					y2: -20 + (i * -10),
					cp3: i * -7.5,
					cp4: -10,
					density: 30
				})
			})
			let eyeLashMark = new Mark({
				marker: eyeLashMarker,
				move: eyeLashMove,
				layer: eyeContainer
			})
			eyeLashMarksTop.push(eyeLashMark)
			eyeLashGap += (eyeLashGap / i) + 0.02
		}
	}

	for(let i = 0; i < eyeLashMarksTop.length; i++) {
		//canvas.make(eyeLashMarksTop[i])
	}
	














	let eyeLashMarkerBottom = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "round", size: 2, endSize: 1},
		alpha: 0.12,
	})


	let eyeLashMarks = [] 
	if(reverse) {
		let eyeLashEasing = getEasing('slight-ease')
		eyeLashEasing = bezier(eyeLashEasing[0], eyeLashEasing[1], eyeLashEasing[2], eyeLashEasing[3])
		let eyeLashGap = 0.075
		let startingPoint = 0.75//randFloatTwo(0.45, 0.65)
		for(let i = 1; i < 4; i++) {
			let eyeLashStart = eyeLashGap + startingPoint
			let eyeLashPositionEase = eyeLashEasing(eyeLashStart)
			let eyeLashPosition = getPositionOnLine(eyeLidBottomMove.line, eyeLashPositionEase)
			let eyeLashMove = new Move({
				iterations: 1,
				jitter: 0.5,
				pressure: {
					start: 5,
					easing: 'last-out'
				},
				line: new line({
					x: eyeLashPosition.x,
					y: eyeLashPosition.y,
					x2: 10,
					y2: 10,
					density: 30
				})
			})
			let eyeLashMark = new Mark({
				marker: eyeLashMarkerBottom,
				move: eyeLashMove,
				layer: eyeContainer
			})
			eyeLashMarks.push(eyeLashMark)
			eyeLashGap += (eyeLashGap / i) + 0.02
		}
	} else {
		let eyeLashEasing = getEasing('slight-ease')
		eyeLashEasing = bezier(eyeLashEasing[0], eyeLashEasing[1], eyeLashEasing[2], eyeLashEasing[3])
		let eyeLashGap = 0.075
		let startingPoint = 0.75//randFloatTwo(0.45, 0.65)
		for(let i = 1; i < 4; i++) {
			let eyeLashStart = eyeLashGap + startingPoint
			let eyeLashPositionEase = eyeLashEasing(eyeLashStart)
			let eyeLashPosition = getPositionOnLine(eyeLidBottomMove.line, eyeLashPositionEase)
			let eyeLashMove = new Move({
				iterations: 1,
				jitter: 0.5,
				pressure: {
					start: 5,
					easing: 'last-out'
				},
				line: new line({
					x: eyeLashPosition.x,
					y: eyeLashPosition.y,
					x2: -10,
					y2: 10,
					density: 30
				})
			})
			let eyeLashMark = new Mark({
				marker: eyeLashMarkerBottom,
				move: eyeLashMove,
				layer: eyeContainer
			})
			eyeLashMarks.push(eyeLashMark)
			eyeLashGap += (eyeLashGap / i) + 0.02
		}
	}

	for(let i = 0; i < eyeLashMarks.length; i++) {
		//canvas.make(eyeLashMarks[i])
	}
		


	

	let eyeLidAboveMarker = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "oval", size: 2, sizeY: 2, endSize: 0, angle: 20},
		alpha: 0.1,
	})


	let eyeLidFold
	if(reverse) {
		eyeLidFold = new Move({
			iterations: 1,
			jitter: 1,
			line: new line({
				x: eyeLidMove.line.x,
				y: eyeLidMove.line.y - 50,
				x2: eyeLidMove.line.x2,
				y2: 0,
				cp1: eyeLidMove.line.cp1,
				cp2: eyeLidMove.line.cp2,
				cp3: eyeLidMove.line.cp3,
				cp4: eyeLidMove.line.cp4,
			})	
		})
	} else {
		eyeLidFold = new Move({
			iterations: 1,
			jitter: 1,
			line: new line({
				x: eyeLidMove.line.x,
				y: eyeLidMove.line.y - 50,
				x2: eyeLidMove.line.x2,
				y2: 0,
				cp1: eyeLidMove.line.cp1,
				cp2: eyeLidMove.line.cp2,
				cp3: eyeLidMove.line.cp3,
				cp4: eyeLidMove.line.cp4,
			})	
		})
	}

	let eyeLidFoldMark = new Mark({
		marker: eyeLidAboveMarker,
		move: eyeLidFold,
		layer: eyeContainer
	})
	



	let eyeBrowMarker = new Marker({
		color: multiplyColor,
		material: { 
			size: 1 
		},
		nib: { 
			type: "oval", 
			size: 3, 
			sizeY: 5, 
			endSize: 0,
			//endSizeY: 10, 
			angle: 20, 
			endAngle: 90
		},
		alpha: 0.1,
		fillAreaReducer: 1,
		useSprites: false
	})

	let eyeBrowMove = new Move({
		iterations: 1,
		jitter: 0.7,
		noise: {
			frequency: 0.9,
			magnitude: 6,
			smoothing: 0,
		},
		line: new line({
		  x: reverse ? leftEyeX - 100 : leftEyeX + 100,
		  y: leftEyeY - 100,
		  x2: reverse ? 200 : -200,
		  y2: -20,
		  cp1: reverse ? rand(50, 100) : rand(-50, -100),
		  cp2: rand(0, -100),
		  cp3: reverse ? 200 : -200,
		  cp4: -20,
		})
	});

	
	let eyeBrowMark = new Mark({
		marker: eyeBrowMarker,
		move: eyeBrowMove,
		layer: eyeContainer
	})


	//canvas.make(eyeLidFoldMark)
	//canvas.make(eyeBrowMark)




	let eyeContainerRotation = randFloat(-0.05, 0.05)
	eyeContainer.rotation = eyeContainerRotation
	//set the pivot point to the center of the eye
	//eyeContainer.pivot = new PIXI.Point(680, 450)
	
	artContainer.addChild(eyeContainer)
	
}





let whiteTexture = addFillBackground('#fcfcfc')
whiteTexture.fillTexture(canvas)
let theCanvas = document.getElementById('canvas')
let whiteTextureFill = new PIXI.Texture.from(theCanvas)


let background = new PIXI.Graphics()
background.beginTextureFill({texture: whiteTextureFill})
background.drawRect(0, 0, 1, 1)
background.endFill()
artContainer.addChild(background)

let backgroundTexture = addFillBackground(highlightColor)
backgroundTexture.fillTexture(canvas)




/* Drawing Eyes

Need to figure out how to set the eye position based on the position of the head
Need to position eye coords by working out two arcs, horizontal and vertical, for position of the head
Then place the eyes on those arcs somewhere

Need to develop a system where the eyes can be rotated left and right, showing more or less of the eye
Need to add a highlight to the eyes
Need to add the sketchy variation of the eyes
Need to find the control points for at least 4 set options for the eyes

*/

let leftEyeX = center.x + rand(-50, 50)
let rightEyeX = leftEyeX + 350
let irisSize = rand(30, 50)
let irisSizeY = rand(irisSize, irisSize+rand(0, 10))
let pupilSize = rand(5, 10)
let eyeBrowMaxWidth = rand(10, 20)

let pupilDirectionX = rand(-25, 25)
let pupilDirectionY = rand(-10, 25)
let pupilOffsetX
let pupilOffsetY

if(pupilDirectionY > 0) {
	pupilOffsetY = rand(0, 10)
} else {
	pupilOffsetY = rand(-5, 0)
}

if(pupilDirectionX > 0) {
	pupilOffsetX = rand(0,10)
} else {
	pupilOffsetX = rand(-10,0)
}

let irisBorderWidth = rand(3,5)






var xAxisRotation = rand(0, 100)




let drawNose = (noseX, noseY) => {

	let noseContainer = new PIXI.Container()

	var noseX = leftEyeX + 120
	var noseY = 670

	var noseMarker = new Marker({
		color: hairColor,
		material: { size: 0.25,  sizeJitter: 0.25 },
		nib: { type: "oval", size: rand(1,4), endSize: rand(2,4), angle: 20, endAngle: 90 },
		alpha: 0.1,
		fadeEdges: true,
	})

	let noseHeight = rand(20, 70)
	var noseFill = new Fill({
		color: hairColor,
		width: rand(30,70),
		height: noseHeight,
		angle: -5,
		gap: 10, 
		marker: noseMarker,
		x: noseX + 15, 
		y: 600 - (noseHeight / 1.5),
		shape: "circle",
		layer: noseContainer,
		moveStyles: {
			iterations: 1,
			jitter: 2,
			noise: {
				frequency: 0.3,
				magnitude: 2,
				smoothing: 1,
			}
		}
	})

	noseFill.fillLines(canvas)




	var noseMarker = new Marker({
		color: hairColor,
		material: { size: 1 },
		nib: { type: "oval", size: 4, endSize: 5, angle: 20, endAngle: 90 },
		alpha: 0.05,
		fadeEdges: true,
	})




	var noseMove = new Move({
		iterations: 1,
		jitter: 0.5,
		pressure: {
			start: 10,
			easing: 'ease-in-out',
			end: 2
		},
		noise: {
			frequency: 0.01,//randFloat(0.01, 0.03),
			magnitude: 1,//rand(0, 50),
			smoothing: 0,
		},
		line: new line({
			x: noseX+10, 
			y: noseY+5,
			cp1: rand(40, 50),
			cp2: rand(25, 35),
			x2: rand(50, 70),
			y2: 0,
		})
	})

	var noseMark = new Mark({
		name: "nose",
		marker: noseMarker,
		move: noseMove,
		layer: noseContainer
	})
	
	canvas.make(noseMark)


	var noseMarker = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "oval", size: 1, endSize: 3},
		alpha: 0.12,
		fadeEdges: true,
	})

	var noseX = leftEyeX + 120
	var noseY = 670

	var noseMove = new Move({
		iterations: 5,
		jitter: 0.5,
		pressure: {
			start: 10,
			easing: 'ease-in-out',
			end: 2
		},
		noise: {
			frequency: 0.1,//randFloat(0.01, 0.03),
			magnitude: 2,//rand(0, 50),
			smoothing: 20,
		},
		line: new line({
			x: noseX, 
			y: noseY,
			cp1: 50,
			cp2: 50,
			x2: 80,
			y2: 0,
			density: 10,
			straighten: 1
		})
	})

	var noseMark = new Mark({
		name: "nose",
		marker: noseMarker,
		move: noseMove,
		layer: noseContainer
	})
	
	canvas.make(noseMark)
	//noseContainer.rotation = 1
	noseContainer.pivot.x = noseX+40
	noseContainer.pivot.y = noseY
	noseContainer.angle = -10
	noseContainer.x = noseX+40
	noseContainer.y = noseY



	artContainer.addChild(noseContainer)

	
	
}




function findClosestPoints(points1, points2) {
	let minDistance = Infinity;
	let minIndices = [-1, -1];
	for (let i = 0; i < points1.length; i++) {
	  for (let j = 0; j < points2.length; j++) {
		const distance = Math.sqrt((points1[i].x - points2[j].x)**2 + (points1[i].y - points2[j].y)**2);
		if (distance < minDistance) {
		  minDistance = distance;
		  minIndices = [i, j];
		}
	  }
	}
	return minIndices;
}


let ellipseDrawing = function(cx, cy, ds, de, w, h, array, layer, color) {
	var semicircle = new PIXI.Graphics();
	semicircle.lineStyle(1, color, 1)
	for (var i = ds; i < de; i ++) {
	  var angle = i * ((Math.PI * 2) / 360);
	  var x = Math.cos(angle) * w;
	  var y = Math.sin(angle) * h;
	  semicircle.beginFill(color);
	  semicircle.arc(cx+x, cy+y, 2, 0, 3);
	  semicircle.endFill();
	  array.push({x: cx+x, y: cy+y})
	}
	layer.addChild(semicircle)
}







/*
 *
 *  Draw the head shape
 * 
/*/

const drawHeadSketch = () => {

	const headContainer = new PIXI.Container()
	const headHeight = rand(300, 350)
	const headWidth = rand(270, 300)

	const headCentreX = rand(400, 550)
	const headCentreY = rand(400, 550)

	const YAxisEllipsePoints = []
	const XAxisEllipsePoints = []

	const YAxisMaxAngle = 200
	const XAxisMaxAngle = 200

	const YAxisEllipseWidth = rand(0, YAxisMaxAngle)
	const XAxisEllipseWidth = rand(0, XAxisMaxAngle)

	const skullColor = 0x0000ff
	const jawColor = 0x0000ff
	const centrePointColor = 0x0000ff
	const faceSketchesColor = 0xff0000


	// Skull Shape
	const headSkullShape = new PIXI.Graphics()
	headSkullShape.lineStyle(2, skullColor, 1)
	headSkullShape.drawEllipse(headCentreX, headCentreY, headWidth, headHeight)
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
	const isLeft = YOutcome > Y_MIN_OUTCOME;
	const YStartAngle = isLeft ? Y_AXIS_LEFT_START : Y_AXIS_RIGHT_START;
	const YEndAngle = isLeft ? Y_AXIS_LEFT_END : Y_AXIS_RIGHT_END;

	ellipseDrawing(headCentreX, headCentreY, YStartAngle, YEndAngle, YAxisEllipseWidth, headHeight, YAxisEllipsePoints, headContainer, skullColor);

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
	const isDown = XOutcome > X_MIN_OUTCOME;
	const XStartAngle = isDown ? X_AXIS_TOP_START : X_AXIS_BOTTOM_START;
	const XEndAngle = isDown ? X_AXIS_TOP_END : X_AXIS_BOTTOM_END;

	ellipseDrawing(headCentreX, headCentreY, XStartAngle, XEndAngle, headWidth, XAxisEllipseWidth, XAxisEllipsePoints, headContainer, skullColor);

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
	const faceCentrePoint = new PIXI.Graphics()
	faceCentrePoint.lineStyle(2, centrePointColor, 1)
	faceCentrePoint.drawCircle(faceCentreX, faceCentreY, 5)
	headContainer.addChild(faceCentrePoint)

	// Draw lines from the jaw to the chin to the centre of the face
	let rightCheekDistance = YOutcome > 0.5 ? YAxisEllipseWidth : -YAxisEllipseWidth
	let leftCheekDistance = YOutcome > 0.5 ? (headWidth - YAxisEllipseWidth) : (headWidth + YAxisEllipseWidth)

	const jawHeight = rand(50, 100)
	const jawBottomYStart = (headCentreY + headHeight + jawHeight)
	const jawBottomY = isDown ? jawBottomYStart - (faceCentreDistanceY/2) : jawBottomYStart + (faceCentreDistanceY * 1.5)
	const jawBottomX = headCentreX - rightCheekDistance - (faceCentreDistanceX / 2)
	const jawEdgeY = isDown ? headCentreY + headHeight - (faceCentreDistanceY/2) + rand(-75, 0): headCentreY + headHeight + (faceCentreDistanceY)

	let rightCheek = new PIXI.Graphics()
	rightCheek.lineStyle(2, jawColor, 1)

	const rightJawStart = {x: headCentreX + headWidth, y: headCentreY + 50}
	const rightJawEdge = {x: headCentreX + 200, y: jawEdgeY}
	const rightJawBottom = {x: jawBottomX, y: jawBottomY}


	rightCheek.moveTo(rightJawStart.x, rightJawStart.y) // Right Jaw Top
	rightCheek.lineTo(rightJawEdge.x, rightJawEdge.y) // Jaw Edge
	rightCheek.lineTo(rightJawBottom.x, rightJawBottom.y) // Jaw Bottom
	headContainer.addChild(rightCheek)

	let leftCheek = new PIXI.Graphics()
	leftCheek.lineStyle(2, jawColor, 1)

	const leftJawStart = {x: (headCentreX - rightCheekDistance) - leftCheekDistance, y: headCentreY + 50}
	const leftJawEdge = {x: (headCentreX - rightCheekDistance) - leftCheekDistance + 100, y: jawEdgeY}
	const leftJawBottom = {x: jawBottomX, y: jawBottomY}

	leftCheek.moveTo(leftJawStart.x, leftJawStart.y) // Left Jaw Top
	leftCheek.lineTo(leftJawEdge.x, leftJawEdge.y) // Left Jaw Edge
	leftCheek.lineTo(leftJawBottom.x, leftJawBottom.y) // Left Jaw Bottom

	headContainer.addChild(leftCheek)
		
	// Draw a dotted line from the facecenter to jawbottomX and jawbottomY
	let dottedLine = new PIXI.Graphics()
	dottedLine.lineStyle(2, jawColor, 1)
	dottedLine.moveTo(faceCentreX, faceCentreY)
	dottedLine.lineTo(jawBottomX, jawBottomY)
	headContainer.addChild(dottedLine)



	headContainer.pivot.x = headCentreX
	headContainer.pivot.y = headCentreY
	headContainer.x = headCentreX
	headContainer.y = headCentreY

	const headTiltAngle = rand(-15, 15)
	//headContainer.angle = headTiltAngle

	const headTilt = document.createElement('span');
	headTilt.innerHTML = 'Head Tilt: ' + headTiltAngle + '°';
	aside.appendChild(headTilt);


	let leftEyeSketch = new PIXI.Graphics()
	leftEyeSketch.lineStyle(2, faceSketchesColor, 1)
	leftEyeSketch.drawEllipse(faceCentreX - 120, faceCentreY + 50, 70, 50)
	//headContainer.addChild(leftEyeSketch)

	let rightEyeSketch = new PIXI.Graphics()
	rightEyeSketch.lineStyle(2, faceSketchesColor, 1)
	rightEyeSketch.drawEllipse(faceCentreX + 120, faceCentreY + 50, 70, 50)
	//headContainer.addChild(rightEyeSketch)

	let noseBottomSketch = new PIXI.Graphics()
	noseBottomSketch.lineStyle(2, faceSketchesColor, 1)

	let noseXStart = faceCentreX - (XAxisEllipseWidth/4)
	let noseXEnd = noseXStart + 40

	noseBottomSketch.moveTo(noseXStart, faceCentreY + 180)
	noseBottomSketch.lineTo(noseXEnd, faceCentreY + 180)
	//headContainer.addChild(noseBottomSketch)

	let mouthXStart = faceCentreX + (XAxisEllipseWidth/2)
	let mouthXEnd = mouthXStart + 100

	let mouthSketch = new PIXI.Graphics()
	mouthSketch.lineStyle(2, faceSketchesColor, 1)
	mouthSketch.moveTo(mouthXStart, faceCentreY + 220 + (jawHeight/2))
	mouthSketch.lineTo(mouthXEnd, faceCentreY + 220 + (jawHeight/2))
	//headContainer.addChild(mouthSketch)

	let hairLineSketch = new PIXI.Graphics()
	hairLineSketch.lineStyle(2, faceSketchesColor, 1)
	hairLineSketch.moveTo(faceCentreX - (XAxisEllipseWidth/2), faceCentreY - 180)
	hairLineSketch.lineTo(faceCentreX + (XAxisEllipseWidth/2), faceCentreY - 180)
	//headContainer.addChild(hairLineSketch)


	//artContainer.addChild(headContainer)
	headContainer.alpha = 0.05

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

let faceDrawPositions = drawHeadSketch()






let Pencil6B2 = new Marker({
    color: hairColor, 
	material: { size: 0.5, sizeJitter: 1 },
	nib: { type: "oval", size: 4, endSize: 6 },
	alpha: 0.1,
	fadeEdges: true,
    moveStyles: {
        iterations: 2,
        density: 200,
		jitter: 2,
		noise: {
			frequency: 0.1,
			magnitude: 1
		}
    }
})

let skullTopToRightJawLine = new line({
	x: faceDrawPositions.skullTopPoint.x,
	y: faceDrawPositions.skullTopPoint.y,
	cp1: faceDrawPositions.headWidth,
	cp2: 0,
	x2: faceDrawPositions.rightJawStart.x - faceDrawPositions.skullTopPoint.x,
	y2: faceDrawPositions.rightJawStart.y - faceDrawPositions.skullTopPoint.y,
})
let skullTopToRightJaw = new Move({
	iterations: 1,
	line: skullTopToRightJawLine
})
let skullTopToRightJawMark = new Mark({
	name: "skullTopToRightJaw",
	marker: Pencil6B2,
	move: skullTopToRightJaw,
	layer: artContainer
})
canvas.make(skullTopToRightJawMark)



let skullTopToLeftJawLine = new line({
	x: faceDrawPositions.skullTopPoint.x,
	y: faceDrawPositions.skullTopPoint.y,
	cp1: -faceDrawPositions.headWidth,
	cp2: 0,
	x2: faceDrawPositions.leftJawStart.x - faceDrawPositions.skullTopPoint.x,
	y2: faceDrawPositions.leftJawStart.y - faceDrawPositions.skullTopPoint.y,
})
let skullTopToLeftJaw = new Move({
	iterations: 1,
	line: skullTopToLeftJawLine
})
let skullTopToLeftJawMark = new Mark({
	name: "skullTopToLeftJaw",
	marker: Pencil6B2,
	move: skullTopToLeftJaw,
	layer: artContainer
})
canvas.make(skullTopToLeftJawMark)





let rightJawLine = new line({
	x: faceDrawPositions.rightJawStart.x,
	y: faceDrawPositions.rightJawStart.y,
	cp1: 0,
	cp2: 150,
	x2: faceDrawPositions.rightJawBottom.x - faceDrawPositions.rightJawStart.x,
	y2: faceDrawPositions.rightJawBottom.y - faceDrawPositions.rightJawStart.y, 
	cp3: faceDrawPositions.rightJawBottom.x - faceDrawPositions.rightJawStart.x + 100,
})
let rightJawDrawLine = new Move({
	iterations: 1,
	line: rightJawLine
})
let rightJawMark = new Mark({
	name: "rightJaw",
	marker: Pencil6B2,
	move: rightJawDrawLine,
	layer: artContainer
})
canvas.make(rightJawMark)




let leftJawLine = new line({
	x: faceDrawPositions.leftJawStart.x,
	y: faceDrawPositions.leftJawStart.y,
	cp1: 0,
	cp2: 150,
	x2: faceDrawPositions.leftJawBottom.x - faceDrawPositions.leftJawStart.x,
	y2: faceDrawPositions.leftJawBottom.y - faceDrawPositions.leftJawStart.y, 
	cp3: faceDrawPositions.leftJawBottom.x - faceDrawPositions.leftJawStart.x - 100,
})
let leftJawDrawLine = new Move({
	iterations: 1,
	line: leftJawLine
})
let leftJawMark = new Mark({
	name: "leftJaw",
	marker: Pencil6B2,
	move: leftJawDrawLine,
	layer: artContainer
})
canvas.make(leftJawMark)


let skullTopToRightJawLinePoints = createBezierPoints(skullTopToRightJawLine)
let skullTopToLeftJawLinePoints = createBezierPoints(skullTopToLeftJawLine)
let rightJawLinePoints = createBezierPoints(rightJawLine)
let leftJawLinePoints = createBezierPoints(leftJawLine)

let headShapePoints = skullTopToRightJawLinePoints.concat(skullTopToLeftJawLinePoints.reverse()).concat(leftJawLinePoints.reverse()).concat(rightJawLinePoints)

let leftJawFillShape = new PIXI.Graphics()
leftJawFillShape.beginTextureFill({texture: whiteTextureFill})
leftJawFillShape.drawPolygon(headShapePoints)
leftJawFillShape.endFill()
artContainer.addChild(leftJawFillShape)



artContainer.addChild(faceDrawPositions.output)


drawEye(leftEyeX, center.y, irisSize, irisSizeY, pupilSize, eyeBrowMaxWidth)
drawEye(rightEyeX, center.y, irisSize, irisSizeY, pupilSize, eyeBrowMaxWidth, true)


/*
var noseMove = new Move({
	iterations: 1,
	jitter: 0.5,
	pressure: {
		start: 10,
		easing: 'ease-in-out',
		end: 2
	},
	noise: {
		frequency: 0.01,//randFloat(0.01, 0.03),
		magnitude: 1,//rand(0, 50),
		smoothing: 0,
	},
	line: new line({
		x: noseX+10, 
		y: noseY+5,
		cp1: rand(40, 50),
		cp2: rand(25, 35),
		x2: rand(50, 70),
		y2: 0,
	})
})

var noseMark = new Mark({
	name: "nose",
	marker: noseMarker,
	move: noseMove,
	layer: noseContainer
})*/













app.render();



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




