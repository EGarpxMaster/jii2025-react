import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/home';
import Historia from './pages/historia/historia';
import Actividades from './pages/actividades/actividades';
import Concurso from './pages/concurso/concurso';
import Registro from './pages/registro/registro';
import Aliados from './pages/aliados/aliados';
import Staff from './pages/staff/staff';
import Dashboard from './pages/dashboard/dashboard';
import Navbar from "./components/navbar/navbar";
import Footer from './components/footer/footer';
import Galeria from './pages/historia/GaleriaCompleta';

// Configuración para deployment
const isGitHubPages = import.meta.env.VITE_DEPLOY_TARGET === 'github';
const basename = import.meta.env.PROD && isGitHubPages ? '/jii2025-react' : '';

function App() {
  return (
    <>
      {/* Solo mostrar Navbar y Footer si no es el dashboard */}
      {window.location.pathname !== '/dashboard' && <Navbar />}
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/actividades" element={<Actividades />} />
          <Route path="/concurso" element={<Concurso />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/aliados" element={<Aliados />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      {window.location.pathname !== '/dashboard' && <Footer />}
    </>
  )
}

export default App;