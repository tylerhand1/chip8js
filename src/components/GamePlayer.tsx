import GameUploadForm from '@/components/GameUploadForm';
import PlayButton from './PlayButton';
import Screen from '@/components/Screen';

const GamePlayer = () => {
  return (
    <>
      <GameUploadForm />
      <PlayButton />
      <div className='screen-container'>
        <Screen />
      </div>
    </>
  );
};

export default GamePlayer;