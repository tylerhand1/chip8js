import { useContext } from 'react';
import { EmulatorContext } from '@/context/emulatorContext';

const PlayButton = () => {
  const emulator = useContext(EmulatorContext);

  const handlePlay = () => {
    if (emulator.getStop())
      emulator.play();
  };
  
  return (
    <button onClick={handlePlay}>Play</button>
  );
};

export default PlayButton;