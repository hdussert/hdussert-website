export function getRandomInRange(min: number, max: number): number { 
  return (Math.random() * (max - min) + min) | 0;
}

export function degreeToRadian(angle: number): number { 
  return angle * Math.PI / 180;
}

export const TWO_PI = Math.PI * 2

export function distance(x1: number, y1: number, x2: number, y2: number): number{
  const dx  = x1 - x2
  const dy  = y1 - y2
  return Math.sqrt(dx * dx + dy * dy)
}

export function distanceSqr(x1: number, y1: number, x2: number, y2: number): number{
  const dx  = x1 - x2
  const dy  = y1 - y2
  return dx * dx + dy * dy
}