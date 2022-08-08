const app = new PIXI.Application();
document.body.appendChild(app.view);

// create a new background sprite
const background = PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/bg_rotate.jpg');
background.width = app.screen.width;
background.height = app.screen.height;

const totaldudes = 200;
const group = new PIXI.Container();

group.addChild(background);

for (let i = 0; i < totaldudes; i++) {
    const dude = PIXI.Sprite.from('https://pixijs.io/examples/examples/assets/bunny.png');
    dude.anchor.set(0.5);
    dude.scale.set(0.8 + Math.random() * 0.3);    
    dude.x = Math.floor(Math.random() * app.screen.width);
    dude.y = Math.floor(Math.random() * app.screen.height);

    // You can try here to disable the blendmode or use something else than MULTIPLY
    // MULTIPLY is bugged with blur filter, not the other blendmode
    dude.blendMode = PIXI.BLEND_MODES.MULTIPLY;

    group.addChild(dude);
}

var blurFilter = new PIXI.filters.BlurFilter(0);
group.filters = [blurFilter]
    
app.stage.addChild(group);


