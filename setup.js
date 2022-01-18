var config = {
    height: 1000,
    width: 1000,
    background: '#ffffff'
  }
  
  var c = document.getElementById("canvas");
  c.width = config.width
  c.height = config.height
  
  var ctx = c.getContext("2d");
  
  ctx.rect(0,0,config.width,config.height)
  ctx.fillStyle = '#ffffff'
  ctx.fill()

  let center = config.width/2
  
  let pointArray = [[center,center]]
  