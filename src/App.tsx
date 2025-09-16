import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/home';
import Historia from './pages/historia/historia';
import Actividades from './pages/actividades/actividades';
import Concurso from './pages/concurso/concurso';
import Registro from './pages/registro/registro';
import Aliados from './pages/aliados/aliados';
import Staff from './pages/staff/staff';
import Navbar from "./components/navbar/navbar";
import Footer from './components/footer/footer';
import Galeria from './pages/historia/GaleriaCompleta';

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/actividades" element={<Actividades />} />
          <Route path="/concurso" element={<Concurso />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/aliados" element={<Aliados />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App;