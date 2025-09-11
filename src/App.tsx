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

function App() {

  return (
    <>
      <Navbar />
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} /> {/* Ruta a la página principal */}
            <Route path="/historia" element={<Historia />} /> {/* Ruta a la página 'Historia' */}
            <Route path="/actividades" element={<Actividades />} /> {/* Ruta a la página 'Actividades' */}
            <Route path="/concurso" element={<Concurso />} /> {/* Ruta a la página 'Concurso' */}
            <Route path="/staff" element={<Staff />} /> {/* Ruta a la página 'Staff' */}
            <Route path="/aliados" element={<Aliados />} /> {/* Ruta a la página 'Aliados' */}
            <Route path="/registro" element={<Registro />} /> {/* Ruta a la página 'Registro' */}
          </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
