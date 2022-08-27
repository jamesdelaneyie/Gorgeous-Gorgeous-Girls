import * as PIXI from "pixi.js";
import { Mark, Marker, Move, line } from "./draw.js";
import { Fill } from "./fill.js";
import { rand, randFloat, randFloatTwo } from "./math.js";
import { getPositionOnLine } from "./bezier.js";
import { bezier, getEasing  } from "./easing.js";
import chroma from "chroma-js";
import { Pencil2B, Pencil6B, Pen_1mm, Pen_2mm, feltMarker } from "./pencil-case.js";

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

const easingWrapper = document.createElement('div');
easingWrapper.id = 'easing-wrapper';
document.body.appendChild(easingWrapper);


PIXI.utils.skipHello();
let app = new PIXI.Application({
	width: 1024,
	height: 1024,
	antialias: true,
	autoDensity: true,
	resolution: window.devicePixelRatio || 1,
	roundPixels: true,
	powerPreference: "high-performance",
	backgroundColor: 0xffffff,
});

let canvas = app;
canvas.make = function (mark) {
	mark.make(canvas);
};
document.body.appendChild(app.view);

var artContainer = new PIXI.Container();
var background = new PIXI.Graphics();
background.beginFill(0xffffff);
background.drawRect(0, 0, app.view.width, app.view.height);
background.endFill();
artContainer.addChild(background);
let center = { x: app.view.width / 2, y: app.view.height / 2 };




let randomColor = rand(0, 360);
let hairColor = chroma(randomColor, 0.8, 0.5, 'hsl').hex();
hairColor = "#0fdd9a"
let highlightColor = chroma(randomColor + 230, 0.8, 0.6, 'hsl').hex();
highlightColor = "#0fdd9a"
var multiplyColor = chroma.blend(hairColor, highlightColor, 'multiply').hex();
var multiplyColor = "#0e9493"

let hairColorBrightness = chroma(hairColor).luminance()
let highlightColorBrightness = chroma(highlightColor).luminance()
let multiplyColorBrightness = chroma(multiplyColor).luminance()

if(multiplyColorBrightness > 0.25) {
	multiplyColor = chroma(multiplyColor).darken(0.8)
}

if(hairColorBrightness < highlightColorBrightness) {
	let replaceColor = highlightColor
	highlightColor = hairColor
	hairColor = replaceColor
}

hairColor = chroma(hairColor).hex()
multiplyColor = chroma(multiplyColor).hex()
highlightColor = chroma(highlightColor).hex()


var trace = PIXI.Sprite.from('https://i.imgur.com/wMQki0s.png');


trace.x = 176
trace.y = 156
trace.alpha = 0
app.stage.interactive = true;
app.stage.on('pointerdown', function () {
	trace.alpha = 1;
}).on('pointerup', function () {
	trace.alpha = 0;
})




let eyeContainer = new PIXI.Container();


var background = new PIXI.Graphics();
background.beginFill(0xff0000);
background.drawRect(0, 0, app.view.width, app.view.height);
background.endFill();
//eyeContainer.addChild(background);


let irisSize = 50
let pupilSize = 5.5//rand((irisSize/8), (irisSize/8)+5)

let leftEyeX = center.x
let leftEyeY = center.y

let pupilMarker = new Marker({
	color: multiplyColor,
	nib: { type: "round", size: pupilSize, sizeJitter: 1 },
	alpha: 0.25,
	fillAreaReducer: pupilSize / 5,
})

let pupilMove = new Move({
	iterations: 2,
	jitter: 0.1,
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
	layer: eyeContainer
})





let irisMarker = new Marker({
	color: hairColor,
	material: { size: 1 },
	nib: { type: "round", size: irisSize, sizeY: irisSize, angle: 20 },
	alpha: 0.12,
	fillAreaReducer: irisSize / 5,
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
	layer: eyeContainer
})

