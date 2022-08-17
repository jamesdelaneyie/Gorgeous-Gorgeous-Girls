class pencil {
    constructor({startWidth,endWidth,shape,iterations,color,alpha,alphaEasing,reverse,reverseLine,nib,nibOption,nibSize,density,jitter,angle,fadeAngle,widthArray,pressureArray}) {
        this.startWidth = startWidth || 1;
        this.endWidth = endWidth || 1;
        this.shape = shape;
        this.iterations = iterations || 1;
        this.color = color || '#000000';
        this.alpha = alpha || 1;
        this.alphaEasing = alphaEasing || 'none';
        this.reverse = reverse || false;
        this.reverseLine = reverseLine || false;
        this.nib = nib || 'circle';
        this.nibOption = nibOption || this.startWidth;
        this.nibSize = nibSize || 1;
        this.density = density || 500;
        this.jitter = jitter || false;
        this.angle = 0;
        this.fadeAngle = 0;
        this.widthArray = widthArray;
        this.pressureArray = '';
        this.layer = new PIXI.Graphics();
    }
}
let getDrawPosition = function(drawPoint, pencil, offsetX, offsetY, radius) {
    var drawX, drawY;
    if(pencil.nib == 'circle') {
        
        r = radius * Math.sqrt(Math.random())
        theta = Math.random() * 2 * Math.PI
        if(pencil.jitter) {
            drawX = drawPoint[0] + r * Math.cos(theta) + offsetX;
            drawY = drawPoint[1] + r * Math.sin(theta) + offsetY;
        } else {
            drawX = drawPoint[0] + r * Math.cos(theta)
            drawY = drawPoint[1] + r * Math.sin(theta)
        }
        

        //Centre distribution circle
        //var angle = Math.random() * Math.PI * 2;
        //drawX = drawPoint[0] + offsetX * Math.sin(angle);
        //drawY = drawPoint[1] + offsetX * Math.cos(angle);

    } else if (pencil.nib == 'oval') {
        var firstAngle = pencil.startWidth
        var secondAngle = pencil.nibOption
        r = firstAngle * Math.sqrt(Math.random(0,.1))
        fi = 2 * Math.PI * Math.random(0,.1)
        drawX = drawPoint[0] + r * Math.cos(fi)
        drawY = drawPoint[1] + secondAngle / firstAngle *  r * Math.sin(fi)
    } else if (pencil.nib == 'square') {
        drawX = drawPoint[0] + offsetX;
        drawY = drawPoint[1] + offsetY;
    }
    return [drawX, drawY];
}

