/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
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

function BezierEasing (mX1, mY1, mX2, mY2) {
  
  if(mX1 === 0)
    mX1 = 0.0001;
  if(mX2 === 0)
    mX2 = 0.0001;
  if(mX1 === 1)
    mX1 = 0.9999;
  if(mX2 === 1)
    mX2 = 0.9999;

  if(mX2 < 0)
    mX2 = 0.0001;

  //console.log(mX1, mX2);

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

  return function bezier (x) {
    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
    if (x === 0 || x === 1) {
      return x;
    }
    return calcBezier(getTForX(x), mY1, mY2);
  };
};

var checkPoints = function (points) {
  //invariant(points instanceof Array && points.length>0, "points is a non-empty array");
  var curX = -Infinity;
  for (var i=0; i<points.length; i++) {
    var x = points[i].p[0];
    if (x<curX) {
      throw new Error("points must be sorted by x");
    }
    if (x===curX) {
      throw new Error("points must not have duplicate x");
    }
    //invariant(x !== curX, "points["+i+"].p[0] must be unique (to avoid ambiguity)");
    //invariant(x > curX, "points must be sorted by `p[0]` (x position)");
    curX = x;
  }
};

var computeBeziers = function (points) {
  var prev = points[0], point;
  var beziers = [];
  for (var i=1; i<points.length; i++) {
    point = points[i];
    var a = prev.p;
    var b = point.p;
    var w = b[0] - a[0];
    var h = b[1] - a[1];
    var left = prev.upper || [ 0, 0 ];
    var right = point.lower || [ 0, 0 ];
    if (!w || !h)
      beziers.push(null);
    else {
      try {
        //var bezier = BezierEasing(left[0]/w, left[1]/h, right[0]/w, right[1]/h);
        //console.log(left[0]/w, left[1]/h, right[0]/w, right[1]/h);
        beziers.push(
          w && h ?
          BezierEasing(left[0] / w, left[1] / h, 1 + right[0] / w, 1 + right[1] / h) :
          null // constant
        );
      }
      catch (e) {
        console.log(e);
        //invariant(false, "{upper,lower} for points["+(i-1)+".."+i+"]: "+e.message);
      }
    }
    prev = point;
  }
  return beziers;
};

var IPO = function(points) {
  checkPoints(points);
  var beziers = computeBeziers(points);
  return function (x) {
    var prev, point, i;
    for (i=0; i<points.length; i++) {
      point = points[i];
      var p = point.p;
      if (x < p[0]) break; // We have found the points segment where x is
      else if (x === p[0]) return p[1]; // if x is exactly the point's x, return that point's y
      prev = point;
    }
    var pX = point.p[0];
    if (!prev || x > pX) {
      // There is no 2 points to interpolate between, it is just point's y unless an lower/upper is defined,
      // in that case, we do a linear interpolation on edges.
      var edge = x > pX && point.upper || x < pX && point.lower;
      return point.p[1] + (edge && edge[1] !== 0 ? (x-pX) * edge[1] / edge[0] : 0);
    }
    var bezier = beziers[i - 1];
    if (!bezier) return prev.p[1]; // this happens when two following points have the same Y.
    var a = prev.p;
    var b = point.p;
    var w = b[0] - a[0];
    var h = b[1] - a[1];
    // Get the bezier's value and map it to the points' domain
    return a[1] + h * bezier((x - a[0]) / w);
  };
};

export { IPO };
