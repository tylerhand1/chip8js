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
          case 0x00E0: // 0x00E0: clears the screen
            this.graphics = Array.from(Array(64), () => Array(32).fill(0) as number[]);
            this.drawFlag = true;
            this.pc += 2;
            break;
          case 0x00EE: // 0x00EE: Returns from subroutine
            this.sp--;
            this.pc = this.stack[this.sp];
            this.pc += 2;
            break;
          default:
            console.error('Unrecognized opcode', this.opcode.toString(16).padStart(4, '0'));
            this.error = true;
        }
        break;
      }
      case 0x1000: { // 0x1NNN: Set the program counter to NNN
        this.pc = this.opcode & 0x0FFF;
        break;
      }
      case 0x2000: { // 0x2NNN: Call subroutine at address NNN
        this.stack[this.sp] = this.pc;
        this.sp++;
        this.pc = this.opcode & 0x0FFF;
        break;
      }
      case 0x3000: { // 0x3xkk: Skip next instruction if Vx = kk
        if (this.V[(this.opcode & 0x0F00) >> 8] === (this.opcode & 0x00FF))
          this.pc += 4;
        else
          this.pc += 2;
        break;
      }
      case 0x4000: { // 0x4xkk: Skip next instruction if Vx != kk
        if (this.V[(this.opcode & 0x0F00) >> 8] !== (this.opcode & 0x00FF))
          this.pc += 4;
        else
          this.pc += 2;
        break;
      }
      case 0x5000: { // 0x5xy0: Skip next instruction if Vx = Vy
        if (this.V[(this.opcode & 0x0F00) >> 8] === this.V[(this.opcode & 0x00F0) >> 4])
          this.pc += 4;
        else
          this.pc += 2;
        break;
      }
      case 0x6000: { // 0x6xkk: Set Vx = kk
        this.V[(this.opcode & 0x0F00) >> 8] = this.opcode & 0x00FF;
        this.pc += 2;
        break;
      }
      case 0x7000: { // 0x7xkk: Set Vx = Vx + kk
        this.V[(this.opcode & 0x0F00) >> 8] += this.opcode & 0x00FF;
        if (this.V[(this.opcode & 0x0F00) >> 8] > 0xFF)
          this.V[(this.opcode & 0x0F00) >> 8] -= 0x100;
        this.pc += 2;
        break;
      }
      case 0x8000: {
        switch (this.opcode & 0x000F) {
          case 0x0000: { // 0x8xy0: Set Vx = Vy
            this.V[(this.opcode & 0x0F00) >> 8] = this.V[(this.opcode & 0x00F0) >> 4];
            this.pc += 2;
            break;
          }
          case 0x0001: { // 0x8xy1: Set Vx = Vx OR Vy
            this.V[(this.opcode & 0x0F00) >> 8] |= this.V[(this.opcode & 0x00F0) >> 4];
            this.pc += 2;
            break;
          }
          case 0x0002: { // 0x8xy2: Set Vx = Vx AND Vy
            this.V[(this.opcode & 0x0F00) >> 8] &= this.V[(this.opcode & 0x00F0) >> 4];
            this.pc += 2;
            break;
          }
          case 0x0003: { // 0x8xy3: Set Vx = Vx XOR Vy
            this.V[(this.opcode & 0x0F00) >> 8] ^= this.V[(this.opcode & 0x00F0) >> 4];
            this.pc += 2;
            break;
          }
          case 0x0004: { // 0x8xy4: Set Vx = Vx + Vy, set VF to carry
            this.V[0xF] = this.V[(this.opcode & 0x0F00) >> 8] + this.V[(this.opcode & 0x00F0) >> 4] > 0xFF ? 1 : 0;
            this.V[(this.opcode & 0x0F00) >> 8] += this.V[(this.opcode & 0x00F0) >> 4];
            if (this.V[(this.opcode & 0x0F00) >> 8] > 0xFF) // subtract 256 if carried over
              this.V[(this.opcode & 0x0F00) >> 8] -= 0x100;
            this.pc += 2;
            break;
          }
          case 0x0005: { // 0x8xy5: Set Vx = Vx - Vy, set VF to NOT borrow
            this.V[0xF] = this.V[(this.opcode & 0x0F00) >> 8] > this.V[(this.opcode & 0x00F0) >> 4] ? 1 : 0;
            this.V[(this.opcode & 0x0F00) >> 8] -= this.V[(this.opcode & 0x00F0) >> 4];
            if (this.V[(this.opcode & 0x0F00) >> 8] < 0) // add 256 if borrow
              this.V[(this.opcode & 0x0F00) >> 8] += 0x100;
            this.pc += 2;
            break;
          }
          case 0x0006: { // 0x8xy6: Set Vx = Vx SHR 1
            this.V[0xF] = this.V[(this.opcode & 0x0F00) >> 8] & 1;
            this.V[(this.opcode & 0x0F00) >> 8] >>= 1;
            this.pc += 2;
            break;
          }
          case 0x0007: { // 0x8xy7: Set Vx = Vy - Vx, set VF to NOT borrow
            this.V[0xF] = this.V[(this.opcode & 0x00F0) >> 4] > this.V[(this.opcode & 0x0F00) >> 8] ? 1 : 0;
            this.V[(this.opcode & 0x0F00) >> 8] = this.V[(this.opcode & 0x00F0) >> 4] - this.V[(this.opcode & 0x0F00) >> 8];
            if (this.V[(this.opcode & 0x0F00) >> 8] < 0) // add 256 if borrow
              this.V[(this.opcode & 0x0F00) >> 8] += 0x100;
            this.pc += 2;
            break;
          }
          case 0x000E: { // 0x8xyE: Set Vx = Vx SHL 1
            const mostSigBit = this.V[(this.opcode & 0x0F00) >> 8] >> 7;
            this.V[0xF] = mostSigBit;
            this.V[(this.opcode & 0x0F00) >> 8] <<= 1;
            if (this.V[(this.opcode & 0x0F00) >> 8] > 0xFF) // subtract 256 if carried over
              this.V[(this.opcode & 0x0F00) >> 8] -= 0x100;
            this.pc += 2;
            break;
          }
          default:
            console.error('Unrecognized opcode', this.opcode.toString(16).padStart(4, '0'));
            this.error = true;
        }
        break;
      }
      case 0x9000: { // 0x9xy0: Skip next instruction if Vx != Vy
        if (this.V[(this.opcode & 0x0F00) >> 8] !== this.V[(this.opcode & 0x00F0) >> 4])
          this.pc += 4;
        else
          this.pc += 2;
        break;
      }
      case 0xA000: { // 0xANNN: Sets I to the address NNN
        this.I = this.opcode & 0x0FFF;
        this.pc += 2;
        break;
      }
      case 0xB000: { // 0xBNNN: Jump to location NNN + V0
        this.pc = this.opcode & 0x0FFF + this.V[0];
        break;
      }
      case 0xC000: { // 0xCxkk: Set Vx = random byte AND kk.
        this.V[(this.opcode & 0x0F00) >> 8] = (this.generateRandomNumber()) & (this.opcode & 0x00FF);
        this.pc += 2;
        break;
      }
      case 0xD000: { // 0xDxyn: Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision
        const x: number = this.V[(this.opcode & 0x0F00) >> 8];
        const y: number = this.V[(this.opcode & 0x00F0) >> 4];
        const height = this.opcode & 0x000F;
        let pixel: number;

        this.V[0xF] = 0;

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
          case 0x009E: { // 0xEx9E: Skip next instruction if key with the value of Vx is pressed
            if (this.key === this.V[(this.opcode & 0x0F00) >> 8])
              this.pc += 4;
            else
              this.pc += 2;
            break;
          }
          case 0x00A1: { // 0xExA1: Skip next instruction if key with the value of Vx is not pressed
            if (this.key !== this.V[(this.opcode & 0x0F00) >> 8])
              this.pc += 4;
            else
              this.pc += 2;
            break;
          }
          default:
            console.error('Unrecognized opcode', this.opcode.toString(16).padStart(4, '0'));
            this.error = true;
        }
        break;
      }
      case 0xF000: {
        switch (this.opcode & 0x00FF)
        {
          case 0x0007: { // 0xFx07: Set Vx = delay timer value
            if (this.delayTimer)
              this.V[(this.opcode & 0x0F00) >> 8] = this.delayTimer;
            this.pc += 2;
            break;
          }
          case 0x000A: { // 0xFx0A: Wait for a key press, store the value of the key in Vx
            if (this.key === this.V[(this.opcode & 0x0F00) >> 8])
              this.pc += 2;
            break;
          }
          case 0x0015: { // 0xFx15: Set delay timer = Vx
            this.delayTimer = this.V[(this.opcode & 0x0F00) >> 8];
            this.pc += 2;
            break;
          }
          case 0x0018: { // 0xFx18: Set sound timer = Vx
            this.soundTimer = this.V[(this.opcode & 0x0F00) >> 8];
            this.pc += 2;
            break;
          }
          case 0x001E: { // 0xFx1E: Set I = I + Vx
            this.I += this.V[(this.opcode & 0x0F00) >> 8];
            this.pc += 2;
            break;
          }
          case 0x0029: { // 0xFx29: Set I = location of sprite for digit Vx
            this.I = this.V[(this.opcode & 0x0F00) >> 8];
            this.pc += 2;
            break;
          }
          case 0x0033: { // 0xFx33: Store BCD representation of Vx in memory locations I, I+1, and I+2
            this.memory[this.I] = Math.floor(this.V[(this.opcode & 0x0F00) >> 8] / 100);
            this.memory[this.I + 1] = Math.floor((this.V[(this.opcode & 0x0F00) >> 8] / 10) % 10);
            this.memory[this.I + 2] = Math.floor((this.V[(this.opcode & 0x0F00) >> 8] % 100) % 10);
            this.pc += 2;
            break;
          }
          case 0x0055: { // 0xFx55: Store registers V0 through Vx in memory starting at location I
            for (let i = 0; i <= (this.opcode & 0x0F00) >> 8; i++) {
              this.memory[i + this.I] = this.V[i];
            }
            this.pc += 2;
            break;
          }
          case 0x0065: { // 0xFx65: Read registers V0 through Vx from memory starting at location I
            for (let i = 0; i <= (this.opcode & 0x0F00) >> 8; i++) {
              this.V[i] = this.memory[i + this.I];
            }
            this.pc += 2;
            break;
          }
          default:
            console.error('Unrecognized opcode', this.opcode.toString(16).padStart(4, '0'));
            this.error = true;
        }
        break;
      }
      default:
        console.error('Unrecognized opcode', this.opcode.toString(16).padStart(4, '0'));
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