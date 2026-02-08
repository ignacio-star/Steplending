
export type IncomeType = 'W2' | '1099';
export type W2Type = 'fixed' | 'hourly';
export type EmploymentStatus = 'Citizen' | 'Resident' | 'Work Permit' | 'Other';

export interface ClientData {
  id: string;
  createdAt: string;
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    creditScore: number;
    employmentStatus: EmploymentStatus;
    employmentTimeMonths: number;
  };
  income: {
    type: IncomeType;
    w2?: {
      payType: W2Type;
      fixedAmount?: number;
      hourlyRate?: number;
      hoursPerWeek?: number;
      hasOT: boolean;
      otMonths?: number;
      otHoursPerWeek?: number;
    };
    i1099?: {
      year1Line31: number;
      year2Line31: number;
      miles: number;
      sameActivity: boolean;
    };
    coApplicantIncome?: number;
  };
  debts: {
    carPayments: number;
    creditCards: number;
    studentLoans: number;
    otherDebts: number;
  };
  results?: FinancialAnalysis;
}

export interface FinancialAnalysis {
  totalMonthlyIncome: number;
  totalMonthlyDebts: number;
  maxPaymentConventional: number;
  maxPaymentFHA: number;
  dtiConventional: number;
  dtiFHA: number;
}
