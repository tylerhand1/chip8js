import { Chip8 } from '@/lib/chip8';
import React from 'react';

const chip8 = new Chip8();

const App = () => {
  const handleUpload = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const gameFile = e.currentTarget.files[0];
      chip8.loadGame(gameFile);
    }
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
    </>
  );
};

export default App;