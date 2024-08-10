import React from 'react';
import { Emulator } from '@/lib/emulator';
import Screen from '@/components/Screen';
import '@/styles/index.css';

const App = () => {
  const emulator = new Emulator();

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
      <main>
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
      </main>
      
    </>
  );
};

export default App;