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
      <GameUploadForm />
      <PlayButton />
    </main>
  );
};

export default GamePlayer;