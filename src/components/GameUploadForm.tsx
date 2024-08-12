import { useContext } from 'react';
import { EmulatorContext } from '@/context/emulatorContext';

const GameUploadForm = () => {
  const emulator = useContext(EmulatorContext);
  const handleUpload = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      emulator.reset();
      const gameFile = e.currentTarget.files[0];
      emulator.readGame(gameFile);
    }
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
    </>
  );
};

export default GameUploadForm;