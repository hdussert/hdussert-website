const ProfilePic = require('../assets/hdussert_small.JPG');

const Home = () : JSX.Element => {
  return (
      <div className='fill home'>
        <div className='home-container'>
          <img src={ProfilePic} alt='Profile Pic'/>
          <div className='home-text'>
            <h1>Hugo Dussert</h1>
            <p>Je suis <b>développeur</b>, passioné par le web et les jeux vidéos.
            Amateur de rap et de vidéos de Birbs.</p>
          </div>
        </div>
      </div>
  )
};

export default Home