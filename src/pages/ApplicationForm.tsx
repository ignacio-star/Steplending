
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, DollarSign, CreditCard, ChevronRight, ChevronLeft, CheckCircle, Printer, ArrowRight, Building2, ShieldCheck, Mail, Phone, Briefcase } from 'lucide-react';
import { saveSubmission } from '../services/mockStorage';
import { EmploymentStatus, IncomeType, W2Type, ClientData } from '../types';
import { useLanguage } from '../context/LanguageContext';

const ApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ClientData | null>(null);

  // Form State - Inicializado vacío para el cliente
  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      creditScore: 0,
      employmentStatus: 'Citizen' as EmploymentStatus,
      employmentTimeMonths: 24,
    },
    income: {
      type: 'W2' as IncomeType,
      w2: {
        payType: 'fixed' as W2Type,
        fixedAmount: 0,
        hourlyRate: 0,
        hoursPerWeek: 40,
        hasOT: false,
        otMonths: 0,
        otHoursPerWeek: 0,
      },
      i1099: {
        year1Line31: 0,
        year2Line31: 0,
        miles: 0,
        sameActivity: true,
      },
      coApplicantIncome: 0,
    },
    debts: {
      carPayments: 0,
      creditCards: 0,
      studentLoans: 0,
      otherDebts: 0,
    }
  });

  const nextStep = () => {
    // Validación básica antes de pasar de paso
    if (step === 1 && (!formData.personal.firstName || !formData.personal.email)) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }
    setStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  const prevStep = () => {
    setStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await saveSubmission(formData);
      setLastResult(result);
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error al enviar:', error);
      alert('Hubo un error al procesar tu solicitud. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted && lastResult) {
    const { results, personal } = lastResult;
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="bg-blue-950 p-12 text-center relative">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/40">
              <CheckCircle size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{t('results.received')}</h2>
            <p className="text-blue-200 font-medium max-w-md mx-auto">
              {t('results.thanks')} {personal.firstName}. {t('results.analysisGenerated')}
            </p>
          </div>

          <div className="p-12 space-y-10">
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">{t('results.paymentCapacity')}</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-6 bg-white rounded-2xl border-2 border-blue-600 shadow-xl shadow-blue-500/5">
                  <p className="text-blue-600 text-[10px] font-black uppercase mb-2">{t('results.fhaProgram')}</p>
                  <div className="text-4xl font-black text-slate-900">${results?.maxPaymentFHA.toLocaleString()}</div>
                  <p className="text-[10px] text-slate-400 mt-2">{t('results.estimatedDti')}: 53%</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-200">
                  <p className="text-slate-400 text-[10px] font-black uppercase mb-2">{t('results.conventional')}</p>
                  <div className="text-4xl font-black text-slate-900">${results?.maxPaymentConventional.toLocaleString()}</div>
                  <p className="text-[10px] text-slate-400 mt-2">{t('results.estimatedDti')}: 47%</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                <ShieldCheck className="text-blue-600 flex-shrink-0" size={24} />
                <p className="text-sm text-blue-900 font-medium leading-relaxed">
                  <strong>{t('results.importantNote')}</strong> {t('results.nonBinding')}
                </p>
              </div>
              <div className="flex gap-4 no-print">
                <button onClick={() => window.print()} className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2">
                  <Printer size={18} />
                  <span>{t('results.print')}</span>
                </button>
                <button onClick={() => navigate('/')} className="flex-1 bg-white border-2 border-slate-200 text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 transition-all">
                  {t('results.backHome')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4 px-2">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{t('form.step')} {step} {t('form.of')} 4</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{Math.round((step / 4) * 100)}% {t('form.completed')}</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{t('form.personalProfile.title')}</h2>
                <p className="text-slate-500 text-sm mt-1">{t('form.personalProfile.subtitle')}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.personalProfile.firstName')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input required className="w-full bg-slate-50 border-2 border-transparent p-4 pl-12 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.personalProfile.firstNamePlaceholder')} value={formData.personal.firstName} onChange={e => setFormData({ ...formData, personal: { ...formData.personal, firstName: e.target.value } })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.personalProfile.lastName')}</label>
                  <input required className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.personalProfile.lastNamePlaceholder')} value={formData.personal.lastName} onChange={e => setFormData({ ...formData, personal: { ...formData.personal, lastName: e.target.value } })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.personalProfile.email')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input required type="email" className="w-full bg-slate-50 border-2 border-transparent p-4 pl-12 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.personalProfile.emailPlaceholder')} value={formData.personal.email} onChange={e => setFormData({ ...formData, personal: { ...formData.personal, email: e.target.value } })} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.personalProfile.creditScore')}</label>
                  <input type="number" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.personalProfile.creditScorePlaceholder')} value={formData.personal.creditScore || ''} onChange={e => setFormData({ ...formData, personal: { ...formData.personal, creditScore: parseInt(e.target.value) || 0 } })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.personalProfile.immigrationStatus')}</label>
                  <select className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all appearance-none" value={formData.personal.employmentStatus} onChange={e => setFormData({ ...formData, personal: { ...formData.personal, employmentStatus: e.target.value as EmploymentStatus } })}>
                    <option value="Citizen">{t('form.personalProfile.citizen')}</option>
                    <option value="Resident">{t('form.personalProfile.resident')}</option>
                    <option value="Work Permit">{t('form.personalProfile.workPermit')}</option>
                    <option value="Other">{t('form.personalProfile.other')}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{t('form.income.title')}</h2>
                <p className="text-slate-500 text-sm mt-1">{t('form.income.subtitle')}</p>
              </div>

              <div className="flex bg-slate-100 p-2 rounded-2xl">
                <button type="button" onClick={() => setFormData({ ...formData, income: { ...formData.income, type: 'W2' } })} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.income.type === 'W2' ? 'bg-white shadow-xl text-blue-600 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}>{t('form.income.employee')}</button>
                <button type="button" onClick={() => setFormData({ ...formData, income: { ...formData.income, type: '1099' } })} className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${formData.income.type === '1099' ? 'bg-white shadow-xl text-blue-600 scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}>{t('form.income.independent')}</button>
              </div>

              {formData.income.type === 'W2' ? (
                <div className="space-y-6">
                  <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <button type="button" onClick={() => setFormData({ ...formData, income: { ...formData.income, w2: { ...formData.income.w2!, payType: 'fixed' } } })} className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest ${formData.income.w2?.payType === 'fixed' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}>{t('form.income.fixedSalary')}</button>
                    <button type="button" onClick={() => setFormData({ ...formData, income: { ...formData.income, w2: { ...formData.income.w2!, payType: 'hourly' } } })} className={`flex-1 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest ${formData.income.w2?.payType === 'hourly' ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}>{t('form.income.hourly')}</button>
                  </div>

                  {formData.income.w2?.payType === 'fixed' ? (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.income.monthlyGrossIncome')}</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="number" className="w-full bg-slate-50 border-2 border-transparent p-4 pl-12 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.income.monthlyGrossIncomePlaceholder')} value={formData.income.w2?.fixedAmount || ''} onChange={e => setFormData({ ...formData, income: { ...formData.income, w2: { ...formData.income.w2!, fixedAmount: parseFloat(e.target.value) || 0 } } })} />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.income.hourlyRate')}</label>
                        <input type="number" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.income.hourlyRatePlaceholder')} value={formData.income.w2?.hourlyRate || ''} onChange={e => setFormData({ ...formData, income: { ...formData.income, w2: { ...formData.income.w2!, hourlyRate: parseFloat(e.target.value) || 0 } } })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.income.weeklyHours')}</label>
                        <input type="number" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.income.weeklyHoursPlaceholder')} value={formData.income.w2?.hoursPerWeek || ''} onChange={e => setFormData({ ...formData, income: { ...formData.income, w2: { ...formData.income.w2!, hoursPerWeek: parseFloat(e.target.value) || 0 } } })} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('form.income.taxReturns')}</p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.income.netIncome2023')}</label>
                      <input type="number" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.income.line31')} value={formData.income.i1099?.year1Line31 || ''} onChange={e => setFormData({ ...formData, income: { ...formData.income, i1099: { ...formData.income.i1099!, year1Line31: parseFloat(e.target.value) || 0 } } })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.income.netIncome2022')}</label>
                      <input type="number" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.income.line31')} value={formData.income.i1099?.year2Line31 || ''} onChange={e => setFormData({ ...formData, income: { ...formData.income, i1099: { ...formData.income.i1099!, year2Line31: parseFloat(e.target.value) || 0 } } })} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{t('form.debts.title')}</h2>
                <p className="text-slate-500 text-sm mt-1">{t('form.debts.subtitle')}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.debts.carLoans')}</label>
                  <input type="number" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.debts.carLoansPlaceholder')} value={formData.debts.carPayments || ''} onChange={e => setFormData({ ...formData, debts: { ...formData.debts, carPayments: parseFloat(e.target.value) || 0 } })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.debts.creditCards')}</label>
                  <input type="number" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.debts.creditCardsPlaceholder')} value={formData.debts.creditCards || ''} onChange={e => setFormData({ ...formData, debts: { ...formData.debts, creditCards: parseFloat(e.target.value) || 0 } })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.debts.studentLoans')}</label>
                  <input type="number" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.debts.studentLoansPlaceholder')} value={formData.debts.studentLoans || ''} onChange={e => setFormData({ ...formData, debts: { ...formData.debts, studentLoans: parseFloat(e.target.value) || 0 } })} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('form.debts.otherDebts')}</label>
                  <input type="number" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl outline-none font-bold focus:border-blue-600 focus:bg-white transition-all" placeholder={t('form.debts.otherDebtsPlaceholder')} value={formData.debts.otherDebts || ''} onChange={e => setFormData({ ...formData, debts: { ...formData.debts, otherDebts: parseFloat(e.target.value) || 0 } })} />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{t('form.review.title')}</h2>
                <p className="text-slate-500 text-sm mt-1">{t('form.review.subtitle')}</p>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] text-left border border-slate-100 space-y-4">
                <div className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs text-slate-400 font-bold uppercase">{t('form.review.applicant')}</span>
                  <span className="text-xs font-black text-slate-900 uppercase">{formData.personal.firstName} {formData.personal.lastName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-xs text-slate-400 font-bold uppercase">{t('form.review.incomeType')}</span>
                  <span className="text-xs font-black text-slate-900 uppercase">{formData.income.type}</span>
                </div>
                <p className="text-[10px] text-slate-400 italic leading-relaxed text-center pt-2">
                  {t('form.review.disclaimer')}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-12">
            {step > 1 ? (
              <button type="button" onClick={prevStep} className="flex items-center space-x-2 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors">
                <ChevronLeft size={16} />
                <span>{t('form.back')}</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="ml-auto">
              {step < 4 ? (
                <button type="button" onClick={nextStep} className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center space-x-2">
                  <span>{t('form.continue')}</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>{t('form.processing')}</span>
                    </span>
                  ) : t('form.processAnalysis')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
