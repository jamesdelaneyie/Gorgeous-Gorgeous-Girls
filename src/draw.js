import * as PIXI from "pixi.js";
import { SmoothGraphics as Graphics } from "@pixi/graphics-smooth";
import { createBezierPoints } from "./bezier.js";
import { rand, randFloat, mapNumbers, rotatePoints } from "./math.js";
import { bezier, drawSVG, getEasing } from "./easing";	
import { IPO } from "./bezier-spline-easing.js";
import { makeNoise2D } from "open-simplex-noise";
import chroma from "chroma-js";

const noise = makeNoise2D(Math.random());

class Marker {
	constructor({
        color="#505050", 
        material={size: 0.5},
        nib={type:"round", size:1},
        alpha=1,
        density=null,
        blend="normal",
        useSprites=false,
        fillAreaReducer=1,
        moveStyles=null,
        fadeEdges=false,
    } = {}) {
		this.color = color;
		this.material = material;
		this.nib = nib;
		this.alpha = alpha;
        this.density = density;
        this.blend = blend;
        this.useSprites = useSprites
        this.fillAreaReducer = fillAreaReducer
        this.moveStyles = moveStyles
        this.fadeEdges = fadeEdges
	}
}

class line {
	constructor({
		x=50,
		y=50,
		cp1=0,
		cp2=0,
		x2=100,
		y2=100,
		cp3 = x2,
		cp4 = y2,
		density = 1000,
        straighten = 0,
	} = {}) {
		this.x = x;
		this.y = y;
		this.cp1 = cp1;
		this.cp2 = cp2;
		this.x2 = x2;
		this.y2 = y2;
		this.cp3 = cp3;
		this.cp4 = cp4;
		this.density = density;
        this.straighten = straighten
	}

    debug() {
        let debug = new Graphics();
        debug.lineStyle(2, 0x00ff00, 1)

        let cp1Local = this.x + this.cp1;
        let cp2Local = this.y + this.cp2;

        let newEndX = this.x + this.x2;
        let newEndY = this.y + this.y2;

        let cp3Local = this.x + this.cp3;
        let cp4Local = this.y + this.cp4;

        debug.moveTo(this.x, this.y);
        debug.bezierCurveTo(cp1Local, cp2Local, cp3Local, cp4Local, newEndX, newEndY);

        debug.lineStyle(2, 0x00ff00, 1)
		debug.drawCircle(this.x, this.y, 4)
		debug.drawCircle(this.x + this.x2, this.y + this.y2, 4)
		debug.drawCircle(this.x + this.cp1, this.y + this.cp2, 4)
		debug.drawCircle(this.x + this.cp3, this.y + this.cp4, 4)
		debug.moveTo(this.x, this.y)
		debug.lineTo(this.x + this.cp1, this.y + this.cp2)
		debug.moveTo(this.x + this.x2, this.y + this.y2)
		debug.lineTo(this.x + this.cp3, this.y + this.cp4)
        
        return debug
    }
}

class Move {
	constructor(options = {}) {
        this.options = options;
        this.noise = options.noise || null
        this.density = options.density || 1000;
        this.hold = options.hold || null;
        this.pressure = options.pressure || null;
        this.line = options.line || new line({density:this.density});
        this.lines = options.lines || null;
		this.iterations = options.iterations || 1;
		this.jitter = options.jitter || 0;
        this.alphaJitter = options.alphaJitter || 0;
		this.reverse = options.reverse || false;
		this.angle = options.angle || 0;
	}
}





