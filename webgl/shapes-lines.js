

ctx.recenter = function () {
	ctx.moveTo(center, center);
	pointArray.push([center, center]);
};

ctx.circle = function (width, fill, fillColor) {
	ctx.beginPath();

	let startX = pointArray[pointArray.length - 1][0];
	let startY = pointArray[pointArray.length - 1][1];

	ctx.arc(startX, startY, width, 0, 2 * Math.PI);
	if (fill == true) {
		ctx.fillStyle = fillColor;
		ctx.fill();
		ctx.closePath();
	}
};

ctx.oval = function (width, height, angle, fill, fillColor) {
	ctx.beginPath();

	let startX = pointArray[pointArray.length - 1][0];
	let startY = pointArray[pointArray.length - 1][1];

	ctx.ellipse(startX, startY, width, height, angle, 0, 2 * Math.PI);

	if (fill == true) {
		ctx.fillStyle = fillColor;
		ctx.fill();
		ctx.closePath();
	}
};

ctx.move = function (x, y) {
	let newX = pointArray[pointArray.length - 1][0] + x;
	let newY = pointArray[pointArray.length - 1][1] + y;
	ctx.moveTo(newX, newY);
	pointArray.push([newX, newY]);
};

ctx.line = function (x, y) {
	let newX = pointArray[pointArray.length - 1][0] + x;
	let newY = pointArray[pointArray.length - 1][1] + y;
	ctx.lineTo(newX, newY);
	pointArray.push([newX, newY]);
};

ctx.lineCurved = function (endX, endY, cp1, cp2) {
	let startX = pointArray[pointArray.length - 1][0];
	let startY = pointArray[pointArray.length - 1][1];

	let newEndX = startX + endX;
	let newEndY = startY + endY;

	let cp1Local = startX + cp1;
	let cp2Local = startY + cp2;

	ctx.bezierCurveTo(startX, startY, cp1Local, cp2Local, newEndX, newEndY);
	pointArray.push([newEndX, newEndY]);
};

ctx.lineCurvedTo = function (startX, startY, endX, endY, cp1, cp2) {
	let newEndX = startX + endX;
	let newEndY = startY + endY;

	let cp1Local = startX + cp1;
	let cp2Local = startY + cp2;

	ctx.bezierCurveTo(startX, startY, cp1, cp2, newEndX, newEndY);
};

ctx.lineCurvedStroke = function (
	startWidth,
	endWidth,
	endX,
	endY,
	cp1,
	cp2,
	cp3,
	cp4
) {
	let startX = pointArray[pointArray.length - 1][0];
	let startY = pointArray[pointArray.length - 1][1];

	let newEndX = startX + endX;
	let newEndY = startY + endY;

	let cp1Local = startX + cp1;
	let cp2Local = startY + cp2;

	let cp3Local = startX + cp3;
	let cp4Local = startY + cp4;

	var bezier = [
		{ x: startX, y: startY },
		{ x: cp1Local, y: cp2Local },
		{ x: cp3Local, y: cp4Local },
		{ x: newEndX, y: newEndY },
	];

	var bezierPoints = findCBezPoints(bezier);

	var points = [null, null, null];

	for (var i = 0; i < bezierPoints.length; i++) {
		var width = startWidth + i / endWidth;

		var x = bezierPoints[i].x;
		var y = bezierPoints[i].y;

		points[0] = points[1];
		points[1] = points[2];
		points[2] = { X: x, Y: y };

		if (points[0] == null) continue;

		var p0 = points[0];
		var p1 = points[1];
		var p2 = points[2];

		var x0 = (p0.X + p1.X) / 2;
		var y0 = (p0.Y + p1.Y) / 2;

		var x1 = (p1.X + p2.X) / 2;
		var y1 = (p1.Y + p2.Y) / 2;

		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.strokeStyle = "black";
		ctx.lineCap = "round";

		ctx.moveTo(x0, y0);
		ctx.quadraticCurveTo(p1.X, p1.Y, x1, y1);
		ctx.stroke();
	}
};

