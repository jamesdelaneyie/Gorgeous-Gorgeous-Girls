
        /*

        var counter = 0
        var counter2 = 0

        var drawLeftHair = function() {
            var template = new PIXI.Graphics();
            if (counter == 1) {
                template.beginFill(hairColor2);
            } else {
                template.beginFill(hairColor1);
            }
            counter++




            template.drawCircle(0, 0, 15);
            template.endFill();
            var texture = app.renderer.generateTexture(template);
            var circle = new PIXI.Sprite(texture);



            var randEndX = rand(-200, 150)
            var randEndXP = rand(-200, 250)

            var randEndYP = rand(-50, 50)
            var randEndX1 = rand(-100, 100)

            var randEndXX = rand(0, 100)

            var width = 70
            var endWidth = 70

            var bezier = [{
                x: randEndX1,
                y: -100
            }, {
                x: 0,
                y: randEndYP
            }, {
                x: randEndXP,
                y: 350
            }, {
                x: randEndX,
                y: 450
            }]

            var bezierPoints = findCBezPoints(bezier);

            var points = [null, null, null];

            var widthFactor = (width - endWidth) / bezierPoints.length

            var iterations = 3

            for (var j = 0; j < iterations; j++) {

                for (var i = 0; i < bezierPoints.length; i++) {

                    var drawWidth = width - (widthFactor * i)

                    var x = bezierPoints[i].x;
                    var y = bezierPoints[i].y;

                    points[0] = points[1];
                    points[1] = points[2];
                    points[2] = {
                        X: x,
                        Y: y
                    };

                    if (points[0] == null)
                        continue;

                    var p0 = points[0];
                    var p1 = points[1];
                    var p2 = points[2];

                    var x0 = (p0.X + p1.X) / 2;
                    var y0 = (p0.Y + p1.Y) / 2;

                    var alpha = perlin.get(x0, y0)

                    alpha = Math.abs(alpha)

                    if (alpha < 0.1) {
                        alpha = 0.1
                    }

                    alpha = 1 - alpha



                    var radius = drawWidth

                    if (width == 1) {
                        radius = radius / 20
                    }

                    var offsetX = rand(-radius, radius);
                    var offsetY = rand(-radius, radius);

                


                    let circleRadius = radius * Math.sqrt(Math.random())
                    let theta = Math.random() * 2 * Math.PI

                    x0 = x0 + radius * Math.cos(theta)
                    y0 = y0 + radius * Math.sin(theta)


                    if (i > 1) {
                        let duplicate = new PIXI.Sprite(circle.texture);
                        duplicate.x = x0
                        duplicate.y = y0
                        duplicate.alpha = alpha
                        container.addChild(duplicate)

                    }


                }

            }

            var containerTwo = new PIXI.ParticleContainer(500000);
            app.stage.addChild(containerTwo)


            var template = new PIXI.Graphics();

            if (counter2 == 1) {
                template.beginFill(hairColor3);
            } else {
                template.beginFill(hairColor4);
            }
            counter2++



            template.drawCircle(0, 0, 0.5);
            template.endFill();
            var texture = app.renderer.generateTexture(template);
            var circle = new PIXI.Sprite(texture);

            app.stage.addChild(template);




            var width = 100
            var endWidth = 100

            var bezier = [{
                x: randEndX1,
                y: -100
            }, {
                x: 0,
                y: 50
            }, {
                x: randEndXP,
                y: 350
            }, {
                x: randEndX - 30,
                y: 450
            }]

            var bezierPoints = findCBezPoints(bezier);

            var points = [null, null, null];

            var widthFactor = (width - endWidth) / bezierPoints.length

            var iterations = 20

            for (var j = 0; j < iterations; j++) {

                for (var i = 0; i < bezierPoints.length; i++) {

                    var drawWidth = width - (widthFactor * i)

                    var x = bezierPoints[i].x;
                    var y = bezierPoints[i].y;

                    points[0] = points[1];
                    points[1] = points[2];
                    points[2] = {
                        X: x,
                        Y: y
                    };

                    if (points[0] == null)
                        continue;

                    var p0 = points[0];
                    var p1 = points[1];
                    var p2 = points[2];

                    var x0 = (p0.X + p1.X) / 2;
                    var y0 = (p0.Y + p1.Y) / 2;

                    var alpha = perlin.get(x0, y0)

                    if (alpha < 0.1) {
                        alpha = 0.1
                    }

                    alpha = 1


                    var radius = drawWidth

                    if (width == 1) {
                        radius = radius / 20
                    }

                    var offsetX = rand(-radius, radius);
                    var offsetY = rand(-radius, radius);

                    if (j > iterations * 0.70) {
                        offsetY = -drawWidth
                    }
                    if (j > iterations * 0.85) {
                        offsetY = drawWidth
                    }



                    let circleRadius = radius * Math.sqrt(Math.random())
                    let theta = Math.random() * 2 * Math.PI

                    x0 = x0 + radius * Math.cos(theta)
                    y0 = y0 + radius * Math.sin(theta)


                    if (i > 1) {
                        let duplicate = new PIXI.Sprite(circle.texture);
                        duplicate.x = x0
                        duplicate.y = y0
                        duplicate.alpha = alpha
                        containerTwo.addChild(duplicate)

                    }


                }

            }



            var template = new PIXI.Graphics();
            template.beginFill(hairColor5);
            template.drawCircle(0, 0, 0.5);
            template.endFill();
            var texture = app.renderer.generateTexture(template);
            var circle = new PIXI.Sprite(texture);

            app.stage.addChild(template);




            var width = rand(1, 3)
            var endWidth = width + 2;

            var bezier = [{
                x: randEndX1 + 110,
                y: -100
            }, {
                x: 100,
                y: 50
            }, {
                x: randEndXP + 90,
                y: 350
            }, {
                x: randEndX + 110,
                y: 450
            }]

            var bezierPoints = findCBezPoints(bezier);

            var points = [null, null, null];

            var widthFactor = (width - endWidth) / bezierPoints.length

            var iterations = 0 //rand(10, 20)

            for (var j = 0; j < iterations; j++) {

                for (var i = 0; i < bezierPoints.length; i++) {

                    var drawWidth = width - (widthFactor * i)

                    var x = bezierPoints[i].x;
                    var y = bezierPoints[i].y;

                    points[0] = points[1];
                    points[1] = points[2];
                    points[2] = {
                        X: x,
                        Y: y
                    };

                    if (points[0] == null)
                        continue;

                    var p0 = points[0];
                    var p1 = points[1];
                    var p2 = points[2];

                    var x0 = (p0.X + p1.X) / 2;
                    var y0 = (p0.Y + p1.Y) / 2;

                    var alpha = perlin.get(x0, y0)

                    if (alpha < 0.1) {
                        alpha = 0.1
                    }

                    //alpha = 1


                    var radius = drawWidth

                    if (width == 1) {
                        radius = radius / 20
                    }

                    var offsetX = rand(-radius, radius);
                    var offsetY = rand(-radius, radius);

                    if (j > iterations * 0.70) {
                        offsetY = -drawWidth
                    }
                    if (j > iterations * 0.85) {
                        offsetY = drawWidth
                    }



                    let circleRadius = radius * Math.sqrt(Math.random())
                    let theta = Math.random() * 2 * Math.PI

                    x0 = x0 + radius * Math.cos(theta)
                    y0 = y0 + radius * Math.sin(theta)


                    if (i > 1) {
                        let duplicate = new PIXI.Sprite(circle.texture);
                        duplicate.x = x0
                        duplicate.y = y0
                        duplicate.alpha = alpha
                        containerTwo.addChild(duplicate)

                    }


                }

            }

            var template = new PIXI.Graphics();
            template.beginFill(hairColor5);
            template.drawCircle(0, 0, 0.5);
            template.endFill();
            var texture = app.renderer.generateTexture(template);
            var circle = new PIXI.Sprite(texture);

            app.stage.addChild(template);




            var width = 2
            var endWidth = 1;

            var bezier = [{
                x: randEndX1 + 110,
                y: -100
            }, {
                x: 100,
                y: 50
            }, {
                x: randEndXP + 90,
                y: 350
            }, {
                x: randEndX + 130,
                y: 450
            }]

            var bezierPoints = findCBezPoints(bezier);

            var points = [null, null, null];

            var widthFactor = (width - endWidth) / bezierPoints.length

            var iterations = 5 //0//rand(10, 20)

            for (var j = 0; j < iterations; j++) {

                for (var i = 0; i < bezierPoints.length; i++) {

                    var drawWidth = width - (widthFactor * i)

                    var x = bezierPoints[i].x;
                    var y = bezierPoints[i].y;

                    points[0] = points[1];
                    points[1] = points[2];
                    points[2] = {
                        X: x,
                        Y: y
                    };

                    if (points[0] == null)
                        continue;

                    var p0 = points[0];
                    var p1 = points[1];
                    var p2 = points[2];

                    var x0 = (p0.X + p1.X) / 2;
                    var y0 = (p0.Y + p1.Y) / 2;

                    var alpha = perlin.get(x0, y0)

                    if (alpha < 0.1) {
                        alpha = 0.1
                    }

                    alpha = 1


                    var radius = drawWidth

                    if (width == 1) {
                        radius = radius / 20
                    }

                    var offsetX = rand(-radius, radius);
                    var offsetY = rand(-radius, radius);

                    if (j > iterations * 0.70) {
                        offsetY = -drawWidth
                    }
                    if (j > iterations * 0.85) {
                        offsetY = drawWidth
                    }



                    let circleRadius = radius * Math.sqrt(Math.random())
                    let theta = Math.random() * 2 * Math.PI

                    x0 = x0 + radius * Math.cos(theta)
                    y0 = y0 + radius * Math.sin(theta)


                    if (i > 1) {
                        let duplicate = new PIXI.Sprite(circle.texture);
                        duplicate.x = x0
                        duplicate.y = y0
                        duplicate.alpha = alpha
                        containerTwo.addChild(duplicate)

                    }


                }

            }



        }

        //drawLeftHair();

        //drawLeftHair();


        var containerThree = new PIXI.ParticleContainer(500000);
        app.stage.addChild(containerThree)

        var drawLeftHairTwo = function() {


            //flick
            var template = new PIXI.Graphics();
            template.beginFill(hairColor2);
            template.drawCircle(0, 0, 0.5);
            template.endFill();
            var texture = app.renderer.generateTexture(template);
            var circle = new PIXI.Sprite(texture);

            var width = 3
            var endWidth = 0

            startX = rand(200, 300)
            OffX = rand(200, 300)

            randEndX = rand(250, 450)
            randEndY = rand(180, 350);

            randPointX = rand(150, 450)

            var bezier = [{
                x: startX,
                y: -100
            }, {
                x: OffX,
                y: -100
            }, {
                x: randPointX,
                y: 150
            }, {
                x: randEndX,
                y: randEndY
            }]

            var bezierPoints = findCBezPoints(bezier);

            var points = [null, null, null];

            var widthFactor = (width - endWidth) / bezierPoints.length

            var iterations = 20 //rand(10, 20)

            for (var j = 0; j < iterations; j++) {

                for (var i = 0; i < bezierPoints.length; i++) {

                    var drawWidth = width - (widthFactor * i)

                    var x = bezierPoints[i].x;
                    var y = bezierPoints[i].y;

                    points[0] = points[1];
                    points[1] = points[2];
                    points[2] = {
                        X: x,
                        Y: y
                    };

                    if (points[0] == null)
                        continue;

                    var p0 = points[0];
                    var p1 = points[1];
                    var p2 = points[2];

                    var x0 = (p0.X + p1.X) / 2;
                    var y0 = (p0.Y + p1.Y) / 2;

                    var alpha = perlin.get(x0, y0)

                    var radius = drawWidth

                    if (width == 1) {
                        radius = radius / 20
                    }

                    var offsetX = rand(-radius, radius);
                    var offsetY = rand(-radius, radius);



                    let circleRadius = radius * Math.sqrt(Math.random())
                    let theta = Math.random() * 2 * Math.PI

                    x0 = x0 + radius * Math.cos(theta)
                    y0 = y0 + radius * Math.sin(theta)


                    if (i > 1) {
                        let duplicate = new PIXI.Sprite(circle.texture);
                        duplicate.x = x0
                        duplicate.y = y0
                        duplicate.alpha = alpha
                        containerThree.addChild(duplicate)

                    }


                }

            }

        }

        var addHair = rand(0, 1)
        if (addHair) {
            //drawLeftHairTwo();
            //drawLeftHairTwo();
        }*/