class Mark {
	constructor(options = {}) {
        this.options = options || {};
        this.name = options.name || "";
		this.marker = options.marker || new Marker();
		this.move = options.move || new Move({density: this.marker.density, pressure: {start:this.marker.nib.size, end: this.marker.nib.size, easing: null}});
		this.layer = options.layer || new Graphics();

	}

   
    /*
    * 
    * Make the mark!
    * 
    /*/
    make(app, marker=this.marker, move=this.move, layer=this.layer ) {

        // Container to hold the PIXI.Graphics objects
        let lineGraphic = new PIXI.Container(); 

        // Container to hold the PIXI.Sprite objects
        let spriteContainer = new PIXI.ParticleContainer(500000);

        // Convert the marker color to a hex value
        let color = PIXI.utils.string2hex(marker.color);
        

        // Apply marker properties to move properties if they exist
        // if the marker has a density, use that instead of the move density
        if(marker.density) {
            move.line.density = marker.density;
        }

        //if the marker has move styles defined, use those instead of the move styles
        if(marker.moveStyles != null) {
            for(let style in marker.moveStyles) {
                move[style] = marker.moveStyles[style];
            }
            // if one of those is density, use that instead of the move density
            if(marker.moveStyles.density) {
                move.line.density = marker.moveStyles.density;
            }
            if(marker.moveStyles.straighten) {
                move.line.straighten = marker.moveStyles.straighten;
            }
        }

        // Create an array of points to draw the line
        let bezierPoints = [];

        // If the move has multiple lines, create an array of points for each line
        // otherwise, create an array of points for the single line
        if(move.lines !== null) {
            if(move.lines.length > 1) {
                let allLinePoints = []
                for(let i = 0; i < move.lines.length; i++) {
                    if(marker.moveStyles.density) {
                        move.lines[i][0].density = marker.moveStyles.density;
                    }
                    if(marker.moveStyles.straighten) {
                        move.lines[i][0].straighten = marker.moveStyles.straighten;
                    }
                    let linePoints = createBezierPoints(move.lines[i][0], move.noise);
                    if(move.lines[i][1] == true) {
                        linePoints = linePoints.reverse()
                    }
                    allLinePoints.push(linePoints)
                }
                bezierPoints = allLinePoints.flat()
            }
        } else {
            bezierPoints = createBezierPoints(move.line, move.noise);
        }

        console.log(move.line)

        // Reverse the bezier points if the move is set to reverse
        if (move.reverse == true) {
            bezierPoints.reverse();
        }
        

        let widthFactor = 0;
        let easing = getEasing('linear')
        easing = bezier(easing[0], easing[1], easing[2], easing[3])


        
        
        let dotGraphic
        if(marker.useSprites != true) {
            dotGraphic = new Graphics();
        }

        let size
        if(marker.material.sizeJitter !== undefined) {
            size = marker.material.size + (Math.random() * marker.material.sizeJitter);
        } else {
            size = marker.material.size;
        }


        // For the number of iterations defined in the move, draw the line

        // TO DO, Option for variations in the bezier points

        for (var i = 0; i < move.iterations; i++) {

            // For each point in the bezier points array, draw a dot
            for (var j = 0; j < bezierPoints.length; j++) {

                // Get the current point in the line
                var drawPoint = [bezierPoints[j].x, bezierPoints[j].y]

                // Get the current percent of the line
                var percent = (j / bezierPoints.length);

                // Get the current alpha of the line
                var alpha = marker.alpha;

                // Get the radius of the marker nib  
                let radius = marker.nib.size 

                // Get the angle of the marker nib
                let angle = marker.nib.angle || 0

                // Get the amount of jitter for the marker nib
                let jitter = move.jitter || 0

                // Get the amount of times to repeat the marker nib
                let fillAreaIterator = marker.nib.size * marker.nib.size

                // Calculate alpha jitter
                if(move.alphaJitter == true) {
                    let alphaSimplex = noise(drawPoint[0], drawPoint[1]);
                    alphaSimplex = mapNumbers(alphaSimplex, [-1.0, 1.0], [0.0, 1.0])
                    alpha = alpha - alphaSimplex
                    if(alpha < 0) {
                        alpha = 0
                    }
                }

                // Add some movement jitter
                if(move.drawNoise !== undefined && move.drawNoise > 0) {
                    let drawNoise = noise(drawPoint[0], drawPoint[1]);
                    drawNoise = mapNumbers(drawNoise, [-1.0, 1.0], [0.0, 1.0])
                    drawPoint[0] = drawPoint[0] + (drawNoise * move.drawNoise)
                    drawPoint[1] = drawPoint[1] + (drawNoise * move.drawNoise)
                }


                /*if(move.pressure !== null) {
                    if(marker.nib.endSize !== undefined) {
                        radius = marker.nib.size - (widthFactor * j)
                    } else {
                        radius = marker.nib.size
                    }
                    if (move.pressure.map !== undefined) {
                        var value = ipo(j)
                        value = mapNumbers(value, [0, 100], [0, radius]);
                        radius = value;
                    }
                } else {
                    if(marker.nib.endSize !== undefined) {
                        radius = marker.nib.size - (widthFactor * j)
                    } else {
                        radius = marker.nib.size
                    }
                }
            

                var jitterEasing = getEasing('ease-in')
                var jitter = move.jitter
                easing = bezier(jitterEasing[0], jitterEasing[1], jitterEasing[2], jitterEasing[3])
                jitter = easing(percent) * jitter;
                
                if(move.jitter == 0.7) {
                    var value = ipoJitter(j)
                    jitter = mapNumbers(value, [0, 100], [0, 1.5]);
                }
                

                if(move.pressure !== null) {
                    if(move.pressure.easing !== undefined) {
                        alpha = alpha + (easing(percent) * - alpha)
                    }
                    if (move.pressure.alphaMap !== undefined) {
                        var value = ipoAlpha(j)
                        alpha = alpha * value/100
                        if(alpha > 1) {
                            alpha = 1
                        }
                    }
                }*/
              
                
                /*

                if(marker.nib.endAngle !== undefined) {
                    var angle = mapNumbers(percent*100, [0, 100], [marker.nib.angle, marker.nib.endAngle]);
                }*/
                

                
                /*fillAreaIterator = fillAreaIterator * radius

                if(move.hold !== null) {
                   
                    if(((j / bezierPoints.length) * 100) < 1) {
                        radius = radius * move.hold.start
                        fillAreaIterator = fillAreaIterator * 5 * move.hold.end
                    }
                    if(((j / bezierPoints.length) * 100) > 99) {
                        radius = radius * move.hold.end
                        fillAreaIterator = fillAreaIterator * 5 * move.hold.end
                    }
                }*/

                fillAreaIterator = fillAreaIterator / marker.fillAreaReducer

                for (var k = 0; k < fillAreaIterator; k++) {

                    var offsetX = randFloat(-radius, radius);
                    var offsetY = randFloat(-radius, radius);               
                    
                    let widthFactorValue = widthFactor * j

                    let drawPosition = getDrawPosition(
                        drawPoint,
                        marker,
                        move,
                        offsetX,
                        offsetY,
                        radius,
                        jitter,
                        widthFactorValue
                    );


                    if(marker.useSprites == true) {
                        let sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
                        sprite.width = size*2;
                        sprite.height = size*2;
                        sprite.tint = color;
                        sprite.x = drawPosition[0];
                        sprite.y = drawPosition[1];
                        sprite.alpha = alpha;
                        spriteContainer.addChild(sprite);
                    } else {

                        if(marker.fadeEdges == true) {
                            
                            let degreeValue = angle
    
                            var firstAngle = radius//marker.nib.size - (widthFactor * j)
    
                            if(marker.nib.sizeY !== undefined) {
                                var secondAngle = marker.nib.sizeY - (widthFactor * j)
                                //console.log('gire')
                            } else {
                                var secondAngle = radius//marker.nib.size * 1.5;
                            }
    
                            var r = firstAngle * Math.sqrt(Math.random(0, 0.1));
                            var fi = 2 * (Math.PI) * Math.random(0, 0.1);
                            
                            let drawX = drawPoint[0] + r * Math.cos(fi)
                            let drawY = drawPoint[1] + (secondAngle / firstAngle) * r * Math.sin(fi)

                            drawY = drawY// + (offsetY * move.jitter)
                            drawX = drawX// + (offsetX * move.jitter)

                            //console.log(fi)

                            if(drawY > drawPoint[1] + (secondAngle - 5)) {
                                let desaturateAmount = mapNumbers(drawY, [drawPoint[1], drawPoint[1]+secondAngle], [0, randFloat(0, 2)]);
                                let fadeAmount = mapNumbers(drawY, [drawPoint[1], drawPoint[1]+secondAngle], [alpha, 0]);
                                let lightenAmount = 0//mapNumbers(drawY, [drawPoint[1], drawPoint[1]+secondAngle], [0, randFloat(0, 2)]);
                                var greyColor = chroma(color).saturate(desaturateAmount).brighten(lightenAmount).hex();
                                //fadeAmount = alpha
                                greyColor = PIXI.utils.string2hex(greyColor);
                                dotGraphic.beginFill(greyColor, alpha);
                                //console.log('fire')
                            } else if (drawY < drawPoint[1] - (secondAngle - 5)) {
                                let desaturateAmount = mapNumbers(drawY, [drawPoint[1], drawPoint[1]-secondAngle], [0, randFloat(0, 2)]);
                                let darkenAmount = mapNumbers(drawY, [drawPoint[1], drawPoint[1]-secondAngle], [0, 0.5]);
                                let fadeAmount = mapNumbers(drawY, [drawPoint[1], drawPoint[1]-secondAngle], [alpha, 0]);
                                fadeAmount = alpha
                                var greyColor = chroma(color).desaturate(desaturateAmount).darken(darkenAmount).hex();
                                greyColor = PIXI.utils.string2hex(greyColor);
                                dotGraphic.beginFill(greyColor, fadeAmount);
                                //console.log('fire 2')
                            } else {
                                //console.log('fire 3')
                                dotGraphic.beginFill(color, alpha);
                            }
                           
                            
    
                            if(degreeValue !== undefined) {
                                let rotated = rotatePoints(drawPoint[0], drawPoint[1], drawX, drawY, degreeValue)
                                drawX = rotated[0]
                                drawY = rotated[1]
                            }
                            
                                                  
    
                            drawPosition = [drawX, drawY]

                            
                        } else {
                            dotGraphic.beginFill(color, alpha);
                        }
                       
                       

                        /*
                         * 
                         * Draw dot shape to canvas
                         * 
                        /*/
                        
                        if(marker.nib.type == 'round') {
                            dotGraphic.drawCircle(
                                drawPosition[0],
                                drawPosition[1],
                                size
                            );
                        } else if (marker.nib.type == 'square') {
                            dotGraphic.drawRect(
                                drawPosition[0], 
                                drawPosition[1], 
                                size, 
                                size
                            );
                        } else if (marker.nib.type == 'oval') {
                            dotGraphic.drawCircle(
                                drawPosition[0],
                                drawPosition[1],
                                size
                            );
                        }
                        
                        dotGraphic.endFill();

                        /*
                         * 
                         * Apply Blending Modes
                         * 
                        /*/

                        if(marker.blend == 'add') {
                            dotGraphic.blendMode = PIXI.BLEND_MODES.ADD
                        } else if(marker.blend == 'multiply') {
                            dotGraphic.blendMode = PIXI.BLEND_MODES.MULTIPLY
                        } else if(marker.blend == 'screen') {
                            dotGraphic.blendMode = PIXI.BLEND_MODES.SCREEN
                        } else {
                            dotGraphic.blendMode = PIXI.BLEND_MODES.NORMAL
                        }

                        /*
                         * 
                         * Add single dot to line
                         * 
                        /*/
                        
                        lineGraphic.addChild(dotGraphic);
                    }
                }
            }
        }
        if(marker.useSprites == true) {
            layer.addChild(spriteContainer)
        } else {
            layer.addChild(lineGraphic);
        }
        //app.stage.addChild(layer);
    }
}




