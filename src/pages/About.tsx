const About = () => {
  return (
    <main>
      <div className='about-container'>
        <h1>About</h1>
        <p>This is an implementation of the Chip-8 Emulator using TypeScript and the ReactJS library.</p>
        <p>Chip-8 uses a 16 digit keypad to accept inputs. As a result, these have been mapped to the keys mentioned on the emulator page.</p>

        <h2>References</h2>
        <p>To implement the instructions the emulator uses, I referred to <a href='http://devernay.free.fr/hacks/chip8/C8TECH10.HTM' target='_blank'>Cowgod&apos;s Chip-8 Technical Reference v1.0</a> by Thomas P. Greene.</p>

        <h2>Source</h2>
        <p>The source code is viewable <a href='https://github.com/tylerhand1/chip8js' target='_blank'>here</a>.</p>
      </div>
    </main>
  );
};

export default About;