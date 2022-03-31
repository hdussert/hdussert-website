import React, { createContext, useLayoutEffect, useRef, useState } from 'react'
import PropTypes, { InferProps } from 'prop-types';

const CreativeProjectPropTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.element,
    description: PropTypes.arrayOf(PropTypes.string),
    ressources: PropTypes.arrayOf(PropTypes.string)
}

type CreativeProjectTypes = InferProps<typeof CreativeProjectPropTypes>;

interface CreativeProjectContextInterface {
  width: number | undefined,
  height: number | undefined
}

export const CreativeProjectContext = createContext<CreativeProjectContextInterface | null>(null);

const CreativeProject = ({title, children, description, ressources}: CreativeProjectTypes) => {
  const [myBodyIsReady, setMyBodyIsReady] = useState(false);
  const [creativeProjectContext, setCreativeProjectContext] = useState<CreativeProjectContextInterface>({width: undefined, height: undefined});
  const contentRef = useRef<HTMLDivElement>(null)

  const descriptionToggler = useRef<HTMLInputElement>(null)

  useLayoutEffect(()=>{
    setCreativeProjectContext({
      width: contentRef?.current?.clientWidth,
      height: contentRef?.current?.clientHeight,
    })
    setMyBodyIsReady(true)
  },[])

  return (
    <div className='fill creative-project'>
      <div className='creative-project-container'>
          <input id='project-description-toggle' type="checkbox" ref={descriptionToggler}/>
          <label className='project-description-button' htmlFor='project-description-toggle'>
            i
          </label>

          <div className='creative-project-description'>
            <h2>{title}</h2><br/>
            {description?.map((d, i) => <p key={i}>{d}<br/><br/></p>)} 
          </div>
          <div ref={contentRef} className='creative-project-canvas'>
            <CreativeProjectContext.Provider value={creativeProjectContext}>
              { myBodyIsReady ? children : null }
            </CreativeProjectContext.Provider>
          </div>
      </div>
    </div>
  )
}

export default CreativeProject