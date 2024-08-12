import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom';
import '@/styles/index.css';
import Header from '@/components/Header';
import GamePlayer from '@/components/GamePlayer';
import About from '@/pages/About';

const App = () => {
  
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<GamePlayer />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<GamePlayer />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;