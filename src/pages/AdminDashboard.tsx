
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Filter, Eye, Trash2, Mail, User, AlertCircle, Share2, Check } from 'lucide-react';
import { getSubmissions, deleteSubmission } from '../services/mockStorage';
import { isAuthenticated, logoutAdmin, getCurrentAdmin, AdminUser } from '../services/authService';
import { ClientData } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ClientData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        navigate('/admin/login');
        return;
      }
      const currentUser = await getCurrentAdmin();
      setAdmin(currentUser);
      await loadSubmissions();
    };
    checkAuthAndLoad();
  }, [navigate]);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyClientLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const clientLink = `${baseUrl}#/apply`;
    navigator.clipboard.writeText(clientLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`¿Está seguro de que desea eliminar permanentemente el registro de ${name}?`)) {
      await deleteSubmission(id);
      await loadSubmissions();
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    const fullName = `${s.personal.firstName} ${s.personal.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.personal.employmentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCreditBadgeColor = (score: number) => {
    if (score >= 620) return 'bg-green-100 text-green-700';
    if (score >= 580) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
        <div>
          <div className="inline-block bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1 rounded-full mb-3 border border-blue-600/20">
            Internal Platform
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Prospect Manager</h1>
          <p className="text-slate-500 font-medium">Gestión estratégica de análisis financieros Step Lending.</p>
        </div>
        
        <div className="flex items-center space-x-6">
          <button 
            onClick={copyClientLink}
            className={`flex items-center space-x-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/20'}`}
          >
            {copied ? <Check size={16} /> : <Share2 size={16} />}
            <span>{copied ? '¡Copiado!' : 'Copiar Link Cliente'}</span>
          </button>

          <div className="flex items-center space-x-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center space-x-3 px-3 border-r border-slate-100 pr-5">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black">
                {admin?.name?.charAt(0) || <User size={20} />}
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-black text-slate-900 tracking-tight">{admin?.name}</div>
                <div className="text-[9px] text-blue-500 uppercase font-black tracking-widest">Admin Access</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 p-2 transition-colors"
              title="Cerrar Sesión"
            >
              <User size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar prospecto por nombre..."
              className="w-full pl-12 pr-4 py-4 border-transparent border-2 bg-white rounded-2xl focus:border-blue-500 outline-none transition-all shadow-sm font-bold text-slate-900"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
             <button onClick={loadSubmissions} className="bg-white p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors shadow-sm text-slate-500">
                <div className={loading ? 'animate-spin' : ''}>
                   <Filter size={20} />
                </div>
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6">Prospecto</th>
                <th className="px-10 py-6">Programa Sugerido</th>
                <th className="px-10 py-6">Score</th>
                <th className="px-10 py-6 text-right">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="px-10 py-32 text-center font-black text-slate-400 animate-pulse uppercase tracking-[0.3em] text-xs">Accediendo a la base de datos segura...</td></tr>
              ) : filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((s) => (
                  <tr key={s.id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-900 tracking-tighter text-lg">{s.personal.firstName} {s.personal.lastName}</div>
                      <div className="text-xs text-slate-500 font-medium flex items-center mt-1">
                        <Mail size={12} className="mr-1.5" />
                        {s.personal.email}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                             FHA: ${s.results?.maxPaymentFHA.toLocaleString()}
                          </span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${getCreditBadgeColor(s.personal.creditScore)} shadow-sm border border-current opacity-80`}>
                        {s.personal.creditScore || 'N/A'}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center justify-end space-x-3">
                        <Link 
                          to={`/admin/client/${s.id}`} 
                          className="p-3 text-slate-900 bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 rounded-xl transition-all shadow-sm active:scale-95" 
                        >
                          <Eye size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(s.id, `${s.personal.firstName} ${s.personal.lastName}`)}
                          className="p-3 text-slate-400 bg-white border border-slate-200 hover:border-red-500 hover:text-red-500 rounded-xl transition-all shadow-sm active:scale-95" 
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-10 py-48 text-center text-slate-300 font-black uppercase tracking-[0.3em] text-[10px]">No se encontraron registros en el sistema</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
