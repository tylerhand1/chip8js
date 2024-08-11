import { Chip8 } from '@/lib/chip8';

export class Emulator {
  private chip8;
  private stop;

  public isLoaded: boolean;

  private intervalID: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    this.chip8 = new Chip8();
    this.stop = true;

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

  /**
   * setStop
   */
  public setStop(stop: boolean): void {
    this.stop = stop;
  }

  /**
   * reset
   */
  public reset(): void {
    this.chip8.initialize();
  }

  /**
   * play
   */
  public play(): void {
    if (!this.isLoaded) {
      console.log('Memory not loaded yet');
      return;
    }

    window.requestAnimationFrame(() => { this.gameLoop(); });
  }

  private gameLoop(): void {
    if (this.chip8.getError() || !this.isLoaded || this.stop) {
      clearInterval(this.intervalID);
      return;
    }

    this.chip8.emulateCycle();

    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < 64; j++) {
        const pixel = document.getElementById((i * 64 + j).toString());
        if (pixel) {
          if (this.chip8.getGraphics()[j][i] === 1) {
            pixel.classList.add('filled');
          }
          else {
            pixel.classList.remove('filled');
          }
        }
      }
    }
    
    window.requestAnimationFrame(() => { this.gameLoop(); });
  }
}