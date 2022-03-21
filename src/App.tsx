import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Navbar from './components/Navbar';
import Switch from './components/Switch';
import Home from './pages/Home';
import './sass/App.scss';
import { HummingBird } from './svgs';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar
          title='Hugo Dussert'
          icon={HummingBird}
          links={[
            {to: '/', title: 'Home'},
            {to: '/page1', title: 'Page 1'},
            {to: '/page2', title: 'Page 2'},
          ]}
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
          timeout={500}
        >
          <Routes location={location}>
            <Route path='/' element={<Home/>} />
            <Route path='/page1' element={<div>P1</div>} />
            <Route path='/page2' element={<div>P2</div>} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
}

export default App;
