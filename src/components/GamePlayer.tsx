import Screen from '@/components/Screen';
import GameUploadForm from '@/components/GameUploadForm';
import PlayButton from './PlayButton';

const GamePlayer = () => {
  return (
    <main>
      <h1>Chip-8 Emulator</h1>
      <div className='screen-container'>
        <Screen />
      </div>
      <div className='info-btns-container'>
        <div className='key-info-container'>
          <h2>Keys</h2>
          <p>Chip-8 accepts keys from 0 to 9 and A to F</p>
          <p>To make this more convenient, they are mapped to be</p>
          <p>1 2 3 4</p>
          <p>q w e r</p>
          <p>a s d f</p>
          <p>z x c v</p>
        </div>
        <div className='btns-container'>
          <GameUploadForm />
          <PlayButton />
        </div>
      </div>
    </main>
  );
};

export default GamePlayer;