let getDrawPosition = function (drawPoint, marker, move, offsetX, offsetY, radius, jitter, widthFactorValue) {
	var drawX, drawY;
	if (marker.nib.type == "round") {
		let r = radius * Math.sqrt(Math.random());
		let theta = Math.random() * 2 * Math.PI;
		if (move.jitter) {
			drawX = drawPoint[0] + r * Math.cos(theta) + (offsetX * jitter); 
			drawY = drawPoint[1] + r * Math.sin(theta) + (offsetY * jitter);
		} else {
			drawX = drawPoint[0] + r * Math.cos(theta);
			drawY = drawPoint[1] + r * Math.sin(theta);
		}
        drawX = drawX - radius/2
        drawY = drawY - radius/2
	} else if (marker.nib.type == "oval") {

        let degreeValue = marker.nib.angle

		var firstAngle = radius

        if(marker.nib.sizeY !== undefined) {
            var secondAngle = marker.nib.sizeY - widthFactorValue
        } else {
            var secondAngle = radius//marker.nib.size * 1.5;
        }

		var r = firstAngle * Math.sqrt(Math.random(0, 0.1));
		var fi = 2 * (Math.PI) * Math.random(0, 0.1);
        
		drawX = drawPoint[0] + r * Math.cos(fi)
		drawY = drawPoint[1] + (secondAngle / firstAngle) * r * Math.sin(fi)
        
        if(degreeValue !== undefined) {
            let rotated = rotatePoints(drawPoint[0], drawPoint[1], drawX, drawY, degreeValue)
            drawX = rotated[0]
            drawY = rotated[1]
        }
        
	} else if (marker.nib.type == "square") {
		drawX = drawPoint[0] + offsetX;
		drawY = drawPoint[1] + offsetY;
	} else {
        let r = radius * Math.sqrt(Math.random());
		let theta = Math.random() * 2 * Math.PI;
        drawX = drawPoint[0] + r * Math.cos(theta);
		drawY = drawPoint[1] + r * Math.sin(theta);
    }
	return [drawX, drawY];
};

export { Mark, Marker, Move, line };
