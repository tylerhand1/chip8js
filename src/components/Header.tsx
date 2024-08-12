import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <ul>
        <Link to='/'>
          Game
        </Link>
        <Link to='/about'>
          About
        </Link>
      </ul>
    </header>
  );
};

export default Header;