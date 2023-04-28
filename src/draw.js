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
}

class Move {
	constructor(options = {}) {
        this.options = options;
        this.noise = options.noise || null
        this.density = options.density || 1000;
        this.hold = options.hold || null;
        this.pressure = options.pressure || null;
        this.line = options.line || new line({density:this.density});
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

   

    make(app, marker=this.marker, move=this.move, layer=this.layer ) {
        
        if(marker.density) {
            move.line.density = marker.density;
        }

        if(marker.moveStyles != null) {
            for(let style in marker.moveStyles) {
                move[style] = marker.moveStyles[style];
            }
            if(marker.moveStyles.density) {
                move.line.density = marker.moveStyles.density;
            }
        }
        
        let bezierPoints = createBezierPoints(move.line, move.noise);

        let lineGraphic = new PIXI.Container();
        let spriteContainer = new PIXI.ParticleContainer();

        let color = PIXI.utils.string2hex(marker.color);

        if(move.pressure !== null) {
            var widthFactor = (move.pressure.start - move.pressure.end) / bezierPoints.length
            if(move.pressure.easing !== undefined) {
                var easing = getEasing(move.pressure.easing)
                easing = bezier(easing[0], easing[1], easing[2], easing[3])
            }
        } else {
            var widthFactor = 0;
        }

        if(marker.nib.endSize !== undefined) {
            var widthFactor = (marker.nib.size - marker.nib.endSize) / bezierPoints.length
        }
        
        
        if(move.pressure !== null) {
            if (move.pressure.map !== undefined) {
                var ipo;
                var xPoint1 = 0;
                var xPoint2 = parseInt((bezierPoints.length / 20) * 1);
                var xPoint3 = parseInt((bezierPoints.length / 20) * 10);
                var xPoint4 = parseInt((bezierPoints.length / 20) * 15);
                var points = [
                    { p: [xPoint1, 0] },
                    { p: [xPoint2, rand(0,100)], lower: [0, 0], upper: [0, 0] },
                    { p: [xPoint3, rand(0,100)], lower: [0, 0], upper: [0, 0] },
                    { p: [xPoint4, rand(0,100)], lower: [0, 0], upper: [0, 0] },
                    { p: [bezierPoints.length, rand(0,100)] },
                ];
                /*var points = [
                    { p: [xPoint1, 50], lower: [0, 0], upper: [0, 0] },
                    { p: [xPoint2, 150], lower: [0, 0], upper: [0, 0] },
                    { p: [xPoint3, 100], lower: [0, 0], upper: [0, 0] },
                    { p: [xPoint4, 50], lower: [0, 0], upper: [0, 0] },
                    { p: [bezierPoints.length, 0] },
                ];*/
                var ipo = new IPO(points);
                drawSVG(points, bezierPoints.length, ipo, this.name + " pressureMap");
            }

            
            if (move.pressure.alphaMap !== undefined) {
                var ipoAlpha;
                var xPoint1 = 0;
                var xPoint2 = parseInt((bezierPoints.length / 20) * 5);
                var xPoint3 = parseInt((bezierPoints.length / 20) * 10);
                var xPoint4 = parseInt((bezierPoints.length / 20) * 15);
                var points = [
                    { p: [xPoint1, rand(0,100)] },
                    { p: [xPoint2, rand(0,100)], lower: [0, 0], upper: [0, 0] },
                    { p: [xPoint3, rand(0,100)], lower: [0, 0], upper: [0, 0] },
                    { p: [xPoint4, rand(0,100)], lower: [0, 0], upper: [0, 0] },
                    { p: [bezierPoints.length, rand(0,100)] },
                ];
                var ipoAlpha = new IPO(points);
                drawSVG(points, bezierPoints.length, ipoAlpha, this.name + " alpha");
            }
        }

        if(move.jitter == 0.7) {
            var ipoJitter;
            var xPoint1 = 0;
            var xPoint2 = parseInt((bezierPoints.length / 20) * 3);
            var xPoint3 = parseInt((bezierPoints.length / 20) * 10);
            var xPoint4 = parseInt((bezierPoints.length / 20) * 15);
            var jitterPoints = [
                { p: [xPoint1, 100] },
                { p: [xPoint2, 0], lower: [0, 0], upper: [0, 0] },
                { p: [xPoint3, 0], lower: [0, 0], upper: [0, 0] },
                { p: [xPoint4, 0], lower: [0, 0], upper: [0, 0] },
                { p: [bezierPoints.length, 0] },
            ];
            var ipoJitter = new IPO(jitterPoints);
            drawSVG(jitterPoints, bezierPoints.length, ipoJitter, this.name + " jitter");
        }

        
            

        if (move.reverse == true) {
            bezierPoints.reverse();
        }
        
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


        for (var i = 0; i < move.iterations; i++) {

            for (var j = 0; j < bezierPoints.length; j++) {

                var drawPoint = [bezierPoints[j].x, bezierPoints[j].y]

                

                if(move.pressure !== null) {
                    if(marker.nib.endSize !== undefined) {
                        var radius = marker.nib.size - (widthFactor * j)
                    } else {
                        var radius = marker.nib.size
                    }
                    if (move.pressure.map !== undefined) {
                        var value = ipo(j)
                        value = mapNumbers(value, [0, 100], [0, radius]);
                        radius = value;
                    }
                } else {
                    if(marker.nib.endSize !== undefined) {
                        var radius = marker.nib.size - (widthFactor * j)
                    } else {
                        var radius = marker.nib.size
                    }
                }
                
                var alpha = marker.alpha;

                var percent = (j / bezierPoints.length);

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
                }
              
                
                let alphaSimplex = noise(drawPoint[0], drawPoint[1]);
                alphaSimplex = mapNumbers(alphaSimplex, [-1.0, 1.0], [0.0, 1.0])
                if(move.alphaJitter != 0) {
                    alpha = alpha - (alphaSimplex / 8)
                }

                if(marker.nib.endAngle !== undefined) {
                    var angle = mapNumbers(percent*100, [0, 100], [marker.nib.angle, marker.nib.endAngle]);
                }
                

                let fillAreaIterator = marker.nib.size * marker.nib.size
                fillAreaIterator = fillAreaIterator * radius

                if(move.hold !== null) {
                   
                    if(((j / bezierPoints.length) * 100) < 1) {
                        radius = radius * move.hold.start
                        fillAreaIterator = fillAreaIterator * 5 * move.hold.end
                    }
                    if(((j / bezierPoints.length) * 100) > 99) {
                        radius = radius * move.hold.end
                        fillAreaIterator = fillAreaIterator * 5 * move.hold.end
                    }
                }

                fillAreaIterator = fillAreaIterator / marker.fillAreaReducer

                for (var k = 0; k < fillAreaIterator; k++) {

                    if (radius < 1) {
                        var offsetX = randFloat(-radius, radius);
                        var offsetY = randFloat(-radius, radius);
                    } else {
                        var offsetX = randFloat(-radius, radius);
                        var offsetY = randFloat(-radius, radius);
                    }                    
                    
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
                        console.log(size)
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
                                console.log('fire 3')
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
                        //dotGraphic.beginFill(color, alpha);
                       
                       

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
        app.stage.addChild(layer);
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
