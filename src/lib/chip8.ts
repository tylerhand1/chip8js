export class Chip8 {
  public graphics: boolean[][];
  public keys: boolean[];

  private opcode: number;
  private memory: string[];
  private V: string[];
  private I: number;
  private stack: string[];
  private sp: number;
  private lastExecTime: Date | undefined;

  constructor() {
    this.graphics = [];
    this.keys = [];
    
    this.opcode = 0x200;
    this.memory = [];
    this.V = [];
    this.I = 0;
    this.stack = [];
    this.sp = 0;

    for (let i = 0; i < 64; i++) {
      this.graphics[i] = [];
      for (let j = 0; j < 32; j++) {
        this.graphics[i][j] = false;
      }
    }

    for (let i = 0; i < 16; i++) {
      this.keys[i] = false;
      this.V[i] = '0';
      this.stack[i] = '0';
    }

    for (let i = 0; i < 4096; i++) {
      this.memory[i] = '0';
    }
  }

  private generateRandomNumber(): number {
    const min = Math.ceil(0);
    const max = Math.floor(0xFF);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * emulateCycle
   */
  public emulateCycle(): void {
    console.log('Emulate cycle');
  }

  /**
   * loadGame
   */
  public loadGame(gameFile: File): void {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      const result = new Uint8Array(fileReader.result as ArrayBuffer);

      for (let i = 0; i < result.length; i++) {
        this.memory[i + 0x200] = result[i].toString(16).padStart(2, '0');
      }
    };

    fileReader.onerror = () => {
      console.error('Error: Unable to read file');
    };

    fileReader.readAsArrayBuffer(gameFile);
  }
}