ctx.lineCurvedStrokeLash = function (
	color,
	startX,
	startY,
	startWidth,
	endWidth,
	endX,
	endY,
	cp1,
	cp2,
	cp3,
	cp4
) {
	let newEndX = startX + endX;
	let newEndY = startY + endY;

	let cp1Local = startX + cp1;
	let cp2Local = startY + cp2;

	let cp3Local = startX + cp3;
	let cp4Local = startY + cp4;

	var bezier = [
		{ x: startX, y: startY },
		{ x: cp1Local, y: cp2Local },
		{ x: cp3Local, y: cp4Local },
		{ x: newEndX, y: newEndY },
	];

	var bezierPoints = findCBezPoints(bezier);

	var points = [null, null, null];

	for (var i = 0; i < bezierPoints.length; i++) {
		var width = startWidth + i / endWidth;

		var x = bezierPoints[i].x;
		var y = bezierPoints[i].y;

		points[0] = points[1];
		points[1] = points[2];
		points[2] = { X: x, Y: y };

		if (points[0] == null) continue;

		var p0 = points[0];
		var p1 = points[1];
		var p2 = points[2];

		var x0 = (p0.X + p1.X) / 2;
		var y0 = (p0.Y + p1.Y) / 2;

		var x1 = (p1.X + p2.X) / 2;
		var y1 = (p1.Y + p2.Y) / 2;

		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		ctx.lineCap = "round";

		ctx.moveTo(x0, y0);
		ctx.quadraticCurveTo(p1.X, p1.Y, x1, y1);
		ctx.stroke();
	}

	//pointArray.push([newEndX, newEndY])
};

let eyeLashPoints = [];

ctx.lineCurvedStroke = function (
	color,
	startWidth,
	endWidth,
	endX,
	endY,
	cp1,
	cp2,
	cp3,
	cp4,
	eyeLash
) {
	let startX = pointArray[pointArray.length - 1][0];
	let startY = pointArray[pointArray.length - 1][1];

	let newEndX = startX + endX;
	let newEndY = startY + endY;

	let cp1Local = startX + cp1;
	let cp2Local = startY + cp2;

	let cp3Local = startX + cp3;
	let cp4Local = startY + cp4;

	var bezier = [
		{ x: startX, y: startY },
		{ x: cp1Local, y: cp2Local },
		{ x: cp3Local, y: cp4Local },
		{ x: newEndX, y: newEndY },
	];

	var bezierPoints = findCBezPoints(bezier);

	var points = [null, null, null];

	if (eyeLashPoints.length == 0) {
		var eyeLashPoint = rand(50, bezierPoints.length - 1);
		var eyeLashPoint2 = rand(50, bezierPoints.length - 1);
		var eyeLashPoint3 = rand(50, bezierPoints.length - 1);
	}

	eyeLashPoints.push(eyeLashPoint, eyeLashPoint2, eyeLashPoint3);

	for (var i = 0; i < bezierPoints.length; i++) {
		var width = startWidth + i / endWidth;

		var x = bezierPoints[i].x;
		var y = bezierPoints[i].y;

		points[0] = points[1];
		points[1] = points[2];
		points[2] = { X: x, Y: y };

		if (points[0] == null) continue;

		var p0 = points[0];
		var p1 = points[1];
		var p2 = points[2];

		var x0 = (p0.X + p1.X) / 2;
		var y0 = (p0.Y + p1.Y) / 2;

		var x1 = (p1.X + p2.X) / 2;
		var y1 = (p1.Y + p2.Y) / 2;

		ctx.beginPath();
		ctx.lineWidth = width;
		ctx.strokeStyle = color;
		ctx.lineCap = "round";

		ctx.moveTo(x0, y0);
		ctx.quadraticCurveTo(p1.X, p1.Y, x1, y1);
		ctx.stroke();
		//ctx.closePath()

		if (eyeLash == true) {
			if (
				i == eyeLashPoints[0] ||
				i == eyeLashPoints[1] ||
				i == eyeLashPoints[2]
			) {
				ctx.beginPath();
				ctx.lineWidth = 2;
				ctx.strokeStyle = color;
				ctx.lineCap = "round";
				ctx.moveTo(x0, y0);
				//console.log(x0, y0)

				if (cp1 < 0) {
					if (cp2 < 0) {
						ctx.lineCurvedStrokeLash(
							"#2b909d",
							x0,
							y0,
							7,
							-10,
							-30,
							-25,
							0,
							0,
							-40,
							0
						);
					} else {
						ctx.lineCurvedStrokeLash(
							"#2b909d",
							x0,
							y0,
							4,
							-10,
							-10,
							12,
							0,
							0,
							-10,
							0
						);
					}
				} else {
					if (cp2 < 0) {
						ctx.lineCurvedStrokeLash(
							"#2b909d",
							x0,
							y0,
							7,
							-10,
							30,
							-25,
							0,
							0,
							40,
							0
						);
						// ctx.lineTo(x0+10, y0-10)
					} else {
						ctx.lineCurvedStrokeLash(
							"#2b909d",
							x0,
							y0,
							4,
							-10,
							10,
							12,
							0,
							0,
							10,
							0
						);
						// ctx.lineTo(x0+10, y0+10)
					}
				}

				ctx.stroke();
				ctx.closePath();
			}
		}

		ctx.moveTo(x0, y0);
	}
};

