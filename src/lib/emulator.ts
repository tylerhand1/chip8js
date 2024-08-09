import { Chip8 } from '@/lib/chip8';

export class Emulator {
  private chip8;

  public isLoaded: boolean;

  constructor() {
    this.chip8 = new Chip8();
    this.isLoaded = false;
  }

  /**
   * readGame
   */
  public readGame(gameFile: File): void {
    this.chip8.initialize();
    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const result = new Uint8Array(fileReader.result as ArrayBuffer);
      
      this.isLoaded = await this.chip8.loadGameIntoMemory(result);
    };

    fileReader.onerror = () => {
      console.error('Error: Unable to read file');
    };

    fileReader.readAsArrayBuffer(gameFile);
  }

  public play(): void {
    if (this.isLoaded) {
      for(;;) {
        const currTime = new Date().getTime();
        if (this.chip8.getLastExecTime()) {
          const lastExecTime = this.chip8.getLastExecTime();
          if (lastExecTime && currTime < (lastExecTime + ((1 / 60.0) * 1000))) {
            continue;
          }
        }
        this.chip8.emulateCycle();

        if (this.chip8.getError())
          break;
      }
    }
      
    else
      console.log('Memory not loaded yet');
  }
}