import * as PIXI from "pixi.js";
import { SmoothGraphics as Graphics } from "@pixi/graphics-smooth";
import { rand, randFloat, midpoint } from "./math.js";
import chroma from "chroma-js";
import {  polygonHachureLines } from "./fill-lines.js";
import { Move, Mark, line, Marker } from "./draw.js";

import {
	OldFilmFilter,
	KawaseBlurFilter,
	ConvolutionFilter,
} from "pixi-filters";

class Fill {
	constructor(options = {}) {
		this.options = options;
		this.layer = options.layer || new PIXI.Container();
		this.color = options.color || 0x505050;
		this.width = options.width || 0;
		this.height = options.height || 0;
		this.style = options.style || {};
        this.angle = options.angle || 0;
        this.gap = options.gap || 0;
        this.shape = options.shape || "square";
        this.marker = options.marker || new Marker();
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.moveStyles = options.moveStyles || {};
	}

    fillLines(canvas) {

        let drawPoints = [];

        if(this.shape == "square") {
            drawPoints = [
                { x: this.x, y: this.y },
                { x: this.x + this.width, y: this.y },
                { x: this.x + this.width, y: this.y + this.height },
                { x: this.x, y: this.y + this.height },
                { x: this.x, y: this.y }
            ];
        } else if(this.shape == "circle") {

            let number = 50; 
            let size = this.width; 
            let cx= size/2; 
            let cy = size/2; 
            let r = size/2;

            for(let i=0; i<=number; i++) {
                let ang = i*(Math.PI/(number/2));
                let left = cx + (r*Math.cos(ang));
                let top = cy + (r*Math.sin(ang));
                let offset = rand(0, 0);
                drawPoints.push({x: this.x + left + offset, y: this.y + top + offset});
            }

        } else if(this.shape == "polygon") {

        }

        /*for(let i = 0; i < squarePoints.length; i++) {
            let offset = rand(0, 40)
            squarePoints[i].x += offset;
            squarePoints[i].y += offset;
        }*/

        let fillLines = polygonHachureLines(this.x, this.y, this.width/2, this.height/2, drawPoints, this.gap, this.angle, false, false, true);

        let linesToDraw = []
        for(let i = 0; i < fillLines.length; i++) {
            let x = fillLines[i][0][0];
            let y = fillLines[i][0][1];
            let x2 = fillLines[i][1][0] - fillLines[i][0][0];
            let y2 = fillLines[i][1][1] - fillLines[i][0][1];

            let line = {
                x: x,
                y: y,
                x2: x2,
                y2: y2,
            }
            linesToDraw.push(line);

        }

        for (let i = 0; i < linesToDraw.length; i++) {

            if(linesToDraw[i].x2 == 0) {
                continue
            }
        
            let theLine = linesToDraw[i];
        
            let theMidpoint = midpoint(theLine.x, theLine.y, theLine.x + theLine.x2, theLine.y + theLine.y2);
        
            let controlPointMod = (theLine.x - theMidpoint[0]) * -1
            let controlPointModTwo = (theLine.y - theMidpoint[1]) * -1
        
            let theLength = Math.sqrt(Math.pow(theLine.x2, 2) + Math.pow(theLine.y2, 2));
            
            var offsetX = (theLength/3) * -1
            var offsetY = (theLength/3) * -1
        
            controlPointMod = controlPointMod + rand(offsetX, 0)
            controlPointModTwo = controlPointModTwo + rand(offsetY, 0)

            let myLine = new line({
                x: theLine.x,
                y: theLine.y,
                cp1: controlPointMod,
                cp2: controlPointModTwo,
                x2: theLine.x2,
                y2: theLine.y2
            });
            
            let myMove = new Move({
                line: myLine,
                jitter: this.moveStyles.jitter,
                noise: this.moveStyles.noise,
            })

            //console.log(myMove)

            let myMark = new Mark({
                marker: this.marker,
                move: myMove,
                layer: this.layer
            });

            myMark.make(canvas);


        }

        
    }

	fillTexture(canvas) {
		let background = new Graphics();
        let color = PIXI.utils.string2hex(this.color);
		background.beginFill(color, 1);
		background.drawRect(this.x, this.y, this.width, this.height);
		background.endFill();

		let lighten = chroma
			.scale([this.color, "#ffffff"])
			.mode("lch")
			.colors(10);
		var lightenHex = chroma(lighten[5]).hex();
		var lightenHex = chroma(lightenHex).saturate(-0.5).hex();
		var lightenPixi = PIXI.utils.string2hex(lightenHex);
        
		let foreground = new Graphics();
        foreground.x = this.x;
        foreground.y = this.y;

		for (var i = 0; i < 100000; i++) {
			let randomAlpha = randFloat(0, 0.065);
			foreground.beginFill(lightenPixi, randomAlpha);
			foreground.drawCircle(
				rand(0, this.width),
				rand(0, this.height),
				rand(0.5, 0.9)
			);
			foreground.endFill();
		}

		let grain = new OldFilmFilter({
			sepia: 0.0,
			noise: 0.06,
			noiseSize: 2,
			scratch: 0.0,
			scratchDensity: 0.0,
			scratchWidth: 0.0,
			vignetting: 0.0,
			vignettingAlpha: 0.0,
			vignettingBlur: 0.0,
			seed: 0.1,
		});
		let blur = new KawaseBlurFilter(0.01);
		let sharpnessMatrix = new ConvolutionFilter(
			[0, -1, 0, -1, 5, -1, 0, -1, 0],
			250,
			250
		);
		foreground.alpha = 1;
		foreground.filters = [blur, sharpnessMatrix, grain];
        
        var gradientCanvas = document.createElement('canvas');
        gradientCanvas.width  = this.width;
        gradientCanvas.height = this.height;
        var ctx = gradientCanvas.getContext('2d');
        const gradient = ctx.createLinearGradient(this.width/2, 0, this.width/2, this.height);

        gradient.addColorStop(0, 'black');
        gradient.addColorStop(.5, 'white');
        gradient.addColorStop(1, 'black');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        var sprite = new PIXI.Sprite(PIXI.Texture.from(gradientCanvas));
        sprite.x = this.x
        sprite.y = this.y
        this.layer.addChild(sprite)
        foreground.mask = sprite;

		this.layer.addChild(background);
		this.layer.addChild(foreground);

        canvas.stage.addChild(this.layer);

	}

}

export { Fill };