/*let fillMarkerTwo = new Marker({
	color: hairColor,
	material: {size: 0.5, sizeJitter: 0.2},
	nib: { type: "round", size: 2},
	alpha: 0.5,
	useSprites: true
});

let textureTwo = new Fill({
	x: leftEyeX - irisSize, 
	y: leftEyeY - irisSize - 5, 
	color: highlightColor,
	width: irisSize*2, 
	height: irisSize*2, 
	shape: "circle",
	layer: eyeContainer,
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

//textureTwo.fillTexture(canvas)*/



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
		y2: irisSize + 2,
		cp3: 0,
		cp4: irisSize,
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
		y: leftEyeY + irisSize + 1,
		cp1: 0,
		cp2: 0,
		x2: -irisSize - 8,
		y2: -irisSize,
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
		y2: -irisSize - 5,
		cp3: -10,
		cp4: -irisSize,
		density: rand(3,4),
		straighten: 2
	})
})


let irisBorderMark = new Mark({
	marker: irisBorder,
	move: irisBorderMoveOne,
	layer: eyeContainer
})


let irisBorderMarkTwo = new Mark({
	marker: irisBorderTwo,
	move: irisBorderMoveTwo,
	layer: eyeContainer
})

let irisBorderMarkThree = new Mark({
	marker: irisBorderThree,
	move: irisBorderMoveThree,
	layer: eyeContainer
})



canvas.make(irisMark)
canvas.make(irisBorderMark)
canvas.make(irisBorderMarkTwo)
canvas.make(irisBorderMarkThree)
canvas.make(pupilMark)


let eyeMask = new PIXI.Graphics();
eyeMask.beginFill(0x000000);
eyeMask.moveTo(leftEyeX + 100, leftEyeY + 50)
eyeMask.bezierCurveTo(leftEyeX + 40, leftEyeY - 70, leftEyeX-110, leftEyeY-35, leftEyeX-110, leftEyeY-35)
eyeMask.bezierCurveTo(leftEyeX - 70, leftEyeY + 55, leftEyeX - 50, leftEyeY + 55, leftEyeX, leftEyeY + 60)
eyeMask.endFill();
eyeContainer.mask = eyeMask;


artContainer.addChild(eyeContainer)



let eyeLidMarker = new Marker({
	color: multiplyColor,
	material: { size: 1 },
	nib: { type: "oval", size: 1, endSize: 15},
	alpha: 0.12,
	fadeEdges: true,
})

let eyeLidMove = new Move({
	iterations: 10,
	jitter: 0.7,
	pressure: {
		start: 10,
		map: {

		}
	},
	line: new line({
		x: leftEyeX + 100,
		y: leftEyeY + 45,
		cp1: -90,
		cp2: -140,
		x2: -260,
		y2: -100,
		cp3: -200,
		cp4: -40,
	})
})

let eyeLidMark = new Mark({
	marker: eyeLidMarker,
	move: eyeLidMove,
	layer: artContainer
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
		x2: -205,
		y2: -55,
		cp3: -190,
		cp4: 20
	})
})

let eyeLidBottomMark = new Mark({
	marker: eyeLidBottomMarker,
	move: eyeLidBottomMove,
	layer: artContainer
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
	layer: artContainer
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
		layer: artContainer
	})
	canvas.make(eyeLashMark)
	eyeLashGap += (eyeLashGap / i) + 0.02
	//console.log(eyeLashPositionEase)
}



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
	},*/
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


canvas.make(ovalMark)

app.stage.addChild(trace)

setTimeout(() => {

  
	(async () => {
	  /*const dataUri = app.renderer.plugins.extract.base64(app.stage);
	  const res = await fetch(dataUri);
	  const blob = await res.blob();
	  
	  const img = document.createElement('img');
	  img.src = URL.createObjectURL(blob);
	  img.style.position = "absolute";
	  img.style.top = "0px";
	  img.style.left = "1100px";
	  document.body.appendChild(img);
  
	  const link = document.createElement('a');
	  link.href = dataUri;
	  link.download = 'image.png';
	  link.innerHTML = 'Download';
	  document.body.appendChild(link);*/
  
	})();
  
	
	
  }, 1000);




const container = document.createElement("div");
container.innerText = `
  random hash: ${fxhash}\n
  some pseudo random values: [ ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()}, ${fxrand()},... ]\n
`;
document.body.append(container);
