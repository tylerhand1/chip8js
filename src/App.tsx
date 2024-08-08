import React from 'react';
import { Emulator } from '@/lib/emulator';

const App = () => {
  const emulator = new Emulator();

  const handleUpload = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const gameFile = e.currentTarget.files[0];
      emulator.readGame(gameFile);
    }
  };

  const handlePlay = () => {
    emulator.play();
  };
  
  return (
    <>
      <label htmlFor="game-file">Select a ROM file</label>
      <input
        type="file"
        name="game-file"
        id="game-file"
        accept='.rom'
        onChange={handleUpload}
      />
      <button onClick={handlePlay}>Play</button>
    </>
  );
};

export default App;