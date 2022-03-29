import { useContext, useEffect, useRef } from 'react';
import { CreativeCodingContext } from '../../pages/CreativeCoding';
import Canvas from './Canvas'
import { Stream } from './classes/Stream';

const NB_OF_STREAMS = 150;

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let streams = useRef<Stream[]>([]);

  const context = useContext(CreativeCodingContext);
  const canvasWidth = context?.width || 0
  const canvasHeight = context?.height || 0
  
  useEffect(()=>{
    const _ctx = canvasRef?.current?.getContext('2d')
    if (!_ctx) return;

    streams.current = new Array(NB_OF_STREAMS).fill(undefined).map(_ => new Stream(_ctx, canvasWidth, canvasHeight));
  }, [canvasHeight, canvasWidth])
  

  const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (!streams) return 
    streams.current.forEach(s => s.animate());
  }

  return (
    <div className='fill matrix-rain-canvas'>
      <Canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} draw={draw} fpsCap={60}/>
    </div>
  )
}

export default MatrixRain