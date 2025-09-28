import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Crear cliente solo si las variables están disponibles
export const supabase = url && anon
  ? createClient(url, anon)
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false },
      global: { headers: {} }
    });

