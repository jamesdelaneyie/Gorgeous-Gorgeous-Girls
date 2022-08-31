let startTime = Date.now();
//import { projectSettings } from "./settings.js";
import * as PIXI from "pixi.js";
import { Mark, Marker, Move, line } from "./draw.js";
import { Fill } from "./fill.js";
import { rand, randFloat, randFloatTwo } from "./math.js";
import { getPositionOnLine } from "./bezier.js";
import { bezier, getEasing  } from "./easing.js";
import { getColors } from "./colors.js";
//import { Pencil2B, Pencil6B, Pen_1mm, Pen_2mm, feltMarker } from "./pencil-case.js";

console.log(fxhash); // the 64 chars hex number fed to your algorithm
console.log(fxrand()); // deterministic PRNG function, use it instead of Math.random()


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

let colorSwitchButton = document.createElement("button");
colorSwitchButton.innerHTML = "Colors On Off";
colorSwitchButton.style = "position: absolute; right: 0; top: 100px";
document.body.appendChild(colorSwitchButton);


let projectSettings
if (!localStorage.getItem("projectSettings")) {
	projectSettings = {
		"colors": true,
	}
	localStorage.setItem("projectSettings", JSON.stringify(projectSettings));
} else {
	projectSettings = JSON.parse(localStorage.getItem("projectSettings"));
	if(projectSettings.colors) {
		colorSwitchButton.innerHTML = "Use set colors";
	} else {
		colorSwitchButton.innerHTML = "Use random colors";
	}
}



colorSwitchButton.onclick = function () {
	projectSettings.colors = !projectSettings.colors;
	localStorage.setItem("projectSettings", JSON.stringify(projectSettings));
	window.location.reload();
}





const easingWrapper = document.createElement('div');
easingWrapper.id = 'easing-wrapper';
easingWrapper.style = 'position: fixed; bottom: 0; left: 0; width: 100%; height: 140px; pointer-events: none;background-color:grey;opacity:0';
document.body.appendChild(easingWrapper);

const easingWrapperToggle = document.createElement('div');
easingWrapperToggle.id = 'easing-wrapper-toggle';
easingWrapperToggle.style = 'position: fixed; top: 50px; right: 0; height: 40px; ;background-color:blue; width:40px; opacity:1';
easingWrapperToggle.onclick = function () {
	   easingWrapper.style.opacity = easingWrapper.style.opacity == '1' ? '0' : '1';
}
document.body.appendChild(easingWrapperToggle);


const exampleGallery = document.createElement('div');
exampleGallery.id = 'example-gallery';
exampleGallery.style = 'position: fixed; top: 200px; right: 0; width: 200px; height: 200px; overflow: scroll;background-color:grey;opacity:1';
for(let i = 1; i < 14; i++) {
	let exampleImage = document.createElement('img');
	exampleImage.src = './inputs/'+i+'.png';
	exampleImage.style = 'width: 100%; height: 100%; display: block';
	exampleGallery.append(exampleImage);
}
document.body.appendChild(exampleGallery);


PIXI.utils.skipHello();
let app = new PIXI.Application({
	width: 1024,
	height: 1024,
	antialias: true,
	autoDensity: true,
	resolution: window.devicePixelRatio || 1,
	roundPixels: true,
	autoStart: false,
	powerPreference: "high-performance",
	backgroundColor: 0xffffff,
});




let canvas = app;
canvas.make = function (mark) {
	mark.make(canvas);
};
document.body.appendChild(app.view);
//place the app.view in the centre of the screen
app.view.style.position = "absolute";
app.view.style.left = "50%";
app.view.style.top = "50%";
app.view.style.transform = "translate(-50%, -50%)";

var artContainer = new PIXI.Container();
var background = new PIXI.Graphics();
background.beginFill(0xffffff);
background.drawRect(0, 0, app.view.width, app.view.height);
background.endFill();
artContainer.addChild(background);
let center = { x: app.view.width / 2, y: app.view.height / 2 };




	

let colors
if(projectSettings.colors) {
	
	colors = getColors("random");

} else {

	colors = getColors();

}

