
import { ClientData, FinancialAnalysis } from '../types';

export const calculateAnalysis = (data: ClientData): FinancialAnalysis => {
  let monthlyBaseIncome = 0;
  let monthlyOTIncome = 0;

  // 1. Base Income Calculation
  if (data.income.type === 'W2' && data.income.w2) {
    const w2 = data.income.w2;
    if (w2.payType === 'fixed') {
      monthlyBaseIncome = w2.fixedAmount || 0;
    } else if (w2.payType === 'hourly') {
      const rate = w2.hourlyRate || 0;
      const hours = w2.hoursPerWeek || 0;
      // Qualification: 37-40 hours
      if (hours >= 37 && hours <= 40) {
        monthlyBaseIncome = rate * hours * 4;
      } else {
        monthlyBaseIncome = 0; // Does not qualify base on hours
      }
    }

    // Overtime logic: only if > 12 months
    if (w2.hasOT && (w2.otMonths || 0) >= 12 && w2.otHoursPerWeek) {
      const rate = w2.hourlyRate || 0;
      monthlyOTIncome = (rate * 1.5) * w2.otHoursPerWeek * 4;
    }
  } else if (data.income.type === '1099' && data.income.i1099) {
    const i = data.income.i1099;
    if (i.sameActivity) {
      monthlyBaseIncome = (i.year1Line31 + i.year2Line31 + (i.miles * 0.24)) / 24;
    }
  }

  const coApplicant = data.income.coApplicantIncome || 0;
  const totalMonthlyIncome = monthlyBaseIncome + monthlyOTIncome + coApplicant;

  // 2. Debts Calculation
  const totalMonthlyDebts = 
    (data.debts.carPayments || 0) + 
    (data.debts.creditCards || 0) + 
    (data.debts.studentLoans || 0) + 
    (data.debts.otherDebts || 0);

  // 3. Max Payments (Preliminary)
  // Conventional: 47% DTI
  // FHA: 53% DTI
  const maxPaymentConventional = Math.max(0, (totalMonthlyIncome * 0.47) - totalMonthlyDebts);
  const maxPaymentFHA = Math.max(0, (totalMonthlyIncome * 0.53) - totalMonthlyDebts);

  return {
    totalMonthlyIncome,
    totalMonthlyDebts,
    maxPaymentConventional,
    maxPaymentFHA,
    dtiConventional: 0.47,
    dtiFHA: 0.53
  };
};
