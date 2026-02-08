
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../services/authService';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logoUrl = "https://i.ibb.co/3mYfFfH/step-real-estate-logo.png";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginAdmin(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas. Por favor verifique su acceso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden bg-blue-950">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
          alt="Admin Background" 
          className="w-full h-full object-cover opacity-20 scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/80 via-blue-950 to-blue-950"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-2xl p-12 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20">
            <div className="flex items-center justify-center mb-12">
              <img 
                src={logoUrl} 
                alt="Step Real Estate" 
                className="h-16 w-auto object-contain filter drop-shadow-sm" 
              />
            </div>
            
            <div className="text-center mb-10">
              <div className="h-1 w-12 bg-blue-600 mx-auto mb-6 rounded-full"></div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Control Center</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Authorized Personnel Only</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1 transition-colors group-focus-within:text-blue-600">Email Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email"
                    required
                    className="w-full bg-slate-100 border-2 border-transparent pl-12 pr-4 py-4 rounded-2xl focus:ring-0 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                    placeholder="user@steplending.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1 transition-colors group-focus-within:text-blue-600">Clave de Acceso</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="password"
                    required
                    className="w-full bg-slate-100 border-2 border-transparent pl-12 pr-4 py-4 rounded-2xl focus:ring-0 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center text-[11px] font-bold border border-red-100 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle size={16} className="mr-3 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button 
                disabled={loading}
                className={`w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-2xl active:scale-95 flex items-center justify-center space-x-3 group relative overflow-hidden ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600 hover:-translate-y-0.5'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Verificando...</span>
                  </span>
                ) : (
                  <span>Ingresar al Sistema</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
