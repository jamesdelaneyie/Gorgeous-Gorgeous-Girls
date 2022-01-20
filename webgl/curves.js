function findCBezPoints(b){
    var startPt=b[0];
    var controlPt1=b[1];
    var controlPt2=b[2];
    var endPt=b[3];
    var pts=[b[0]];
    var lastPt=b[0];
    var tests=5000;
    for(var t=0;t<=tests;t++){
      var pt=getCubicBezierXYatT(b[0],b[1],b[2],b[3], t/tests);
      var dx=pt.x-lastPt.x;
      var dy=pt.y-lastPt.y;
      var d=Math.sqrt(dx*dx+dy*dy);
      var dInt=parseInt(d);
      if(dInt>0 || t==tests){
        lastPt=pt;
        pts.push(pt);
      }
    }
    return(pts);
  }
  
  
  function getCubicBezierXYatT(startPt, controlPt1, controlPt2, endPt, T) {
    var x = CubicN(T, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
    var y = CubicN(T, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
    return ({
      x: x,
      y: y
    });
  }
  
  function CubicN(T, a, b, c, d) {
    var t2 = T * T;
    var t3 = t2 * T;
    return a + (-a * 3 + T * (3 * a - a * T)) * T + (3 * b + T * (-6 * b + b * 3 * T)) * T + (c * 3 - c * 3 * T) * t2 + d * t3;
  }

  
  function drawBez(b){
    ctx.lineWidth=0;
    ctx.beginPath();
    ctx.moveTo(b[0].x,b[0].y);
    ctx.bezierCurveTo(b[1].x,b[1].y, b[2].x,b[2].y, b[3].x,b[3].y);
    ctx.stroke();
  }