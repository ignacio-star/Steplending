
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Printer, Mail, Download, PieChart, Briefcase, User, MapPin, Building2, AlertTriangle } from 'lucide-react';
import { getSubmissionById } from '../services/mockStorage';
import { isAuthenticated } from '../services/authService';
import { ClientData } from '../types';

const AdminClientDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        navigate('/admin/login');
        return;
      }
      if (id) {
        try {
          const data = await getSubmissionById(id);
          if (data) setClient(data);
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadClient();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter">Cargando reporte ejecutivo...</h2>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Registro no encontrado.</h2>
        <Link to="/admin/dashboard" className="text-blue-600 font-bold mt-4 inline-block underline">Volver al Dashboard</Link>
      </div>
    );
  }

  const { personal, income, debts, results } = client;

  const getCreditBadge = (score: number) => {
    let color = 'bg-red-500';
    let text = 'Pobre';
    if (score >= 740) { color = 'bg-emerald-600'; text = 'Excelente'; }
    else if (score >= 620) { color = 'bg-green-500'; text = 'Bueno'; }
    else if (score >= 580) { color = 'bg-yellow-500'; text = 'Medio'; }

    return (
      <div className={`${color} text-white px-4 py-2 rounded-xl flex flex-col items-center justify-center min-w-[100px] shadow-lg`}>
        <span className="text-2xl font-bold tracking-tighter">{score}</span>
        <span className="text-[10px] uppercase font-black tracking-widest">{text}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8 no-print">
        <Link to="/admin/dashboard" className="flex items-center text-slate-500 hover:text-slate-800 font-bold text-sm uppercase tracking-wider">
          <ChevronLeft size={18} className="mr-1" />
          Dashboard
        </Link>
        <div className="flex space-x-3">
          <button onClick={() => window.print()} className="flex items-center space-x-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl hover:bg-slate-50 font-bold text-sm transition-all shadow-sm">
            <Printer size={18} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 text-white p-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div>
              <div className="inline-block bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3">Reporte Financiero Oficial</div>
              <h1 className="text-4xl font-black tracking-tight">{personal.firstName} {personal.lastName}</h1>
              <p className="text-slate-400 text-sm mt-1">{personal.email}</p>
            </div>
            {getCreditBadge(personal.creditScore)}
          </div>
        </div>

        <div className="p-10">
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-800 mb-4">Ingresos</h3>
              <div className="text-2xl font-black text-slate-900">${results?.totalMonthlyIncome.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Mensual Estimado</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-800 mb-4">Pasivos</h3>
              <div className="text-2xl font-black text-red-600">${results?.totalMonthlyDebts.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">Deuda Reportada</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-800 mb-4">Perfil</h3>
              <div className="text-lg font-black text-slate-900">{personal.employmentStatus}</div>
              <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">{income.type} Status</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-2 border-blue-600 rounded-[2rem] p-8 bg-blue-50/20">
              <h4 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-2">Pago Máximo FHA</h4>
              <div className="text-5xl font-black text-slate-900">${results?.maxPaymentFHA.toLocaleString()}</div>
            </div>
            <div className="border-2 border-slate-100 rounded-[2rem] p-8 bg-slate-50">
              <h4 className="text-slate-400 font-black text-xs uppercase tracking-widest mb-2">Pago Máximo Convencional</h4>
              <div className="text-5xl font-black text-slate-900">${results?.maxPaymentConventional.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClientDetail;
