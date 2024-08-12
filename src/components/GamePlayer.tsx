import Screen from '@/components/Screen';
import GameUploadForm from '@/components/GameUploadForm';
import PlayButton from './PlayButton';

const GamePlayer = () => {
  return (
    <>
      <div className='screen-container'>
        <Screen />
      </div>
      <GameUploadForm />
      <PlayButton />
    </>
  );
};

export default GamePlayer;