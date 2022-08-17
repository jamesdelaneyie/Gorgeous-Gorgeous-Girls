


let generateColors = function() {

    let randomColor = rand(0, 360);

    let hairColor = chroma(randomColor, 0.8, 0.5, 'hsl');
    let highlightColor = chroma(randomColor + 230, 0.8, 0.6, 'hsl');
    var multiplyColor = chroma.blend(hairColor, highlightColor, 'multiply');

    hairColors = multiplyColor
    hairColorsDark = chroma.scale([hairColors, 'black']).colors(4);
    hairColorsLight = chroma.scale([hairColors, 'white']).colors(5);
    hairColorsLightTwo = chroma.scale([hairColors, 'white']).colors(35);
    
    
    let backgroundColor = hairColorsLightTwo[32];
    backgroundColor = PIXI.utils.string2hex('#f6eeeb')
    let bk = new PIXI.Graphics();
    bk.beginFill(backgroundColor);
    bk.drawRect(0, 0, app.renderer.width, app.renderer.height);
    bk.endFill();
    app.stage.addChild(bk)

    let color1 = new PIXI.Graphics();
    hairColor = PIXI.utils.string2hex(hairColor.hex())
    color1.beginFill(hairColor);
    color1.drawRect(0, 0, 10, 10);
    color1.endFill();
    app.stage.addChild(color1);

    let color2 = new PIXI.Graphics();
    highlightColor = PIXI.utils.string2hex(highlightColor.hex())
    color2.beginFill(highlightColor);
    color2.drawRect(10, 0, 10, 10);
    color2.endFill();
    app.stage.addChild(color2);

    let color3 = new PIXI.Graphics();
    multiplyColor = PIXI.utils.string2hex(multiplyColor.hex())
    color3.beginFill(multiplyColor);
    color3.drawRect(20, 0, 10, 10);
    color3.endFill();
    app.stage.addChild(color3);

    return highlightColor;
}