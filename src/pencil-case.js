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

export { Pencil2B, Pencil6B, Pen_1mm, Pen_2mm, feltMarker };