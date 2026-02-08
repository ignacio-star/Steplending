
import { supabase } from './supabaseClient';

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
}

export const loginAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data.user;
};

export const logoutAdmin = async () => {
  await supabase.auth.signOut();
};

export const getCurrentAdmin = async (): Promise<AdminUser | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.email?.split('@')[0]
  };
};

export const isAuthenticated = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};
