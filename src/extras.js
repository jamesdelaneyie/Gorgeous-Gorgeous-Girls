function simplifyPoints(a){
  let a2 = []
  for(let i=0;i<a.length;i++){
    let pt = {x:Math.round(a[i].x),y:Math.round(a[i].y)}
    if(pt.x == -0) pt.x = 0
    if(pt.y == -0) pt.y = 0
    if(i==0 || pt.x != a2[a2.length-1].x || pt.y != a2[a2.length-1].y)
      a2.push(pt)
  }
  return a2
}

function augmentPoints(a){
    // add distances between pts
    if(a.length == 0) return a
    let d
    let p0 = a[0]
    p0.sPerimeter = 0
    p0.dPrevious = 0
    for(let i=1;i<a.length;i++){
      d = distance(a[i],a[i-1])
      a[i].dPrevious = d
      a[i].sPerimeter = a[i-1].sPerimeter + d
    }
    return a
  }

  function addIntermediatePoints(pts,n){
    let pts2 = []
    for(let i=0;i<n;i++){
      let pt = lerpPath(i/(n-1),pts)
      pts2.push(pt)
    }
    return pts2
  }

  function darkenEdgesCanvas(c,f,bInvert){
	f = f == null ? .1 : f
	bInvert = bInvert == null ? false : bInvert
	let de = Math.round(Math.min(c.width,c.height)*f)
	let x,y,w,h,edge
	w = c.width
	h = c.height
	let dc = c.getContext('2d')
  var myData = dc.getImageData(0, 0, w, h);
  let v0 = bInvert ? 255 : 0
  let v1 = bInvert ? 0 : 255
	for(x=0;x<w;x++){
		for(y=0;y<h;y++){
			edge = Math.min(x,y,w-x,h-y)
			let vMax = edge > de ? 255 : map(edge,0,de,v0,v1)
			let vals = getPixelValues(myData,x,y)
			if(bInvert){
				if(vals[0] < vMax && edge <= de){
					dc.fillStyle = 'rgb('+vMax+','+vMax+','+vMax+')'
					dc.fillRect(x,y,1,1)
				}
			}
			else
				if(vals[0] > vMax){
					dc.fillStyle = 'rgb('+vMax+','+vMax+','+vMax+')'
					dc.fillRect(x,y,1,1)
				}
		}
	}
}
