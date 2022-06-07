import { CagedParticle } from "./Particle";



class ParticleWithOrigin extends CagedParticle {
  originX: number
  originY: number
  distance: number

  color: string
  checked: boolean
  backToOrigin: boolean
  friction: number
  ease: number

  constructor(
    ctx: CanvasRenderingContext2D, 
    x: number, y: number, 
    originX: number, originY: number, 
    dir:number, 
    speed: number,
    size: number,
    color: string,
    canvasWidth: number, canvasHeight: number, 
  ) {
    super(ctx, x, y, dir, speed, size, color, canvasWidth, canvasHeight)
    this.originX = originX
    this.originY = originY

    this.backToOrigin = false

    this.friction = 0.95
    this.ease = .1

    this.distance = 0
    this.color = color

    this.checked = false
  }

  goHome() {
    this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
    this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
  }

  animate() {
    if (this.backToOrigin) this.goHome()
    else super.update()
    super.draw()
  }
}

export { ParticleWithOrigin }