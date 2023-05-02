/**
 * https://github.com/gre/bezier-easing
/** */
var NEWTON_ITERATIONS = 4;
var NEWTON_MIN_SLOPE = 0.001;
var SUBDIVISION_PRECISION = 0.0000001;
var SUBDIVISION_MAX_ITERATIONS = 10;

var kSplineTableSize = 11;
var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

var float32ArraySupported = typeof Float32Array === 'function';

function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
function C (aA1)      { return 3.0 * aA1; }

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

function binarySubdivide (aX, aA, aB, mX1, mX2) {
  var currentX, currentT, i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
}

function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
   var currentSlope = getSlope(aGuessT, mX1, mX2);
   if (currentSlope === 0.0) {
     return aGuessT;
   }
   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
   aGuessT -= currentX / currentSlope;
 }
 return aGuessT;
}

function LinearEasing (x) {
  return x;
}

function bezier (mX1, mY1, mX2, mY2) {
  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
    throw new Error('bezier x values must be in [0, 1] range');
  }

  if (mX1 === mY1 && mX2 === mY2) {
    return LinearEasing;
  }

  // Precompute samples table
  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
  for (var i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }

  function getTForX (aX) {
    var intervalStart = 0.0;
    var currentSample = 1;
    var lastSample = kSplineTableSize - 1;

    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;

    // Interpolate to provide an initial guess for t
    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    var guessForT = intervalStart + dist * kSampleStepSize;

    var initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0.0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }

  return function BezierEasing (x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0 || x === 1) {
      return x;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
};

var drawSVG = function(points, width, ipo, name){

  function addPoints (a, b) {
      return [ a[0] + b[0], a[1] + b[1] ];
  }
  function project (p) {
      return [  1 * p[0], 100 - p[1] ];
  }


  var svg = "<g width='"+width+"' height='100' style='overflow:visible;'>";

  // curve
  svg += "<path fill='none' stroke-width='2' stroke='#f00' d='";
  var i, p, point, prev = points[0];
  for (i = 1; i < points.length; i++) {
  }
  svg += "' />";

  // points and handles
  for (i = 0; i < points.length; i++) {
      point = points[i];
      p = project(point.p);
      var clr = "#f00";
      svg += "<circle cx='"+p[0]+"' cy='"+p[1]+"' r='3' fill='"+clr+"' />";
      [point.lower, point.upper].filter(function (o) { return o; }).map(function (handle) {
          handle = project(addPoints(handle, point.p));
          var d = "M "+p+" L"+handle;
          svg += "<path stroke='"+clr+"' d='"+d+"' />";
          svg += "<circle cx='"+handle[0]+"' cy='"+handle[1]+"' r='2' fill='"+clr+"' />";
      });
  }

  // interpolation sampling
  for (var x=0; x<width; x += 1) {
      var y = ipo(x);
      p = project([ x, y ]);
      //console.log(p)
      svg += "<circle cx='"+p[0]+"' cy='"+p[1]+"' r='1' fill='#ffa' />";
  }

  // text
  svg += "<text x='' y='110' fill='#fff' font-size='12' font-family='sans-serif'>"+name+"</text>";

  svg += "</g>";

    let svgWrapper = document.getElementById("easing-wrapper");
    //turn text string into svg element
    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.style.background = "#111";
    svgElement.style.width = width + "px";
    svgElement.style.height = "100px";
    svgElement.style.marginRight = "20px";
    svgElement.style.padding = "20px"
    svgElement.style.overflow = "visible";
    svgElement.style.flex = "1 0 auto"
    svgElement.innerHTML = svg;
    if(svgWrapper){
      svgWrapper.appendChild(svgElement);
    }

}

function getEasing(easing){
    if(easing === "linear"){
        return [0,0,1,1];
    } else if(easing == "slight-ease") {
        return [0.4,0.1,1,1];
    } else if(easing === "ease"){
        return [0.25,0.1,0.25,1];
    } else if(easing === "ease-in"){
        return [0.42,0,1,1];
    } else if(easing === "ease-out"){
        return [0,0,0.58,1];
    } else if(easing === "ease-in-out"){
        return [0.42,0,0.58,1];
    } else if(easing === "ease-in-quad"){
        return [0.55,0.085,0.68,0.53];
    } else if(easing === "ease-in-cubic"){
        return [0.55,0.055,0.675,0.19];
    } else if(easing === "ease-in-quart"){
        return [0.895,0.03,0.685,0.22];
    } else if(easing === "ease-in-quint"){
        return [0.755,0.05,0.855,0.06];
    } else if(easing === "ease-in-sine"){
        return [0.47,0,0.745,0.715];
    } else if(easing === "ease-in-expo"){
        return [0.95,0.05,0.795,0.035];
    } else if(easing === "ease-in-circ"){
        return [0.6,0.04,0.98,0.335];
    } else if(easing === "ease-in-back"){
        return [0.6,-0.28,0.735,0.045];
    } else if(easing === "ease-out-quad"){
        return [0.25,0.46,0.45,0.94];
    } else if(easing === "ease-out-cubic"){
        return [0.215,0.61,0.355,1];
    } else if(easing === "ease-out-quart"){
        return [0.165,0.84,0.44,1];
    } else if(easing === "ease-out-quint"){
        return [0.23,1,0.32,1];
    } else if(easing === "ease-out-sine"){
        return [0.39,0.575,0.565,1];
    } else if(easing === "ease-out-expo"){
        return [0.19,1,0.22,1];
    } else if(easing === "ease-out-circ"){
        return [0.075,0.82,0.165,1];
    } else if(easing === "ease-out-back"){
        return [0.175,0.885,0.32,1.275];
    } else if(easing === "ease-in-out-quad"){
        return [0.455,0.03,0.515,0.955];
    } else if(easing === "ease-in-out-cubic"){
        return [0.645,0.045,0.355,1];
    } else if(easing === "ease-in-out-quart"){
        return [0.77,0,0.175,1];
    } else if(easing === "ease-in-out-quint"){
        return [0.86,0,0.09,1];
    } else if(easing === "ease-in-out-sine"){
        return [0.445,0.05,0.55,0.95];
    } else if(easing === "ease-in-out-expo"){
        return [1,0,0,1];
    } else if(easing === "ease-in-out-circ"){
        return [0.785,0.135,0.15,0.86];
    } else if(easing === "ease-in-out-back"){
        return [0.68,-0.55,0.265,1.55];
    } else if(easing === "last-out") {
        return [1,0,1,-1]
    } else {
        return [0,0,1,1];
    }
    //var easing = bezier(0.33, 1, 0.68, 1)
    //var easing = bezier(0.16, 1, 0.3, 1)
    //var easing = bezier(0.32, 0, 0.67, 0);
    //var easing = bezier(0.12, 0, 0.39, 0);
    //var easing = bezier(0.64, 0, 0.78, 0);
    //var easing = bezier(0.55, 0, 1, 0.45);
    //var easing = bezier(0.46, 0, .01, 1);
    //var easing = bezier(.99,-0.01,.61,1);
}


export { bezier, drawSVG, getEasing };