let hairColor = colors.hairColor;
let highlightColor = colors.highlightColor;
let multiplyColor = colors.multiplyColor;
console.log(colors);



var trace = PIXI.Sprite.from('https://i.imgur.com/wMQki0s.png');


trace.x = 176
trace.y = 156
trace.alpha = 0
app.stage.interactive = true;
app.stage.on('pointerdown', function () {
	trace.alpha = 1;
	app.render();
}).on('pointerup', function () {
	trace.alpha = 0;
	app.render();
})



let fillMarkerTwo = new Marker({
	color: hairColor,
	material: {size: 0.5, sizeJitter: 0.2},
	nib: { type: "round", size: 2},
	alpha: 0.5,
	useSprites: true
});

let textureTwo = new Fill({
	x: 0, 
	y: 0,
	color: highlightColor,
	width: app.view.width, 
	height: app.view.height, 
	shape: "circle",
	layer: artContainer,
	angle: rand(0, 360),
	gap: rand(8, 12),
	marker: fillMarkerTwo,
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

textureTwo.fillTexture(canvas)



let faceBackground = new PIXI.Graphics()
faceBackground.beginFill(0xffffff);
faceBackground.moveTo(480, 130);
faceBackground.lineTo(320, 450);
faceBackground.lineTo(420, 800);
faceBackground.lineTo(550, 1024);
faceBackground.lineTo(900, 1024);
faceBackground.lineTo(1024, 950);
faceBackground.lineTo(1024, 230);
faceBackground.endFill();
artContainer.addChild(faceBackground);




let drawEye = function(x, y, irisSize, irisSizeY, pupilSize, eyeBrowMaxWidth, reverse=false) {
	let eyeContainer = new PIXI.Container();
	let eyeBallContainer = new PIXI.Container();


	var background = new PIXI.Graphics();
	background.beginFill(0xff0000);
	background.drawRect(0, 0, app.view.width, app.view.height);
	background.endFill();
	//eyeContainer.addChild(background);
	
	
	let leftEyeX = x
	let leftEyeY = y
	
	let pupilMarker = new Marker({
		color: multiplyColor,
		nib: { type: "round", size: pupilSize, sizeJitter: 1 },
		alpha: 0.25,
		fillAreaReducer: pupilSize / 5,
	})
	
	let pupilMove = new Move({
		iterations: 2,
		jitter: 0.2,
		line: new line({
			x: leftEyeX,
			y: leftEyeY,
			x2: 1,
			y2: 1,
		})
	})
	
	let pupilMark = new Mark({
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
			x: leftEyeX,
			y: leftEyeY,
			x2: 1,
			y2: 1,
		})
	})
	
	let irisMark = new Mark({
		marker: irisMarker,
		move: irisMove,
		layer: eyeBallContainer
	})
	
	
	
	
	
	let irisBorder = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "round", size: 5, endSize: 2 },
		alpha: 0.1,
	})
	
	let irisBorderMoveOne = new Move({
		iterations: 1,
		jitter: 0.2,
		pressure: {
			start: 10,
		},
		line: new line({
			x: leftEyeX + irisSize + 5,
			y: leftEyeY,
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
		nib: { type: "round", size: 4, endSize: 2 },
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
			x: leftEyeX + 3,
			y: leftEyeY + irisSizeY + 1,
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
		nib: { type: "round", size: 5, endSize: 4 },
		alpha: 0.08,
		fillAreaReducer: 1.5,
	})
	
	let irisBorderMoveThree = new Move({
		pressure: {
			start: 10,
		},
		iterations: 2,
		jitter: 0.1,
		line: new line({
			x: leftEyeX - irisSize - 3,
			y: leftEyeY + 2,
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
		nib: { type: "round", size: 5, endSize: 4 },
		alpha: 0.08,
		fillAreaReducer: 1.5,
	})

	let irisBorderMoveFour = new Move({
		pressure: {
			start: 10,
		},
		iterations: 2,
		jitter: 0.1,
		line: new line({
			x: leftEyeX ,
			y: leftEyeY - irisSize - 3,
			cp1: 0,
			cp2: 0,
			x2: irisSize + 5,
			y2: irisSize + 2,
			cp3: irisSize,
			cp4: 0,
			density: rand(3,4),
			straighten: 2
		})
	})
	
	
	let irisBorderMark = new Mark({
		marker: irisBorder,
		move: irisBorderMoveOne,
		layer: eyeBallContainer
	})
	
	
	let irisBorderMarkTwo = new Mark({
		marker: irisBorderTwo,
		move: irisBorderMoveTwo,
		layer: eyeBallContainer
	})
	
	let irisBorderMarkThree = new Mark({
		marker: irisBorderThree,
		move: irisBorderMoveThree,
		layer: eyeBallContainer
	})

	let irisBorderMarkFour = new Mark({
		marker: irisBorderFour,
		move: irisBorderMoveFour,
		layer: eyeBallContainer
	})
	
	
	
	canvas.make(irisMark)
	canvas.make(irisBorderMark)
	canvas.make(irisBorderMarkTwo)
	canvas.make(irisBorderMarkThree)
	canvas.make(irisBorderMarkFour)
	canvas.make(pupilMark)
	
	
	let eyeMask = new PIXI.Graphics();
	eyeMask.beginFill(0x000000);
	eyeMask.moveTo(leftEyeX + 100, leftEyeY + 50)
	eyeMask.bezierCurveTo(leftEyeX + 40, leftEyeY - 70, leftEyeX-110, leftEyeY-35, leftEyeX-110, leftEyeY-35)
	eyeMask.bezierCurveTo(leftEyeX - 70, leftEyeY + 55, leftEyeX - 50, leftEyeY + 55, leftEyeX, leftEyeY + 60)
	eyeMask.endFill();
	eyeBallContainer.mask = eyeMask;
	eyeBallContainer.addChild(eyeMask);
	
	
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
				map: {
		
				}
			},
			noise: {
				frequency: 0,//randFloat(0.01, 0.03),
				magnitude: 0,//rand(0, 50),
				smoothing: 0,
			},
			//	x: leftEyeX + rand(70, 100),
			//	y: leftEyeY + rand(20, 60),
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
			jitter: 0.7,
			pressure: {
				start: 10,
				map: {
		
				}
			},
			noise: {
				frequency: 0,//randFloat(0.01, 0.03),
				magnitude: 0,//rand(0, 50),
				smoothing: 0,
			},
			//	x: leftEyeX + rand(70, 100),
			//	y: leftEyeY + rand(20, 60),
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
	
	
	
	
/*
    x: leftEyeX + 100,
			y: leftEyeY + 45,
			cp1: -90,
			cp2: rand(-150, -130),
			x2: -260,
			y2: -100,
			cp3: -200,
			cp4: -40,
	*/
	let eyeLidMark = new Mark({
		marker: eyeLidMarker,
		move: eyeLidMove,
		layer: eyeContainer
	})
	
	canvas.make(eyeLidMark)
	
	let eyeLidBottomMarker = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "round", size: 1 , endSize: 15, maxSize: 10},
		alpha: 0.1,
	})
	
	let eyeLidBottomMove = new Move({
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
	
	let eyeLidBottomMark = new Mark({
		marker: eyeLidBottomMarker,
		move: eyeLidBottomMove,
		layer: eyeContainer
	})
	
	canvas.make(eyeLidBottomMark)
	
	
	
	let eyeLashBottomTwoStart = getPositionOnLine(eyeLidBottomMove.line, 0.5)
	let eyeLashBottomMoveTwo = new Move({
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
	
	let eyeLidBottomMarkerTwo = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "round", size: 2 , endSize: 15, maxSize: 10},
		alpha: 0.1,
	})
	
	
	let eyeLashBottomMarkTwo = new Mark({
		marker: eyeLidBottomMarkerTwo,
		move: eyeLashBottomMoveTwo,
		layer: eyeContainer
	})
	
	canvas.make(eyeLashBottomMarkTwo)
	
	
	let eyeLashMarker = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "round", size: 4, endSize: 2, maxSize: 10},
		alpha: 0.12,
	})
	
	
	
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
		canvas.make(eyeLashMark)
		eyeLashGap += (eyeLashGap / i) + 0.02
	}

	let eyeBrowMarker = new Marker({
		color: multiplyColor,
		material: { size: 1 },
		nib: { type: "round", size: 2 },
		alpha: 0.1,
	})

	let eyeBrowMove = new Move({
		iterations: 1,
		jitter: 0,
		line: new line({
			x: leftEyeX + 100,
			y: leftEyeY - 100,
			x2: -200,
			y2: -20,
			cp1: rand(0, -100),
			cp2: rand(0, -100),
			cp3: -200,
			cp4: -20,
		})
	})

	let eyeBrowMark = new Mark({
		marker: eyeBrowMarker,
		move: eyeBrowMove,
		layer: eyeContainer
	})

	canvas.make(eyeBrowMark)

	if(reverse == true) {
		//eyeContainer.scale.x *= -1
		//eyeContainer.position.x = 1700
		
	}
	
	artContainer.addChild(eyeContainer)
	
}


