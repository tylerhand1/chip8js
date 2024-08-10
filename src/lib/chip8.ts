export class Chip8 {
  private graphics: number[][];
  private key: number | undefined;
  private pc: number;
  private opcode: number;
  private memory: number[];
  private V: number[];
  private I: number;
  private stack: number[];
  private sp: number;
  private drawFlag: boolean;
  private delayTimer: number | undefined;
  private soundTimer: number | undefined;
  private error: boolean;

  constructor() {
    this.graphics = [];
    
    this.pc = 0x200;
    this.opcode = 0;
    this.memory = [];
    this.V = [];
    this.I = 0;
    this.stack = [];
    this.sp = 0;
    this.drawFlag = false;

    this.error = false;

    this.initialize();
  }

  /**
   * getGraphics
   */
  public getGraphics(): number[][] {
    return this.graphics;
  }

  /**
   * setKey
   */
  public setKey(key: number): void {
    this.key = key;
  }

  /**
   * getKey
   */
  public getKey(): number | undefined {
    return this.key;
  }

  /**
   * getDrawFlag
   */
  public getDrawFlag(): boolean {
    return this.drawFlag;
  }

  /**
   * getError
   */
  public getError(): boolean {
    return this.error;
  }

  /**
   * initialize
   */
  public initialize(): void {
    this.graphics = Array.from(Array(64), () => Array(32).fill(0) as number[]);
    
    this.pc = 0x200;
    this.opcode = 0;
    this.memory = [];
    this.V = [];
    this.I = 0;
    this.stack = [];
    this.sp = 0;
    this.drawFlag = false;
    this.error = false;

    for (let i = 0; i < 16; i++) {
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
      this.initialize();
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

  private handleOpcode(): void {
    switch (this.opcode & 0xF000) {
      case 0x0000: {
        switch (this.opcode & 0x00FF) {
          case 0x00E0:
            this.graphics = Array.from(Array(64), () => Array(32).fill(0) as number[]);
            this.drawFlag = true;
            this.pc += 2;
            break;
          case 0x00EE:
            this.sp--;
            this.pc = this.stack[this.sp];
            this.pc += 2;
            break;
          default:
            console.error('Unrecognized opcode');
            this.error = true;
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
        if (this.V[(this.opcode & 0x0F00) >> 8] === (this.opcode & 0x00FF))
          this.pc += 4;
        else
          this.pc += 2;
        break;
      }
      case 0x4000: {
        if (this.V[(this.opcode & 0x0F00) >> 8] !== (this.opcode & 0x00FF))
          this.pc += 4;
        else
          this.pc += 2;
        break;
      }
      case 0x5000: {
        if (this.V[(this.opcode & 0x0F00) >> 8] === this.V[(this.opcode & 0x00F0) >> 4])
          this.pc += 4;
        else
          this.pc += 2;
        break;
      }
      case 0x6000: {
        this.V[(this.opcode & 0x0F00) >> 8] = this.opcode & 0x00FF;
        this.pc += 2;
        break;
      }
      case 0x7000: {
        this.V[(this.opcode & 0x0F00) >> 8] += this.opcode & 0x00FF;
        this.pc += 2;
        break;
      }
      case 0x8000: {
        switch (this.opcode & 0x000F) {
          case 0x0000: {
            this.V[(this.opcode & 0x0F00) >> 8] = this.V[(this.opcode & 0x00F0) >> 4];
            this.pc += 2;
            break;
          }
          case 0x0001: {
            this.V[(this.opcode & 0x0F00) >> 8] |= this.V[(this.opcode & 0x00F0) >> 4];
            this.pc += 2;
            break;
          }
          case 0x0002: {
            this.V[(this.opcode & 0x0F00) >> 8] &= this.V[(this.opcode & 0x00F0) >> 4];
            this.pc += 2;
            break;
          }
          case 0x0003: {
            this.V[(this.opcode & 0x0F00) >> 8] ^= this.V[(this.opcode & 0x00F0) >> 4];
            this.pc += 2;
            break;
          }
          case 0x0004: {
            if ((this.V[(this.opcode & 0x00F0)] >> 4 ) > (0xFF - this.V[(this.opcode & 0x0F00) >> 8]))
              this.V[0xF] = 1;
            else
              this.V[0xF] = 0;
            this.V[(this.opcode & 0x0F00) >> 8] += this.V[(this.opcode & 0x00F0) >> 4]; 
            this.pc += 2;
            break;
          }
          case 0x0005: {
            if (this.V[(this.opcode & 0x00F0) >> 4] >= this.V[(this.opcode & 0x0F00) >> 8])
              this.V[0xF] = 1;
            else
              this.V[0xF] = 0;
            this.V[(this.opcode & 0x0F00) >> 8] -= this.V[(this.opcode & 0x00F0) >> 4];
            this.pc += 2;
            break;
          }
          case 0x0006: {
            const leastSigBit = this.V[(this.opcode & 0x0F00) >> 8] & 0b00000001;
            this.V[0xF] = leastSigBit;
            this.V[(this.opcode & 0x0F00) >> 8] >>= 1;
            this.pc += 2;
            break;
          }
          case 0x0007: {
            if (this.V[(this.opcode & 0x00F0) >> 4] > this.V[(this.opcode & 0x0F00) >> 8])
              this.V[0xF] = 1;
            else
              this.V[0xF] = 0;
            this.V[(this.opcode & 0x00F0) >> 4] -= this.V[(this.opcode & 0x0F00) >> 8];
            this.pc += 2;
            break;
          }
          case 0x000E: {
            const mostSigBit = (this.V[(this.opcode & 0x0F00) >> 8] & 0b10000000) >> 7;
            this.V[0xF] = mostSigBit;
            this.V[(this.opcode & 0x0F00) >> 8] <<= 1;
            this.pc += 2;
            break;
          }
          default:
            console.error('Unrecognized opcode');
            this.error = true;
        }
        break;
      }
      case 0x9000: {
        if (this.V[(this.opcode & 0x0F00) >> 8] !== this.V[(this.opcode & 0x00F0) >> 4])
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
        this.V[(this.opcode & 0x0F00) >> 8] = (this.generateRandomNumber()) & (this.opcode & 0x00FF);
        this.pc += 2;
        break;
      }
      case 0xD000: {
        const x: number = this.V[(this.opcode & 0x0F00) >> 8] >> 8;
        const y: number = this.V[(this.opcode & 0x00F0) >> 4] >> 8;
        const height = this.opcode & 0x000F;
        let pixel: number;

        for (let yLine = 0; yLine < height; yLine++) {
          pixel = this.memory[this.I + yLine];
          for (let xLine = 0; xLine < 8; xLine++) {
            if ((pixel & (0x80 >> xLine)) !== 0) {
              if (this.graphics[xLine + x][yLine + y] === 1) {
                this.V[0xF] = 1;
              }
              this.graphics[xLine + x][yLine + y] ^= 1;
            }
          }
        }

        this.drawFlag = true;
        this.pc += 2;
        break;
      }
      case 0xE000: {
        switch (this.opcode & 0x00FF)
        {
          case 0x009E: {
            if (this.key === this.V[(this.opcode & 0x0F00) >> 8])
              this.pc += 4;
            else
              this.pc += 2;
            break;
          }
          case 0x00A1: {
            if (this.key !== this.V[(this.opcode & 0x0F00) >> 8])
              this.pc += 4;
            else
              this.pc += 2;
            break;
          }
          default:
            console.error('Unrecognized opcode');
            this.error = true;
        }
        break;
      }
      case 0xF000: {
        switch (this.opcode & 0x00FF)
        {
          case 0x0007: {
            if (this.delayTimer)
              this.V[(this.opcode & 0x0F00) >> 8] = this.delayTimer;
            this.pc += 2;
            break;
          }
          case 0x000A: {
            if (this.key === this.V[(this.opcode & 0x0F00) >> 8])
              this.pc += 2;
            break;
          }
          case 0x0015: {
            this.delayTimer = this.V[(this.opcode & 0x0F00) >> 8];
            this.pc += 2;
            break;
          }
          case 0x0018: {
            this.soundTimer = this.V[(this.opcode & 0x0F00) >> 8];
            this.pc += 2;
            break;
          }
          case 0x001E: {
            this.I += this.V[(this.opcode & 0x0F00) >> 8];
            this.pc += 2;
            break;
          }
          case 0x0029: {
            this.I = this.V[(this.opcode & 0x0F00) >> 8];
            this.pc += 2;
            break;
          }
          case 0x0033: {
            this.memory[this.I] = this.V[(this.opcode & 0x0F00) >> 8] / 100;
            this.memory[this.I + 1] = (this.V[(this.opcode & 0x0F00) >> 8] / 10) % 10;
            this.memory[this.I + 2] = (this.V[(this.opcode & 0x0F00) >> 8] % 100) % 10;
            this.pc += 2;
            break;
          }
          case 0x0055: {
            for (let i = 0; i < (this.opcode & 0x0F00) >> 8; i++) {
              this.memory[i + this.I] = this.V[i];
            }
            this.pc += 2;
            break;
          }
          case 0x0065: {
            for (let i = 0; i < (this.opcode & 0x0F00) >> 8; i++) {
              this.V[i] = this.memory[i + this.I];
            }
            this.pc += 2;
            break;
          }
          default:
            console.error('Unrecognized opcode');
            this.error = true;
        }
        break;
      }
      default:
        console.error('Unrecognized opcode');
        this.error = true;
    }
  }

  private handleTimers(): void {
    if (this.delayTimer && this.delayTimer > 0)
      this.delayTimer--;

    if (this.soundTimer && this.soundTimer > 0) {
      if (this.soundTimer === 1)
        console.log('Play sound');
      this.soundTimer--;
    }
  }

  /**
   * emulateCycle
   */
  public emulateCycle(): void {
    this.opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];
    this.handleOpcode();

    this.handleTimers();
  }
}