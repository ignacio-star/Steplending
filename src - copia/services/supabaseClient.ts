
import { createClient } from '@supabase/supabase-js';

// He limpiado el texto sobrante al final de tu llave para que la conexión sea exitosa.
const supabaseUrl = 'https://woibdpdgsgfhgwgrnjsi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvaWJkcGRnc2dmaGd3Z3JuanNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3ODQwMTcsImV4cCI6MjA4NDM2MDAxN30.2wa9HMXsoFvZAbU92fnOQEMlXrzBpZWIAVu4qJFSssg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
