import React, { useContext, useRef } from 'react'
import { degreeToRadian } from './utils/Maths';
import Canvas from './Canvas'
import { polygon } from './utils/Draw';
import { CreativeProjectContext } from './CreativeProject';

//--
const Phyllotaxis = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const translated = useRef(false);
  const rendered = useRef(false);
  
  const context = useContext(CreativeProjectContext);
  const canvasWidth = context?.width || 0
  const canvasHeight = context?.height || 0
  
  const midX = canvasWidth / 2;
  const midY = canvasHeight / 2;

  let angle = 137.51
  let animate = false;
  let shape = 'rectangle'
  let fill = false;
  let sizeMin = 1
  let sizeMax = 20
  let colorOffset = 180
  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    if (rendered.current && !animate) return
    if (!translated.current) {
      ctx.translate(midX, midY)
      ctx.lineWidth = 4
      translated.current = true;
    }

    ctx.clearRect(-midX,-midY, canvasWidth, canvasHeight);
    let sz = 0;
    let rot = 0;
    if (animate) {
      angle += 0.0025
      colorOffset += 1;
    }
    const _angle = degreeToRadian(angle);

    for (let i = 0; i < 500; i++) {
      const step = i / 500;
      let size = (sizeMax - sizeMin) * step + sizeMin
      let color = `hsl(${step * 360 + colorOffset}, 80%, 50%)`

      ctx.rotate(rot)
      ctx.beginPath()
      
      // Shape
      switch(shape) {
        case 'rectangle': ctx.rect(sz, sz, size, size); break;
        case 'triangle': polygon(ctx, sz, sz, size/2, 3); break;
        case 'hexagon': polygon(ctx, sz, sz, size/2, 6); break;
        case 'octogon': polygon(ctx, sz, sz, size/2, 8); break;
        default : ctx.ellipse(sz, sz, size / 2, size / 2, 0, 0, 360);
      }
      
      // Draw      
      if (fill) ctx.fillStyle = color
      else {
        ctx.fillStyle = '#0F0F00'
        ctx.strokeStyle = color
        ctx.stroke()
      }
      ctx.fill()

      sz += .41
      ctx.rotate(-rot)
      rot = (rot + _angle);
    }
    rendered.current = true;
  }

  const changeAngle = (e: React.ChangeEvent<HTMLInputElement>)  => {
    angle = Number(e.target.value);
    rendered.current = false;
  }
  const changeAnimate = (e: React.ChangeEvent<HTMLInputElement>)  => {
    animate = e.target.checked;
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
  const changeColor = (e: React.ChangeEvent<HTMLInputElement>)  => {
    colorOffset = Number(e.target.value);
    rendered.current = false;
  }

  return (
    <div className='fill phyllotaxis'>
      <div className='phyllotaxis-inputs'>
        <div>
          <label htmlFor="angle">Angle</label><br/>
          <input onChange={changeAngle} defaultValue={angle} type="number" id="angle" name="Angle"/>
          <br/>
          <label htmlFor="color">Color</label><br/>
          <input onChange={changeColor} defaultValue={colorOffset} type="range" id="color" name="Color" min={0} max={360} step={'0.01'}/>
        </div>

        <div>
          <label htmlFor="size-mix">Center size</label><br/>
          <input onChange={changeSizeMin} defaultValue={sizeMin} type="range" id="size-min" name="size-min" min={1} max={100} step={'0.01'}/>
          <br/>
          <label htmlFor="size-max">Outer size</label><br/>
          <input onChange={changeSizeMax} defaultValue={sizeMax} type="range" id="size-max" name="size-max" min={1} max={100} step={'0.01'}/>
        </div>

        
        <div>
          <select style={{marginBottom: '.3rem'}}onChange={changeShape} name="Forms" id="shape">
            <option value="rectangle">Square</option>
            <option value="hexagon">Hexagon</option>
            <option value="octogon">Octogon</option>
            <option value="ellipse">Circle</option>
            <option value="triangle">Triangle</option>
          </select>
          <br/>
          <label htmlFor="full">Fill&nbsp;</label>
          <input onChange={changeFillMode} type='checkbox' name='full'/>
          <br/>
          <label htmlFor="overtime-angle">Animate&nbsp;</label>
          <input onChange={changeAnimate} type='checkbox' name='angle-overtime' id='angle-overtime'/>
        </div>

      </div>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} draw={draw} fpsCap={60}/>
    </div>
  )
}

export default Phyllotaxis