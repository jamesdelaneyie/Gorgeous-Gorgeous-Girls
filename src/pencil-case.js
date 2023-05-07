import { Marker } from "./draw.js";

let Pencil2B = new Marker({
    color: '#505050', 
	material: { size: 0.5, sizeJitter: 0.25},
	nib: { type: "round", size: 1 },
	alpha: 0.1,
    moveStyles: {
        iterations: 10,
    }
})

let Pencil6B = new Marker({
    color: '#050505', 
	material: { size: 0.5, sizeJitter: 0.25},
	nib: { type: "round", size: 1.5 },
	alpha: 0.2,
    moveStyles: {
        iterations: 5,
        density: 500
    }
})

let Pen_1mm = new Marker({
    color: '#000000', 
    material: { size: 0.5, sizeJitter: 0.25},
    nib: { type: "round", size: 0.5 },
    alpha: 1,
    moveStyles: {
        iterations: 5,
        density: 1000,
    }
})

let Pen_2mm = new Marker({
    color: '#000000', 
    material: { size: 1 },
    nib: { type: "round", size: 1 },
    alpha: 1,
    moveStyles: {
        iterations: 5,
        density: 1000,
    }
})

let feltMarker = new Marker({
    color: '#000000',
    material: { size: 1, sizeJitter: 1},
    nib: { type: "round", size: 2 },
    alpha: 0.2,
    moveStyles: {
        iterations: 1,
        density: 2500,
    }
})

let Pencil6B2 = new Marker({
    color: '#000000', 
	material: { size: 0.5 },
	nib: { type: "round", size: 5 },
	alpha: 1,
	fillAreaReducer: 2,
	//fadeEdges: true,
	useSprites: true,
    moveStyles: {
        iterations: 2,
        density: 1000,
		alphaJitter: true,
		drawNoise: 3,
		jitter: 0,
		noise: {
			frequency: 0.01,
			magnitude: 3,
			smoothing: 2
		}
		//jitter: 0.2
		/*jitter: 0.2,
		pressure: {
			start: 1,
			end: 1,
			easing: 'easeOutQuad',
			map: {

			}
		},
		*/
    }
})

export { Pencil2B, Pencil6B, Pen_1mm, Pen_2mm, feltMarker, Pencil6B2 };


/*let ovalMarker = new Marker({
	color: multiplyColor,
	material: { size: 10 },
	nib: { type: "oval", size: 3, sizeY: 5, angle:0, endAngle: -90, endSize: 1 },
	alpha: 1,
	fadeEdges: true,
})

let ovalMove = new Move({
	iterations: 5,
	jitter: 10,
	pressure: {
		//start: 4,
		//end: 0
		easing: 'linear',
	},
	hold: {
		start: 1,
		end: 1
	},
	noise: {
		frequency: 0.01,//randFloat(0.01, 0.03),
		magnitude: 20, //rand(0, 50),
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


canvas.make(ovalMark)*/