import './sass/App.scss';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { HummingBird } from './assets/svgs';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Resume from './pages/Resume';
import React from 'react';
import CreativeCoding from './pages/CreativeCoding';
import MatrixRain from './components/creative-coding/MatrixRain';
import Phyllotaxis from './components/creative-coding/Phyllotaxis';
import Particles from './components/creative-coding/Particles';


export interface AppRoute {
  path: string;
  title: string;
  Component: React.ComponentType;
}

const appRoutes: AppRoute[] = [
  { path: '/', title: 'Accueil', Component: Home },
  { path: '/resume', title: 'Curriculum', Component: Resume },
  { path: '/creative-coding', title: 'Creative Coding', Component: CreativeCoding },
];

const creativeCodingRoutes: AppRoute[] = [
  { path: '/creative-coding/matrix', title: 'Matrix', Component: MatrixRain },
  { path: '/creative-coding/phyllotaxis', title: 'Phyllotaxis', Component: Phyllotaxis },
  { path: '/creative-coding/particles', title: 'Particles Collision', Component: Particles },
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
                    creativeCodingRoutes.map(({path, Component}, i : number) => 
                    <Route key={i} path={path} element={<Component/>} />)
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
