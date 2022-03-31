import { NavLink, Outlet, useLocation } from 'react-router-dom'
import PropTypes, { InferProps } from 'prop-types';
import { useEffect, useState } from 'react';

const CreativeCodingPropTypes = {
  routes: PropTypes.arrayOf(PropTypes.exact({
    path: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    Component: PropTypes.elementType,
    previewImagePath: PropTypes.string
  }).isRequired),
}

type CreativeCodingTypes = InferProps<typeof CreativeCodingPropTypes>;

const CreativeCoding = ({ routes }: CreativeCodingTypes) => {
  const [isHome, setIsHome] = useState(true);
  let location = useLocation();
  useEffect(()=> {
    setIsHome(location.pathname === '/creative-coding')
  },[])
  return (
    <div className='fill creative-coding'>
      <div className='creative-coding-container'>
        { isHome ? 
          <div className='creative-coding-home'>
            <div className='creative-coding-home-text'>
              <h3>Creative Coding</h3>
              <p>It's a type of computer programming in which the goal is to create something expressive rather than something functional.</p>
              <br/>
              <h3>Projects</h3>
              <p>On my projects, I use HTML Canvas with Javascript to animate them. I might use Tree.js or P5.js later on. Frame per seconds are capped at 60.</p>
            </div>
            <div className="creative-coding-projects">
              { routes?.map(({ path, title, previewImagePath }, i : number) => {
                  if (previewImagePath) {
                    const image = require('../assets/' + previewImagePath + '.png')
                    return  <NavLink key={i} to={path}>
                              <div className="creative-coding-project">
                                {title}
                                <img src={image} alt={title}/>
                              </div>
                            </NavLink>
                  }
                  return <NavLink key={i} to={path}>{title}</NavLink>
                })
              }
            </div>
          </div> : null}
        <Outlet />
      </div>
    </div>
  )
}

export default CreativeCoding