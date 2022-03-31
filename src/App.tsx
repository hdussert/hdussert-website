import './sass/App.scss';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { HummingBird } from './assets/svgs';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Resume from './pages/Resume';
import React from 'react';
import CreativeCoding from './pages/CreativeCoding';
import CreativeProject from './components/creative-coding/CreativeProject';
import MatrixRain from './components/creative-coding/MatrixRain';
import Phyllotaxis from './components/creative-coding/Phyllotaxis';
import Particles from './components/creative-coding/CollidingParticles';


export interface AppRoute {
  path: string;
  Component: React.ComponentType;
  title: string;
}

const appRoutes: AppRoute[] = [
  { path: '/', title: 'Accueil', Component: Home },
  { path: '/resume', title: 'Curriculum', Component: Resume },
  { path: '/creative-coding', title: 'Creative Coding', Component: CreativeCoding },
];

export interface ProjectRoute {
  path: string;
  Component: React.ComponentType;
  title: string;
  description: string[]
  ressources: string[]
  previewImagePath: string
}

const creativeCodingRoutes: ProjectRoute[] = [
  { path: '/creative-coding/matrix', title: 'Matrix', Component: MatrixRain, 
    description: ['150 strings of random characters falling down.',
                  'Their opacity and speed are based on their font size to simulate depth of field.'], 
    ressources: [], previewImagePath: 'Matrix'},
  { path: '/creative-coding/phyllotaxis', title: 'Phyllotaxis', Component: Phyllotaxis, 
    description: ['Phyllotaxy is the arrangement of leaves on a plant stem. A lot of plants grow pairs of leaves, successively rotated 90 degrees around the stem.',
                  'Some will grow leaf per leaf and create distinctive patterns. Exemples: 120 (hazel), 144 (oak), 135 (sunflowers), 138.46 (almond).',
                  'My favourite natural pattern, the Sunflower\'s seeds. Rotating at the golden angle (137.508 degree).',
                  'You can play around by twiking the angle. This angle represent the rotation between each new leaf around the stem.',
                  'The other parameters are here for fun, so you can create awesome patterns.'], 
    ressources: [], previewImagePath: 'Phyllotaxis'},
  { path: '/creative-coding/particles', title: 'Particles Collision', Component: Particles, 
    description: ['My first attempt at resolving circles collision in a 2D environment. Each circle has a mass based on it size.',
                  'Doing so, I also programed my first QuadTree which allows me to handle a lot of particles interacting with each other. You can see how it works on my QuadTree project page.'], ressources: [], previewImagePath: 'CollidingParticles'},
];

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar
          title='Hugo Dussert'
          icon={HummingBird}
          links={appRoutes.map(({ path, title }) => { 
            return {
              to: path,
              title: title
            }
          })}
        />
        <AppPages />
      </Router>
    </div>
  );
}

const AppPages = () => {
  let location = useLocation();
  return (
    <div className="App-pages">
      <TransitionGroup>
        <CSSTransition
          key={location.pathname}
          classNames='fade'
          timeout={1000}
        >
          <Routes location={location}>
            {
              appRoutes.map(({path, Component}, i) => {
                if (path === '/creative-coding') {
                  return (<Route key={i} path={path} element={<CreativeCoding routes={creativeCodingRoutes}/>}>
                  {
                    creativeCodingRoutes.map((r, i : number) => 
                    <Route 
                      key={i}
                      path={r.path} 
                      element={<CreativeProject 
                                  title={r.title} 
                                  description={r.description}
                                  ressources={r.ressources}
                                  children={<r.Component/>} 
                                />}
                    />)
                  }
                  </Route>)
                }
                
                return <Route key={i} path={path} element={<Component/>} />
              })
            }
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

export default App;
