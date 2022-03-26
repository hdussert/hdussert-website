import { NavLink, Outlet } from 'react-router-dom'
import PropTypes, { InferProps } from 'prop-types';
import { createContext, useLayoutEffect, useRef, useState } from 'react';

const FunPropTypes = {
  routes: PropTypes.arrayOf(PropTypes.exact({
    path: PropTypes.string.isRequired,
    title: PropTypes.string,
    Component: PropTypes.elementType
  }).isRequired)
}

type FunTypes = InferProps<typeof FunPropTypes>;

interface FunContextInterface {
  width: number | undefined,
  height: number | undefined
}
export const FunContext = createContext<FunContextInterface | null>(null);

const Fun = ({ routes }: FunTypes) => {
  
  const contentRef = useRef<HTMLDivElement>(null)
  const [funContext, setFunContext] = useState<FunContextInterface>({width: undefined, height: undefined});
  const [myBodyIsReady, setMyBodyIsReady] = useState(false);

  useLayoutEffect(()=>{
    setFunContext({
      width: contentRef?.current?.clientWidth,
      height: contentRef?.current?.clientHeight,
    })
    setMyBodyIsReady(true)
  },[])
  
  return (
    <div className='fill fun'>
      <div className='fun-container'>
        <div className='fun-navbar'>
        { routes?.map(({ path, title }, i : number) => <NavLink key={i} to={path}>{title}</NavLink>) }
        </div>
        <div ref={contentRef} className='fun-content'>
          <FunContext.Provider value={funContext}>
            { myBodyIsReady ? <Outlet /> : null }
          </FunContext.Provider>
        </div>
      </div>
    </div>
  )
}

export default Fun