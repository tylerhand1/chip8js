import { EmulatorContext } from '@/context/emulatorContext';
import { useContext } from 'react';
import Screen from '@/components/Screen';

const Game = () => {
  const emulator = useContext(EmulatorContext);

  const handleUpload = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      emulator.reset();
      emulator.setStop(true);
      const gameFile = e.currentTarget.files[0];
      emulator.readGame(gameFile);
    }
  };

  const handlePlay = () => {
    emulator.setStop(false);
    emulator.play();
  };
  return (
    <>
      <label htmlFor="game-file">Select a ROM file</label>
      <input
        type="file"
        name="game-file"
        id="game-file"
        accept='.rom,.chip8,.c8,.ch8'
        onChange={handleUpload}
      />
      <button onClick={handlePlay}>Play</button>
      <div className='screen-container'>
        <Screen />
      </div>
    </>
    
  );
};

export default Game;