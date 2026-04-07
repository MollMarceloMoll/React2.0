import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Granja from './pages/Granja';
import Accesorios from './pages/Accesorios';
import Ventas from './pages/Ventas';
import Usuarios from './pages/Usuarios';
import Reportes from './pages/Reportes';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta inicial: redirige a login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login independiente */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas con Layout */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/granja" element={<Granja />} />
          <Route path="/accesorios" element={<Accesorios />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/reportes" element={<Reportes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
