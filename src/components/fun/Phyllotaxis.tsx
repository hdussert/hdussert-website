import React, { useContext, useRef } from 'react'
import { FunContext } from '../../pages/Fun'
import Canvas from './Canvas'

// Utils
function polygon(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, npoints: number) {
  const angle = TWO_PI / npoints;
  ctx.beginPath()
  for (let a = 0; a <= TWO_PI + angle; a += angle) {
    let sx = x + Math.cos(a) * radius;
    let sy = y + Math.sin(a) * radius;
    ctx.lineTo(sx, sy);
  }
}

const TWO_PI = Math.PI * 2
const degreeToRadian = (angle: number) => angle * Math.PI / 180;

const deg120toRad = degreeToRadian(120)
const deg240toRad = deg120toRad * 2;

const rgbFromAngle = (angle: number) : string => {
  const angle2 = angle + deg120toRad
  const angle3 = angle + deg240toRad
  
  const g = Math.sin(angle) * 127 + 128;
  const b = Math.sin(angle2) * 127 + 128;
  const r = Math.sin(angle3) * 127 + 128; 
  return `rgb(${r},${g},${b})`
}

//--
const Phyllotaxis = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const translated = useRef(false);
  const rendered = useRef(false);
  
  const context = useContext(FunContext);
  const canvasWidth = Math.min(context?.width  || 0, 768)
  const canvasHeight = context?.height || 0
  
  const midX = canvasWidth / 2;
  const midY = canvasHeight / 2;

  let angle = 155.75
  let angleUpdate = false;
  let shape = 'triangle' // can also be rectangle / triangle
  let fill = false;
  let sizeMin = 100
  let sizeMax = 1

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    if (rendered.current && !angleUpdate) return
    if (!translated.current) {
      ctx.translate(midX, midY)
      ctx.lineWidth = 4
      translated.current = true;
    }

    ctx.clearRect(-midX,-midY, canvasWidth, canvasHeight);
    let sz = 50;
    let rot = 0;
    if (angleUpdate) angle += 0.0025
    
    const _angle = degreeToRadian(angle);

    for (let i = 0; i < 500; i++) {
      const step = i / 500;
      let size = (sizeMax - sizeMin) * step + sizeMin
      let color = rgbFromAngle(degreeToRadian(step * 360))

      ctx.rotate(rot)
      ctx.beginPath()
      
      // Shape
      switch(shape) {
        case 'rectangle': ctx.rect(-sz/2, -sz/2, size, size); break;
        case 'triangle': polygon(ctx, -sz/2, -sz/2, size/2, 3); break;
        case 'hexagon': polygon(ctx, -sz/2, -sz/2, size/2, 6); break;
        case 'octogon': polygon(ctx, -sz/2, -sz/2, size/2, 8); break;
        default : ctx.ellipse(-sz/2, -sz/2, size / 2, size / 2, 0, 0, 360);
      }
      
      // Draw      
      if (fill) ctx.fillStyle = color
      else {
        ctx.fillStyle = '#0F0F00'
        ctx.strokeStyle = color
        ctx.stroke()
      }
      ctx.fill()

      sz *= 1.0045
      ctx.rotate(-rot)
      rot = (rot + _angle);
    }
    rendered.current = true;
  }

  const changeAngle = (e: React.ChangeEvent<HTMLInputElement>)  => {
    angle = Number(e.target.value);
    rendered.current = false;
  }
  const changeAngleUpdate = (e: React.ChangeEvent<HTMLInputElement>)  => {
    angleUpdate = e.target.checked;
    rendered.current = false;
  }
  const changeSizeMin = (e: React.ChangeEvent<HTMLInputElement>)  => {
    sizeMin = Number(e.target.value);
    rendered.current = false;
  }
  const changeSizeMax = (e: React.ChangeEvent<HTMLInputElement>)  => {
    sizeMax = Number(e.target.value);
    rendered.current = false;
  }
  const changeShape = (e: React.ChangeEvent<HTMLSelectElement>) => {
    shape = e.target.value;
    rendered.current = false;
  }
  const changeFillMode = (e: React.ChangeEvent<HTMLInputElement>)  => {
    fill = e.target.checked;
    rendered.current = false;
  }


  return (
    <div className='fill phyllotaxis'>
      <div className='phyllotaxis-inputs'>
        <div>
          <label htmlFor="angle">Angle</label><br/>
          <input onChange={changeAngle} defaultValue={angle} type="range" id="angle" name="Angle" min={1} max={180} step={'0.01'}/>
          <br/>
          <label htmlFor="overtime-angle">Animer&nbsp;</label>
          <input onChange={changeAngleUpdate} type='checkbox' name='angle-overtime' id='angle-overtime'/>
        </div>

        <div>
          <label htmlFor="size-mix">Taille centre</label><br/>
          <input onChange={changeSizeMin} defaultValue={sizeMin} type="range" id="size-min" name="size-min" min={1} max={100} step={'0.01'}/>
          <br/>
          <label htmlFor="size-max">Taille externe</label><br/>
          <input onChange={changeSizeMax} defaultValue={sizeMax} type="range" id="size-max" name="size-max" min={1} max={100} step={'0.01'}/>
        </div>

        
        <div>
          <label htmlFor="shape">Forme</label><br/>
          <select onChange={changeShape} name="Forms" id="shape">
            <option value="triangle">Triangle</option>
            <option value="rectangle">Carré</option>
            <option value="hexagon">Hexagon</option>
            <option value="octogon">Octogon</option>
            <option value="ellipse">Cercle</option>
          </select>
          <br/>
          <label htmlFor="full">Remplir&nbsp;</label>
          <input onChange={changeFillMode} type='checkbox' name='full'/>
        </div>

      </div>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} draw={draw} fpsCap={60}/>
    </div>
  )
}

export default Phyllotaxis