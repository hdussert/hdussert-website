import { TWO_PI } from "./Maths";

export function polygon(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, npoints: number): void {
  const angle = TWO_PI / npoints;
  ctx.beginPath()
  for (let a = 0; a <= TWO_PI + angle; a += angle) {
    let sx = x + Math.cos(a) * radius;
    let sy = y + Math.sin(a) * radius;
    ctx.lineTo(sx, sy);
  }
}