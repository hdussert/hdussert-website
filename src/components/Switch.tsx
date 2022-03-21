import PropTypes, { InferProps } from 'prop-types';

const SwitchPropTypes = {
  onClick: PropTypes.func.isRequired
}

type SwitchTypes = InferProps<typeof SwitchPropTypes>;

const Switch = ({ onClick } : SwitchTypes) => {
  return (
    <label className='switch'>
      <input type='checkbox'  onClick={onClick}/>
      <div></div>
    </label>
  )
}

Switch.propTypes = SwitchPropTypes;

export default Switch