import { supabase } from '../supabaseClient';

function envReady() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function listResearchNotes() {
  try {
    if (!envReady()) return [];
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('research_notes')
      .select('id, body, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch {
    return [];
  }
}

export async function createResearchNote(body) {
  try {
    if (!envReady()) return { ok: false };
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return { ok: false };
    const { error } = await supabase
      .from('research_notes')
      .insert({ user_id: user.id, body });
    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function deleteResearchNote(noteId) {
  try {
    if (!envReady()) return { ok: false };
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return { ok: false };
    const { error } = await supabase
      .from('research_notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);
    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

