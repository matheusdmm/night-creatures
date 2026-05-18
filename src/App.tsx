import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CharacterBuilder from './pages/CharacterBuilder';
import Guide from './pages/Guide';
import SharedSheet from './pages/SharedSheet';
import Footer from './components/Footer';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/character/:id" element={<CharacterBuilder />} />
            <Route path="/share" element={<SharedSheet />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
