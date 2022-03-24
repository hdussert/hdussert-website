import { NavLink, Outlet } from 'react-router-dom'
import PropTypes, { InferProps, shape, string } from 'prop-types';

const FunPropTypes = {
  routes: PropTypes.arrayOf(PropTypes.exact({
    path: PropTypes.string.isRequired,
    title: PropTypes.string,
    Component: PropTypes.elementType
  }).isRequired)
}

type FunTypes = InferProps<typeof FunPropTypes>;

const Fun = ({ routes }: FunTypes) => {
  return (
    <div className='fill fun'>
      <div className='fun-container'>
        <div className='fun-navbar'>
        { routes?.map(({ path, title }, i : number) => <NavLink key={i} to={path}>{title}</NavLink>) }
        </div>
        <div className='fun-content'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Fun