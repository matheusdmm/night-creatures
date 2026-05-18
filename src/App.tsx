import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CharacterBuilder from './pages/CharacterBuilder';
import Guide from './pages/Guide';
import SharedSheet from './pages/SharedSheet';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  return (
    <BrowserRouter>
      <>
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
          <ThemeToggle />
        </div>

        {/* Hidden SVG: organic mask for theme transition */}
        <svg
          aria-hidden="true"
          style={{ position: 'fixed', width: 0, height: 0, overflow: 'visible', pointerEvents: 'none' }}
        >
          <defs>
            <filter id="vt-squiggle" x="-50%" y="-50%" width="200%" height="200%">
              <feTurbulence
                id="vt-turbulence"
                type="turbulence"
                baseFrequency="0.02 0.025"
                numOctaves={3}
                seed={8}
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={90}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <mask id="vt-mask" maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="8000" height="8000">
              <circle id="vt-circle" cx={0} cy={0} r={0} fill="white" filter="url(#vt-squiggle)" />
            </mask>
          </defs>
        </svg>
      </>
    </BrowserRouter>
  );
}
