import { IPixelProps, IPixelRowProps } from '@/types';

const Pixel = ( { row, col } : IPixelProps) => {
  return (
    <div 
      className='pixel'
      id={(row * 32 + col).toString()}
      key={row * 32 + col}
    />
  );
};

const PixelRow = ({ rowId } : IPixelRowProps) => {
  const row = [];
  for (let i = 0; i < 32; i++) {
    row.push(<Pixel row={rowId} col={i} />);
  }
  return row;
};

const Screen = () => {
  const screen = [];
  for (let i = 0; i < 64; i++) {
    screen.push(
      <div className='pixel-row'>
        <PixelRow rowId={i} />
      </div>
    );
  }
  return screen;
};

export default Screen;