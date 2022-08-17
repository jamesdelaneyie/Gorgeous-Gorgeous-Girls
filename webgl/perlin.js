let perlin = {
	rand_vect: function () {
		let theta = Math.random() * 2 * Math.PI;
		return { x: Math.cos(theta), y: Math.sin(theta) };
	},
	dot_prod_grid: function (x, y, vx, vy) {
		let g_vect;
		let d_vect = { x: x - vx, y: y - vy };
		if (this.gradients[[vx, vy]]) {
			g_vect = this.gradients[[vx, vy]];
		} else {
			g_vect = this.rand_vect();
			this.gradients[[vx, vy]] = g_vect;
		}
		return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
	},
	smootherstep: function (x) {
		return 6 * x ** 5 - 15 * x ** 4 + 10 * x ** 3;
	},
	interp: function (x, a, b) {
		return a + this.smootherstep(x) * (b - a);
	},
	seed: function () {
		this.gradients = {};
		this.memory = {};
	},
	get: function (x, y) {
		if (this.memory.hasOwnProperty([x, y])) return this.memory[[x, y]];
		let xf = Math.floor(x);
		let yf = Math.floor(y);
		//interpolate
		let tl = this.dot_prod_grid(x, y, xf, yf);
		let tr = this.dot_prod_grid(x, y, xf + 1, yf);
		let bl = this.dot_prod_grid(x, y, xf, yf + 1);
		let br = this.dot_prod_grid(x, y, xf + 1, yf + 1);
		let xt = this.interp(x - xf, tl, tr);
		let xb = this.interp(x - xf, bl, br);
		let v = this.interp(y - yf, xt, xb);
		this.memory[[x, y]] = v;
		return v;
	},
};

perlin.seed();


const mapNumbers = (number, [inMin, inMax], [outMin, outMax]) => {
    // if you need an integer value use Math.floor or Math.ceil here
    return (number - inMin) / (inMax - inMin) * (outMax - outMin) + outMin;
}

/*
h = 100
w = 100
var M = 4294967296,
// a - 1 should be divisible by m's prime factors
A = 1664525,
// c and m should be co-prime
C = 1;
var Z = Math.floor(Math.random() * M);

function rand(){
  Z = (A * Z + C) % M;
  return Z / M - 0.5;
};

function interpolate(pa, pb, px){
  var ft = px * Math.PI,
    f = (1 - Math.cos(ft)) * 0.5;
  return pa * (1 - f) + pb * f;
}

var x = 0,
  y = 0,
  amp = 100, //amplitude
  wl = 100, //wavelength
  fq = 1 / wl, //frequency
  a = rand(),
  b = rand();

while(x < w){
  if(x % wl === 0){
    a = b;
    b = rand();
    y = h / 2 + a * amp;
  }else{
    y = h / 2 + interpolate(a, b, (x % wl) / wl) * amp;
  }
  //console.log(y)
  x += 1;
}*/
