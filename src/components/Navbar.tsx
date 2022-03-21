import PropTypes, { InferProps } from 'prop-types';

import { useRef } from "react";
import { NavLink } from "react-router-dom"
import { Burger } from "../svgs"
import Switch from "./Switch";

const NavbarPropTypes = {
  icon: PropTypes.element,
  title: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }))
}

type NavbarTypes = InferProps<typeof NavbarPropTypes>;

const Navbar = ({ icon, title, links } : NavbarTypes) => {
  
  const menuToggler = useRef<HTMLInputElement>(null);
  const closeMenu = () => {
  if (menuToggler.current) menuToggler.current.checked = false
  }

  const changeTheme = () => {
    const root = document.getElementById('root');
    const currentTheme = root?.getAttribute('data-theme');
    root?.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
  }

  return (
    <div className='navbar'>
      <div className='navbar-container'>
        <input id='navbar-toggle' type="checkbox" ref={menuToggler}/>
        <div className='navbar-title'>
          <NavLink to='/'>{icon ? icon : null}{title}</NavLink>
        </div>
        <div className='navbar-menu'>
          {links?.map((link: any, i: number) => 
            <NavLink 
              key={i}
              to={link.to}
              className={({ isActive }) =>  'navlink' + (isActive ? ' active' : '')}
              onClick={closeMenu}
            >
              {link.title}
            </NavLink>)}
        </div>
        <Switch onClick={changeTheme}/>
        <label className='navbar-button' htmlFor='navbar-toggle'>
          {Burger}
        </label>
      </div>
    </div>
  )
}

Navbar.propTypes = NavbarPropTypes;

export default Navbar