export class Chip8 {
  public graphics: boolean[][];
  public keys: boolean[];

  private pc: number;
  private opcode: number;
  private memory: number[];
  private V: string[];
  private I: number;
  private stack: string[];
  private sp: number;
  private lastExecTime: Date | undefined;

  constructor() {
    this.graphics = [];
    this.keys = [];
    
    this.pc = 0x200;
    this.opcode = 0;
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
      this.memory[i] = 0;
    }
  }

  /**
   * loadGameIntoMemory
   */
  public async loadGameIntoMemory(buffer: Uint8Array): Promise<boolean> {
    const promise = new Promise<boolean>((resolve) => {
      for (let i = 0; i < buffer.length; i++) {
        this.memory[i + 0x200] = buffer[i];
      }
      resolve(true);
    });

    return promise;
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
    this.opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
  }
}