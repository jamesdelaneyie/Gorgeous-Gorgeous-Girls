import { rotatePointsAround, lineLength, lookup } from "./math.js";

class EdgeEntry {
	constructor(options = {}) {
		this.options = options;
		this.ymin = options.ymin;
		this.ymax = options.ymax;
		this.x = options.x;
		this.islope = options.islope;
	}
}

class ActiveEdgeEntry {
	constructor(options = {}) {
		this.options = options;
		this.s = options.s;
		this.edge = options.edge;
	}
}


function polygonHachureLines(x, y, width, height, points, gapSpace, degrees, isHatch=false, isZigzag=false, isZigzag2=false) {
    const angle = degrees
    const gap = gapSpace
    const secondAngle = angle * -1
  
    const rotationCenter = [x + width, y + height];

    rotatePointsAround(points, rotationCenter, angle);

    const lines = straightHachureLines(points, gap);

    lines.forEach((line) => {
        line.forEach((p) => {
            const [cx, cy] = rotationCenter;
            const angle = (Math.PI / 180) * secondAngle;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const x = p[0];
            const y = p[1];
            p[0] = (x - cx) * cos - (y - cy) * sin + cx;
            p[1] = (x - cx) * sin + (y - cy) * cos + cy;
        })
    });
    if(isHatch) {
        let hatchLines = structuredClone(lines)
        hatchLines.forEach((line) => {
            line.forEach((p) => {
                const [cx, cy] = rotationCenter;
                const angle = (Math.PI / 180) * -90;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const x = p[0];
                const y = p[1];
                p[0] = (x - cx) * cos - (y - cy) * sin + cx;
                p[1] = (x - cx) * sin + (y - cy) * cos + cy;
            })
        });
        lines.push(...hatchLines);
    }
    if(isZigzag) {
        const newLines = []
        var zo = gapSpace / 2;
        lines.forEach((line) => {
            const length = lineLength(line);
            const count = Math.round(length / (2 * zo));
            let p1 = line[0];
            let p2 = line[1];
            if (p1[0] > p2[0]) {
                p1 = line[1];
                p2 = line[0];
            }
            const alpha = Math.atan((p2[1] - p1[1]) / (p2[0] - p1[0]));
            for (let i = 0; i < count; i++) {
            const lstart = i * 2 * zo;
            const lend = (i + 1) * 2 * zo;
            const dz = Math.sqrt(2 * Math.pow(zo, 2));
            const start = [p1[0] + (lstart * Math.cos(alpha)), p1[1] + lstart * Math.sin(alpha)];
            const end = [p1[0] + (lend * Math.cos(alpha)), p1[1] + (lend * Math.sin(alpha))];
            const middle = [start[0] + dz * Math.cos(alpha + Math.PI / 4), start[1] + dz * Math.sin(alpha + Math.PI / 4)];
            newLines.push(
                [start, middle],
                [middle, end]
            );
            }
        });
        return newLines;
    }
    if(isZigzag2) {
        let newLines = []
        for(var i=0; i<lines.length-1; i++) {
            let newLine = []
            let startX = lines[i][0][0]
            let startY = lines[i][0][1]
            let endX = lines[i+1][1][0]
            let endY = lines[i+1][1][1]
            
            newLine = [
                [startX, startY],
                [endX, endY]
            ]
            newLines.push(newLine)
            newLines.push(lines[i])
        }
        return newLines;
    }
    return lines;
  }

function straightHachureLines(points, gap) {
	const vertexArray = [];

	for (const point of points) {
        vertexArray.push([point.x, point.y]);
	}

    const edges = [];
	const lines = [];
	gap = gap

    for (let i = 0; i < vertexArray.length - 1; i++) {
        const p1 = vertexArray[i];
        const p2 = vertexArray[i + 1];
        if (p1[1] !== p2[1]) {
            const ymin = Math.min(p1[1], p2[1]);
            let thisEdge = new EdgeEntry({
                ymin: ymin,
                ymax: Math.max(p1[1], p2[1]),
                x: ymin === p1[1] ? p1[0] : p2[0],
                islope: (p2[0] - p1[0]) / (p2[1] - p1[1]),
            })
            edges.push(thisEdge);
        }
    }


	edges.sort((e1, e2) => {
		if (e1.ymin < e2.ymin) {
			return -1;
		}
		if (e1.ymin > e2.ymin) {
			return 1;
		}
		if (e1.x < e2.x) {
			return -1;
		}
		if (e1.x > e2.x) {
			return 1;
		}
		if (e1.ymax === e2.ymax) {
			return 0;
		}
		return (e1.ymax - e2.ymax) / Math.abs(e1.ymax - e2.ymax);
	});
	if (!edges.length) {
		return lines;
	}

	let activeEdges = []

	let y = edges[0].ymin;
	while (activeEdges.length || edges.length) {
		if (edges.length) {
			let ix = -1;
			for (let i = 0; i < edges.length; i++) {
				if (edges[i].ymin > y) {
					break;
				}
				ix = i;
			}
			const removed = edges.splice(0, ix + 1);
			removed.forEach((edge) => {
                activeEdges.push(new ActiveEdgeEntry({
                    s: y,
                    edge: edge,
                }));
			});
		}
		activeEdges = activeEdges.filter((ae) => {
			if (ae.edge.ymax <= y) {
				return false;
			}
			return true;
		});
		activeEdges.sort((ae1, ae2) => {
			if (ae1.edge.x === ae2.edge.x) {
				return 0;
			}
			return (
				(ae1.edge.x - ae2.edge.x) / Math.abs(ae1.edge.x - ae2.edge.x)
			);
		});

		if (activeEdges.length > 1) {
			for (let i = 0; i < activeEdges.length; i = i + 2) {
				const nexti = i + 1;
				if (nexti >= activeEdges.length) {
					break;
				}
				const ce = activeEdges[i].edge;
				const ne = activeEdges[nexti].edge;
				lines.push([
					[Math.round(ce.x), y],
					[Math.round(ne.x), y],
				]);
			}
		}

        let randomNumber = lookup()
		y += gap//randomNumber;  
		activeEdges.forEach((ae) => {
			ae.edge.x = ae.edge.x + gap * ae.edge.islope;
		});
	}
	return lines;
}

export { straightHachureLines, polygonHachureLines };
