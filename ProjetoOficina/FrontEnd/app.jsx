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

// Pages - Públicas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalogo from './pages/Catalogo';
import ServicoDetalhes from './pages/ServicoDetalhes';

// Pages - Protegidas (Usuário)
import MeusVeiculos from './pages/MeusVeiculos';
import MeusServicos from './pages/MeusServicos';
import Servicos from './pages/Servicos';
import NovoServico from './pages/NovoServico';
import Favoritos from './pages/Favoritos';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

// Pages - Administrativas
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
              
              {/* Rotas protegidas - Usuário */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/veiculos" element={
                <ProtectedRoute>
                  <MeusVeiculos />
                </ProtectedRoute>
              } />
              
              <Route path="/servicos" element={
                <ProtectedRoute>
                  <Servicos />
                </ProtectedRoute>
              } />
              
              <Route path="/servicos/novo" element={
                <ProtectedRoute>
                  <NovoServico />
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
              
              {/* Rota 404 - Página não encontrada */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Página não encontrada</p>
                    <a 
                      href="/" 
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Voltar ao início
                    </a>
                  </div>
                </div>
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