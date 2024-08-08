export class Chip8 {
  public graphics: boolean[][];
  public keys: boolean[];

  private pc: number;
  private opcode: number;
  private memory: number[];
  private V: number[];
  private I: number;
  private stack: number[];
  private sp: number;
  private drawFlag: boolean;
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
    this.drawFlag = false;

    for (let i = 0; i < 64; i++) {
      this.graphics[i] = [];
      for (let j = 0; j < 32; j++) {
        this.graphics[i][j] = false;
      }
    }

    for (let i = 0; i < 16; i++) {
      this.keys[i] = false;
      this.V[i] = 0;
      this.stack[i] = 0;
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

    console.log(this.opcode.toString(16));

    switch (this.opcode & 0xF000) {
      case 0x0000: {
        switch (this.opcode & 0x00FF) {
          case 0x00E0:
            console.log('Clear display');
            this.drawFlag = true;
            break;
          case 0x00EE:
            this.sp--;
            this.pc = this.sp;
            this.pc += 2;
            break;
          default:
            console.error('Unrecognized opcode');
        }
        break;
      }
      case 0x1000: {
        this.pc = this.opcode & 0x0FFF;
        break;
      }
      case 0x2000: {
        this.stack[this.sp] = this.pc;
        this.sp++;
        this.pc = this.opcode & 0x0FFF;
        break;
      }
      case 0x3000: {
        if (this.V[(this.opcode & 0x0F00) >> 8] == (this.opcode & 0x00FF))
          this.pc += 4;
        else
          this.pc += 2;
        break;
      }
      case 0x4000: {
        if (this.V[(this.opcode & 0x0F00) >> 8] != (this.opcode & 0x00FF))
          this.pc += 4;
        else
          this.pc += 2;
        break;
      }
      case 0x5000: {
        if (this.V[(this.opcode & 0x0F00) >> 8] == this.V[(this.opcode & 0x00F0) >> 4])
          this.pc += 4;
        else
          this.pc += 2;
        break;
      }
      case 0x6000: {
        this.V[(this.opcode & 0x0F00) >> 8] = this.opcode & 0x0FFF;
        this.pc += 2;
        break;
      }
      case 0x7000: {
        this.V[(this.opcode & 0x0F00) >> 8] += this.opcode & 0x00FF;
        this.pc += 2;
        break;
      }
      case 0x8000: {
        break;
      }
      case 0x9000: {
        if (this.V[(this.opcode & 0x0F00) >> 8] != this.V[(this.opcode & 0x00F0) >> 4])
          this.pc += 4;
        else
          this.pc += 2;
        break;
      }
      case 0xA000: {
        this.I = this.opcode & 0x0FFF;
        this.pc += 2;
        break;
      }
      case 0xB000: {
        this.pc = this.opcode & 0x0FFF + this.V[0];
        break;
      }
      case 0xC000: {
        this.V[(this.opcode & 0x0F00) >> 8] = this.generateRandomNumber();
        this.pc += 2;
        break;
      }
      case 0xD000: {
        this.drawFlag = true;
        break;
      }
      case 0xE000: {
        break;
      }
      case 0xF000: {
        break;
      }
      default:
        console.error('Unrecognized opcode');
    }
  }
}