ctx.pencilTo = function (
	width,
	endWidth,
	iterations,
	color,
	startX,
	startY,
	endX,
	endY,
	cp1,
	cp2,
	cp3,
	cp4,
	circle,
	size
) {
	let newEndX = startX + endX;
	let newEndY = startY + endY;

	let cp1Local = startX + cp1;
	let cp2Local = startY + cp2;

	let cp3Local = startX + cp3;
	let cp4Local = startY + cp4;

	var bezier = [
		{ x: startX, y: startY },
		{ x: cp1Local, y: cp2Local },
		{ x: cp3Local, y: cp4Local },
		{ x: newEndX, y: newEndY },
	];

	var bezierPoints = findCBezPoints(bezier);

	var points = [null, null, null];

	var widthFactor = (width - endWidth) / bezierPoints.length;

	ctx.moveTo(startX, startY);

	pointArray.push([newEndX, newEndY]);

	for (var j = 0; j < iterations; j++) {
		for (var i = 0; i < bezierPoints.length; i++) {
			var drawWidth = width - widthFactor * i;

			var x = bezierPoints[i].x;
			var y = bezierPoints[i].y;

			points[0] = points[1];
			points[1] = points[2];
			points[2] = { X: x, Y: y };

			if (points[0] == null) continue;

			var p0 = points[0];
			var p1 = points[1];
			var p2 = points[2];

			var x0 = (p0.X + p1.X) / 2;
			var y0 = (p0.Y + p1.Y) / 2;

			ctx.moveTo(x0, y0);

			var alpha = perlin.get(x0, y0);

			if (alpha < 0.1) {
				alpha = 0.1;
			}

			if (i > bezierPoints.length * 0.8) {
				let fader = (drawWidth / i) * 10;
				alpha = alpha - fader;
				//console.log(alpha)
			}

			ctx.globalAlpha = alpha;

			var radius = drawWidth;

			if (width == 1) {
				radius = radius / 20;
				//console.log(radius)
			}

			var offsetX = rand(-radius, radius);
			var offsetY = rand(-radius, radius);

			if (j > iterations * 0.7) {
				offsetY = -drawWidth;
			}
			if (j > iterations * 0.85) {
				offsetY = drawWidth;
			}

			if (i > 1) {
				ctx.fillStyle = color;
				if (size) {
					ctx.fillRect(x0 + offsetX, y0 + offsetY, size, size);
				} else {
					ctx.fillRect(x0 + offsetX, y0 + offsetY, 1, 1);
				}
			}
		}
	}

	ctx.globalAlpha = 1;
};
