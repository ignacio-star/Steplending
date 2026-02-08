
import { supabase } from './supabaseClient';
import { ClientData } from '../types';
import { calculateAnalysis } from './financialLogic';

const TABLE_NAME = 'submissions';

export const saveSubmission = async (data: Omit<ClientData, 'id' | 'createdAt' | 'results'>): Promise<ClientData> => {
  // 1. Calcular resultados financieros localmente antes de guardar
  const results = calculateAnalysis({ ...data, id: '', createdAt: '' } as ClientData);
  
  const payload = {
    ...data,
    results,
    created_at: new Date().toISOString()
  };

  const { data: insertedData, error } = await supabase
    .from(TABLE_NAME)
    .insert([{ 
      email: data.personal.email,
      first_name: data.personal.firstName,
      last_name: data.personal.lastName,
      full_data: payload // Guardamos el objeto completo en una columna JSONB
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    id: insertedData.id,
    createdAt: insertedData.created_at,
    results
  };
};

export const getSubmissions = async (): Promise<ClientData[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(item => ({
    ...item.full_data,
    id: item.id,
    createdAt: item.created_at
  }));
};

export const getSubmissionById = async (id: string): Promise<ClientData | undefined> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;

  return {
    ...data.full_data,
    id: data.id,
    createdAt: data.created_at
  };
};

export const deleteSubmission = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(TABLE_NAME)
    .delete()
    .eq('id', id);

  if (error) throw error;
};
