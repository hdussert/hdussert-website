import { NavLink, Outlet } from 'react-router-dom'
import PropTypes, { InferProps } from 'prop-types';
import { createContext, useLayoutEffect, useRef, useState } from 'react';

const CreativeCodingPropTypes = {
  routes: PropTypes.arrayOf(PropTypes.exact({
    path: PropTypes.string.isRequired,
    title: PropTypes.string,
    Component: PropTypes.elementType
  }).isRequired)
}

type CreativeCodingTypes = InferProps<typeof CreativeCodingPropTypes>;

interface CreativeCodingContextInterface {
  width: number | undefined,
  height: number | undefined
}
export const CreativeCodingContext = createContext<CreativeCodingContextInterface | null>(null);

const CreativeCoding = ({ routes }: CreativeCodingTypes) => {
  
  const contentRef = useRef<HTMLDivElement>(null)
  const [creativeCodingContext, setCreativeCodingContext] = useState<CreativeCodingContextInterface>({width: undefined, height: undefined});
  const [myBodyIsReady, setMyBodyIsReady] = useState(false);

  useLayoutEffect(()=>{
    setCreativeCodingContext({
      width: contentRef?.current?.clientWidth,
      height: contentRef?.current?.clientHeight,
    })
    setMyBodyIsReady(true)
  },[])
  
  return (
    <div className='fill creative-coding'>
      <div className='creative-coding-container'>
        <div className='creative-coding-navbar'>
        { routes?.map(({ path, title }, i : number) => <NavLink key={i} to={path}>{title}</NavLink>) }
        </div>
        <div ref={contentRef} className='creative-coding-content'>
          <CreativeCodingContext.Provider value={creativeCodingContext}>
            { myBodyIsReady ? <Outlet /> : null }
          </CreativeCodingContext.Provider>
        </div>
      </div>
    </div>
  )
}

export default CreativeCoding