import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogo from './pages/Catalogo';
import ServicoDetalhes from './pages/ServicoDetalhes';
import MeusVeiculos from './pages/MeusVeiculos';
import MeusServicos from './pages/MeusServicos';
import Favoritos from './pages/Favoritos';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCatalogo from './pages/admin/AdminCatalogo';
import AdminServicos from './pages/admin/AdminServicos';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminAvaliacoes from './pages/admin/AdminAvaliacoes';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/servico/:id" element={<ServicoDetalhes />} />
              
              {/* Rotas protegidas */}
              <Route path="/veiculos" element={
                <ProtectedRoute>
                  <MeusVeiculos />
                </ProtectedRoute>
              } />
              <Route path="/meus-servicos" element={
                <ProtectedRoute>
                  <MeusServicos />
                </ProtectedRoute>
              } />
              <Route path="/favoritos" element={
                <ProtectedRoute>
                  <Favoritos />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Rotas administrativas */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/catalogo" element={
                <AdminRoute>
                  <AdminCatalogo />
                </AdminRoute>
              } />
              <Route path="/admin/servicos" element={
                <AdminRoute>
                  <AdminServicos />
                </AdminRoute>
              } />
              <Route path="/admin/usuarios" element={
                <AdminRoute>
                  <AdminUsuarios />
                </AdminRoute>
              } />
              <Route path="/admin/avaliacoes" element={
                <AdminRoute>
                  <AdminAvaliacoes />
                </AdminRoute>
              } />
            </Routes>
          </main>
          
          <Footer />
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;