app.stage.addChild(artContainer)

let leftEyeX = center.x + rand(-50, 50)
let rightEyeX = leftEyeX + 350
let irisSize = rand(30, 60)
let irisSizeY = rand(30, 60)
let pupilSize = rand(5, 10)
let eyeBrowMaxWidth = rand(10, 20)

drawEye(leftEyeX, center.y, irisSize, irisSizeY, pupilSize, eyeBrowMaxWidth)
drawEye(rightEyeX, center.y, irisSize, irisSizeY, pupilSize, eyeBrowMaxWidth, true)

//add the time 
app.stage.addChild(trace)

app.render();

let endTime = Date.now()
//console log the time it took to render the scene in seconds
let renderTime = (endTime - startTime) / 1000
// create a new div element and append it to the body
let newDiv = document.createElement("div")
newDiv.innerHTML = "Render time: " + renderTime + " seconds"
newDiv.style = "position: fixed; top: 0; right: 0; color: white; background-color: black; padding: 10px; font-family: monospace; font-size: 20px; font-weight: bold;"
document.body.appendChild(newDiv)





/*
let ovalMarker = new Marker({
	color: multiplyColor,
	material: { size: 1 },
	nib: { type: "oval", size: 3, sizeY: 5, angle:0, endAngle: -90, endSize: 1 },
	alpha: 0.2,
	fadeEdges: true,
})

let ovalMove = new Move({
	iterations: 5,
	jitter: 3,
	pressure: {
		//start: 4,
		//end: 0
		//easing: 'linear',
	},
	/*hold: {
		start: 1,
		end: 1
	},
	noise: {
		frequency: 0.01,//randFloat(0.01, 0.03),
		magnitude: 20,//rand(0, 50),
		smoothing: 5,
	},
	line: new line({
		x: 100,
		y: 100,
		x2: 300,
		y2: 300,
		cp1: 300,
		cp2: 0,
		density: 300
	})
})

let ovalMark = new Mark({
	marker: ovalMarker,
	move: ovalMove,
	layer: artContainer
})


//canvas.make(ovalMark)*/



setTimeout(() => {

  
	(async () => {
	  const dataUri = app.renderer.plugins.extract.base64(app.stage);
	  const res = await fetch(dataUri);
	  const blob = await res.blob();
	  
	  const img = document.createElement('img');
	  img.src = URL.createObjectURL(blob);
	  img.style.position = "absolute";
	  img.style.top = "0px";
	  img.style.left = "1100px";
	  //document.body.appendChild(img);
  
	  /*const link = document.createElement('a');
	  link.href = dataUri;
	  link.download = 'image.png';
	  link.innerHTML = 'Download';
	  document.body.appendChild(link);*/
  
	})();
  
	
	
  }, 1000);




const container = document.createElement("div");
container.style = "position: absolute; top: 100px; left: 50px; width: 400px; height: 50vh";
container.innerText = `
  random hash: ${fxhash}\n
  some pseudo random values: [ ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()},... ]\n
`;
document.body.append(container);
