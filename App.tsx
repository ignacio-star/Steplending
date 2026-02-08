
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './src/components/Layout';
import Home from './src/pages/Home';
import ApplicationForm from './src/pages/ApplicationForm';
import AdminLogin from './src/pages/AdminLogin';
import AdminDashboard from './src/pages/AdminDashboard';
import AdminClientDetail from './src/pages/AdminClientDetail';
import { isAuthenticated } from './src/services/authService';
import { LanguageProvider } from './src/context/LanguageContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    isAuthenticated().then(setAuth);
  }, []);

  if (auth === null) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-black animate-pulse">VERIFICANDO SEGURIDAD...</div>;

  if (!auth) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apply" element={<ApplicationForm />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/client/:id" element={<ProtectedRoute><AdminClientDetail /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
};

export default App;
