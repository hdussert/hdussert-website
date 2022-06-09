import './sass/App.scss';
import { BrowserRouter as Router, Routes, Route, useLocation, HashRouter } from 'react-router-dom';
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
import QuadTreeDemo from './components/creative-coding/QuadTreeDemo';
import ClassicParticleSystem from './components/creative-coding/ClassicParticleSystem';
import Dalma from './components/creative-coding/Dalma';
import FractalTree from './components/creative-coding/FractalTree';
import Flow from './components/creative-coding/Flow';


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
  { 
    path: '/creative-coding/matrix', 
    title: 'Matrix', 
    Component: MatrixRain, 
    description: ['150 strings of random characters falling down.',
                  'Their opacity and speed are based on their font size to simulate depth of field.'], 
    ressources: [], 
    previewImagePath: 'Matrix'
  },
  { 
    path: '/creative-coding/phyllotaxis', title: 'Phyllotaxis', Component: Phyllotaxis, 
    description: ['Phyllotaxy is the arrangement of leaves on a plant stem. A lot of plants grow pairs of leaves, successively rotated 90 degrees around the stem.',
                  'Some will grow leaf per leaf and create distinctive patterns. Exemples: 120 (hazel), 144 (oak), 135 (sunflowers), 138.46 (almond).',
                  'My favourite natural pattern, the Sunflower\'s seeds. Rotating at the golden angle (137.508 degree).',
                  'You can play around by twiking the angle. This angle represent the rotation between each new leaf around the stem.',
                  'The other parameters are here for fun, so you can create awesome patterns.'], 
    ressources: [], 
    previewImagePath: 'Phyllotaxis'},
  { 
    path: '/creative-coding/particles', 
    title: 'Particles Collision', 
    Component: Particles, 
    description: ['My first attempt at resolving circles collision in a 2D environment. Each circle has a mass based on it size.',
                  'Doing so, I also programed my first QuadTree which allows me to handle a lot of particles interacting with each other. You can see how it works on my QuadTree project page.'],
    ressources: [], 
    previewImagePath: 'CollidingParticles'
  },
  { 
    path: '/creative-coding/quadtree', 
    title: 'QuadTree', 
    Component: QuadTreeDemo, 
    description: ['A Quadtree is a tree data structure, mostly used to partition 2D spaces. A node of this tree is basicaly a rectangle with a list of elements inside and a "capacity" (maximum number of elements it can contain)',
                  'When building a Quadtree, we start with one node taking the entire space and insert our elements inside of it. Exceeding its capacity, the node divides itself into 4 nodes and distribute new elements inside of them. These nodes follow the same behaviour.',
                  'When searching which elements are in an given area we run through the tree, ignoring nodes not intersecting/contained by the given area. The search is very efficient.',], 
    ressources: [], 
    previewImagePath: 'QuadTree'
  },
  { 
    path: '/creative-coding/classic-particle-system', 
    title: 'Classic Particle System', 
    Component: ClassicParticleSystem, 
    description: [], 
    ressources: [], 
    previewImagePath: 'ClassicParticleSystem'
  },
  { 
    path: '/creative-coding/fractal-tree', 
    title: 'Fractal tree', 
    Component: FractalTree, 
    description: [], 
    ressources: [], 
    previewImagePath: 'FractalTree'
  },
  { 
    path: '/creative-coding/dalma', 
    title: 'Dalma', 
    Component: Dalma, 
    description: [], 
    ressources: [], 
    previewImagePath: 'Dalma'
  },
  { 
    path: '/creative-coding/flow', 
    title: 'Flow', 
    Component: Flow, 
    description: [], 
    ressources: [], 
    previewImagePath: 'ClassicParticleSystem'
  },
];

function App() {
  return (
    <div className="App">
      <HashRouter>
      {/* {process.env.PUBLIC_URL}> */}
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
      </HashRouter>
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
          timeout={1500}
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
