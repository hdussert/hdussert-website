import React, { useContext, useEffect, useRef } from 'react'
import { FunContext } from '../../pages/Fun'
import Canvas from './Canvas'

// Utils
const EqTriangle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, side: number) => {
  var h = side * (Math.sqrt(3)/2)
  ctx.moveTo(cx, cy - h / 2)
  ctx.lineTo(cx - side / 2, cy + h / 2)
  ctx.lineTo(cx + side / 2, cy + h / 2)
  ctx.lineTo(cx, cy - h / 2)
}

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

  
  let translated = useRef(false);
  let rendered = useRef(false);
  
  const context = useContext(FunContext);
  const CANVAS_WIDTH = context?.width !== undefined ? context.width : 0
  const CANVAS_HEIGHT = context?.height !== undefined ? context.height : 0
  const midX = CANVAS_WIDTH / 2;
  const midY = CANVAS_HEIGHT / 2;
  if (CANVAS_HEIGHT === 0 || CANVAS_WIDTH === 0) return <></>

  let angle = 155.75
  let angleUpdate = false;
  let shape = 'rectangle' // can also be rectangle / triangle
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

    ctx.clearRect(-midX,-midY,CANVAS_WIDTH, CANVAS_HEIGHT);
    let sz = 50;
    let rot = 0;
    if (angleUpdate) angle += 0.0025
    
    const _angle = degreeToRadian(angle);

    for (let i = 0; i < 500; i++) {
      ctx.rotate(rot)
      
      ctx.beginPath()
      
      // Shape
      let size = (sizeMax - sizeMin) * i / 500.0 + sizeMin
      switch(shape) {
        case 'rectangle': ctx.rect(-sz/2, -sz/2, size, size); break;
        case 'triangle': EqTriangle(ctx, -sz/2, -sz/2, size); break;
        default : ctx.ellipse(-sz/2, -sz/2, size, size, 0, 0, 360);
      }
      
      // Draw      
      let angleColor =  degreeToRadian(i / 500 * 360)
      let color = rgbFromAngle(angleColor)
      if (fill) ctx.fillStyle = color
      else ctx.fillStyle = '#0F0F00'
      ctx.fill()
      ctx.strokeStyle = color
      ctx.stroke()
      

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
            <option value="rectangle">Carré</option>
            <option value="ellipse">Cercle</option>
            <option value="triangle">Triangle</option>
          </select>
          <br/>
          <label htmlFor="full">Remplir&nbsp;</label>
          <input onChange={changeFillMode} type='checkbox' name='full'/>
        </div>

      </div>
      <Canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} draw={draw}/>
    </div>
  )
}

export default Phyllotaxis