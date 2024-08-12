import '@/styles/index.css';
import GamePlayer from '@/components/GamePlayer';

const App = () => {
  
  return (
    <>
      <header>
        <ul>
          <li>
            Game
          </li>
          <li>
            About
          </li>
        </ul>
      </header>
      <main>
        <GamePlayer />
      </main>
    </>
  );
};

export default App;