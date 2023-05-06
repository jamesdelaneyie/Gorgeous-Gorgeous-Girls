import * as PIXI from "pixi.js";
import { SmoothGraphics as Graphics } from "@pixi/graphics-smooth";

let drawEllipse = function(cx, cy, ds, de, w, h, array, layer, color) {
	var semicircle = new PIXI.Graphics();
	semicircle.lineStyle(1, color, 1)
	for (var i = ds; i < de; i ++) {
	  var angle = i * ((Math.PI * 2) / 360);
	  var x = Math.cos(angle) * w;
	  var y = Math.sin(angle) * h;
	  semicircle.beginFill(color);
	  semicircle.arc(cx+x, cy+y, 2, 0, 3);
	  semicircle.endFill();
	  array.push({x: cx+x, y: cy+y})
	}
	//layer.addChild(semicircle)
}

function drawEllipseCurves(x, y, w, h, layer) {
    let semicircle = new PIXI.Graphics();
    semicircle.lineStyle(1, 0x000000, 1)

    var width_two_thirds = w * 2 / 3;
    var height_over_2 = h / 2;

    semicircle.moveTo(x, y - height_over_2);
    semicircle.bezierCurveTo(x + width_two_thirds, y - height_over_2, x + width_two_thirds, y + height_over_2, x, y + height_over_2);
    semicircle.bezierCurveTo(x - width_two_thirds, y + height_over_2, x - width_two_thirds, y - height_over_2, x, y -height_over_2);

    layer.addChild(semicircle)
}

export { drawEllipse, drawEllipseCurves }