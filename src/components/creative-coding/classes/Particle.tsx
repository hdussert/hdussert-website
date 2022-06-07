class Particle {
  ctx: CanvasRenderingContext2D
  checked: boolean
  
  x: number
  y: number

  vx: number
  vy: number

  size: number
  color: string

  constructor(
    ctx: CanvasRenderingContext2D, 
    x: number, y: number, 
    dir: number, 
    speed: number, 
    size: number, 
    color: string
  ) {

    this.ctx = ctx

    this.x = x
    this.y = y
    
    this.vx = Math.sin(dir) * speed;
    this.vy = Math.cos(dir) * speed;
    
    this.size = size
    this.color = color

    this.checked = false
  }

  update() {
    this.x += this.vx
    this.y += this.vy
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.ellipse(this.x, this.y, this.size, this.size, 0, 0, 360)
    this.ctx.fillStyle = this.color
    this.ctx.fill()
  }

  animate() {
    this.update()
    this.draw()
  }
}


class CagedParticle extends Particle {
  canvasWidth: number
  canvasHeight: number

  constructor(    
    ctx: CanvasRenderingContext2D, 
    x: number, y: number, 
    dir: number, 
    speed: number, 
    size: number, 
    color: string, 
    canvasWidth: number, canvasHeight: number
  ) {
    super(ctx, x, y, dir, speed, size, color)
    
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
  }

  update() {
    if (this.x <= this.size || this.x >= this.canvasWidth - this.size) {
      this.x = this.x <= this.size ? this.size : this.canvasWidth - this.size
      this.vx *= -1
    }

    if (this.y <= this.size || this.y >= this.canvasHeight - this.size) {
      this.y = this.y <= this.size ? this.size : this.canvasHeight - this.size
      this.vy *= -1
    }
    
    super.update();
  }
}

export { Particle, CagedParticle }