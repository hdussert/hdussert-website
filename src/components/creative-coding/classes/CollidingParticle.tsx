import { CagedParticle } from "./Particle";

class CollidingParticle extends CagedParticle {
  mass: number

  constructor(
    ctx: CanvasRenderingContext2D, 
    x: number, y: number, 
    dir: number, 
    speed: number,
    size: number, 
    color: string, 
    canvasWidth: number, canvasHeight: number
  ) {
    super(ctx, x, y, dir, speed, size, color, canvasWidth, canvasHeight)

    this.mass = this.size * this.size;
  }
}

export { CollidingParticle }