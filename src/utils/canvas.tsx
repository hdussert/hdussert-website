export const getRandomInRange = (min: number, max: number): number => 
  (Math.random() * (max - min) + min) | 0;


export const degreeToRadian = (angle: number) => angle * Math.PI / 180;

export const TWO_PI = Math.PI * 2
const deg120toRad = degreeToRadian(120)
const deg240toRad = deg120toRad * 2;

export const rgbFromAngle = (angle: number) : string => {
  const angle2 = angle + deg120toRad
  const angle3 = angle + deg240toRad
  
  const g = Math.sin(angle) * 127 + 128;
  const b = Math.sin(angle2) * 127 + 128;
  const r = Math.sin(angle3) * 127 + 128; 
  return `rgb(${r},${g},${b})`
}

