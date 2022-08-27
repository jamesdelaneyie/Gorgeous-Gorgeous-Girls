function rand(min, max) {
	return Math.floor(fxrand() * (max - min + 1) + min);
}

function randFloat(min, max) {
	return parseFloat((fxrand() * (min - max) + max).toFixed(4));
}

function randFloatTwo(min, max) {
	return parseFloat((fxrand() * (min - max) + max).toFixed(2));
}

const mapNumbers = (number, [inMin, inMax], [outMin, outMax]) => {
	return ((number - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
};

function rotatePoints(cx, cy, x, y, angle) {
	var radians = (Math.PI / 180) * angle,
		cos = Math.cos(radians),
		sin = Math.sin(radians),
		nx = cos * (x - cx) + sin * (y - cy) + cx,
		ny = cos * (y - cy) - sin * (x - cx) + cy;
	return [nx, ny];
}

function rotatePointsAround(points, center, degrees) {
	if (points && points.length) {
		const [cx, cy] = center;
		const angle = (Math.PI / 180) * degrees;
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		points.forEach((p) => {
			const x = p.x;
            const y = p.y;
			p.x = (x - cx) * cos - (y - cy) * sin + cx;
			p.y = (x - cx) * sin + (y - cy) * cos + cy;
		});
	}
}

function rotateLines(lines, center, degrees) {
	const points = [];
	lines.forEach((line) => points.push(...line));
    console.log(points);
	rotatePointsAround(points, center, degrees);
}

function lineLength(line) {
    const p1 = line[0];
    const p2 = line[1];
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function midpoint(x1, y1, x2, y2) {
	return [(x1 + x2) / 2, (y1 + y2) / 2];
}

for (var i=1e6, lookupTable=[]; i--;) {
  lookupTable.push(Math.random()*10|5);
}

function lookup() {
    return ++i >= lookupTable.length ? lookupTable[i=0] : lookupTable[i];
}

export {
	rand,
	randFloat,
	randFloatTwo, 
	mapNumbers,
	rotatePoints,
	rotatePointsAround,
	rotateLines,
    lineLength,
    lookupTable,
    lookup,
    midpoint
};