let drawLine = function(line, pencil, layer) {

    bezierPoints = createBezierPoints(pencil, line);

    lineGraphic = new PIXI.Container();

    color = PIXI.utils.string2hex(pencil.color)

    var widthFactor = (pencil.startWidth - pencil.endWidth) / bezierPoints.length

    //linear easing
    /*var easing = bezier(0, 0, 1, 1);
    if(pencil.alphaEasing == 'linear') {
        easing = bezier(0, 0, 1, 1);
    }
    if(pencil.alphaEasing == 'easeInExpo') {
        //easeInCubic
        easing = bezier(0.32, 0, 0.67, 0);
    }*/
    let ipo
    if(pencil.widthArray != '') {
        //console.log(bezierPoints.length)
        //if(pencil.iterations == 1) {
        /*xPoint1 = 0
        xPoint2 = parseInt((bezierPoints.length / 2) * 1)
        xPoint3 = parseInt((bezierPoints.length / 2) * 2)
        //xPoint4 = parseInt((bezierPoints.length / 3) * 3)
        //console.log(bezierPoints.length)
        //console.log(xPoint1,xPoint2,xPoint3,xPoint4)
        var points = [
            { "p": [xPoint1, 0] },
            { "p": [xPoint2, 100], "lower": [-xPoint2, 0], "upper": [xPoint2, 0] },
            { "p": [xPoint3, 0] },
            //{ "p": [xPoint4, 100] }
        ]
        console.log(points)
        ipo = new IPO(points)
        drawSVG(points, bezierPoints.length, ipo)*/
        //console.log(bezierPoints.length)
        //if(pencil.iterations == 1) {
        xPoint1 = 0
        xPoint2 = parseInt((bezierPoints.length / 20) * 0.5)
        xPoint3 = parseInt((bezierPoints.length / 20) * 10)
        xPoint4 = parseInt((bezierPoints.length / 20) * 19.5)
        //console.log(bezierPoints.length)
        //console.log(xPoint1,xPoint2,xPoint3,xPoint4)
        var points = [
            { "p": [xPoint1, 0] },
            { "p": [xPoint2, 100], "lower": [-xPoint2, 0], "upper": [10, -50] },
            { "p": [xPoint3, 50], "lower": [-100, 0], "upper": [100, 0] },
            { "p": [xPoint4, 100], "lower": [-10, -50], "upper": [10, 0]},
            { "p": [bezierPoints.length, 0] },
        ]
        console.log(points)
        ipo = new IPO(points)
        drawSVG(points, bezierPoints.length, ipo)
    }
    //}

    //var value = ipo(135);
    
   
    //var easing = bezier(0.33, 1, 0.68, 1)
    //var easing = bezier(0.16, 1, 0.3, 1)
    //var easing = bezier(0.32, 0, 0.67, 0);
    //var easing = bezier(0.12, 0, 0.39, 0);
    //var easing = bezier(0.64, 0, 0.78, 0);
    //var easing = bezier(0.55, 0, 1, 0.45);
    //var easing = bezier(0.46, 0, .01, 1);
    //var easing = bezier(.99,-0.01,.61,1);

    /*var newBezierPoints = [];
    //Remove points from the bezier curve using the shape of an easing function
    var previousValue
    for (var i = 0; i < bezierPoints.length; i++) {
        var value = easing(i / bezierPoints.length);
        var value = Math.round(value*bezierPoints.length)
        if(value != previousValue) {
            newBezierPoints.push(bezierPoints[i])
        }
        previousValue = value
    }*/
    //bezierPoints = newBezierPoints;

    if(pencil.reverseLine == true) {
        bezierPoints.reverse()
    }

    //Apply perlin noise to each point of the bezier curve
    for (var i = 0; i < bezierPoints.length; i++) {
        offset = perlin.get(bezierPoints[i].x, bezierPoints[i].y)
        bezierPoints[i].x = bezierPoints[i].x + (offset*2)
        bezierPoints[i].y = bezierPoints[i].y + (offset*2)
    }

    
    
    let dotGraphic = new PIXI.Graphics();

    /*let pixel = new PIXI.Graphics();
    pixel.beginFill(color, alpha);
    pixel.drawCircle(0, 0, 1);
    pixel.endFill();
    var texture = app.renderer.generateTexture(pixel);*/


    for (var i=0; i<pencil.iterations; i++ ) {

        var points = [null, null, null];

        //console.log(bezierPoints)
        
        for(var j=0; j<bezierPoints.length; j++) {


            var drawPoint = getBezierPoint(points, bezierPoints[j].x, bezierPoints[j].y);
            
            if(drawPoint == null)
                continue;
                
            var drawWidth = pencil.startWidth - (widthFactor * j)
            var radius = drawWidth
            var alpha = pencil.alpha

            /*perlin.seed(rand(0,10));
            var alphaPerlin = perlin.get(drawPoint[0], drawPoint[1])
            alphaPerlin = mapNumbers(alphaPerlin, [-1.0, 1.0], [0.0, 1.0])
            alpha = alpha - alphaPerlin/2
            if(alpha < 0)
                alpha = 0
            console.log(alpha)*/


            //var percent = (j / bezierPoints.length);
            /*if(pencil.alphaEasing == 'linear' || pencil.alphaEasing == 'easeInExpo') {
                var easingAlphaPercentage = pencil.alpha * 10
                if(pencil.reverse == true) {
                    var percent = 1 - percent
                }
                alpha = easing(percent/easingAlphaPercentage);
                alpha = alpha / 10
            } else {
                alpha = perlin.get(drawPoint[0], drawPoint[1])
                if(alpha < 0.1) {
                    alpha = 0.1
                }
            }*/

            /*if(pencil.iterations == 1) {
                //console.log(j)
                var alphaValue = ipo(j);
                alpha = alphaValue / 1000
                alpha = 1
                //console.log(j, alphaValue, radius)
                
            }

            if(alpha < 0.01) {
                //alpha = 0
                continue
            }*/



            //var alphaOffset = perlin.get(drawPoint[0], drawPoint[1])
            //alphaOffset = Math.abs(alphaOffset)
            //alpha = alpha - (alphaOffset/easingAlphaPercentage / 2)
            
            //alternative draw mode, concentric style
            //drawPosition = getDrawPosition(drawPoint, pencil, radius, offsetX, offsetY);
            
            /*if(pencil.iterations == 1) {
                fillAreaIterator = parseInt(radius) * 2
            } else {
                fillAreaIterator = 1
            }

            if(fillAreaIterator < 1) {
                fillAreaIterator = 1
            }*/
            //
            if(pencil.widthArray != '') {
                var drawSize = ipo(j)
                drawSize = mapNumbers(drawSize, [0, 100], [0, radius])
                radius = drawSize
            }
            //


            fillAreaIterator = parseInt(radius)
            if(fillAreaIterator < 1) {
                fillAreaIterator = 1
            }
            //console.log(fillAreaIterator)

            
            for(var k=0;k<fillAreaIterator;k++) {
                
                if(radius < 1) {
                    var offsetX = randFloat(-radius, radius);
                    var offsetY = randFloat(-radius, radius);
                    
                } else {
                    var offsetX = rand(-radius, radius);
                    var offsetY = rand(-radius, radius);
                }
               
                //console.log(offsetX, offsetY)
                /*if(offsetX < 0) {
                    offsetX = rand(0, radius/10);
                }
                if(offsetY < 0) {
                    offsetY = rand(0, radius/10);
                }*/
                drawPosition = getDrawPosition(drawPoint, pencil, offsetX, offsetY, radius);
                dotGraphic.beginFill(color, alpha);
                dotGraphic.drawCircle(drawPosition[0], drawPosition[1], pencil.nibSize);
                dotGraphic.endFill();
                lineGraphic.addChild(dotGraphic);
            }
              

        }
        
    }

    layer.addChild(lineGraphic);

}


