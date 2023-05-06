
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
/*
import { Sprite2d, Container2d, AFFINE } from 'pixi-projection';
const container2D = new Container2d();
container2D.position.set(app.screen.width / 2, app.screen.height / 2);
container2D.scale.set(0.5);
app.stage.addChild(container2D);

const surface = new Sprite2d(PIXI.Texture.from('https://pixijs.io/examples/examples/assets/bg_plane.jpg'));
surface.name = "Projection Surface";
surface.anchor.set(0.5, 1.0);
surface.width = app.screen.width;
surface.height = app.screen.height;
surface.proj.affine = AFFINE.AXIS_X;
surface.position.set(app.screen.width / 2, 0);
surface.scale.y = -1;
surface.proj.setAxisY(new PIXI.Point(20, -100));
container2D.addChild(surface);*/


//drawEye(leftEyeX, center.y, irisSize, irisSizeY, pupilSize, eyeBrowMaxWidth)
//drawEye(rightEyeX, center.y, irisSize, irisSizeY, pupilSize, eyeBrowMaxWidth, true)

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

