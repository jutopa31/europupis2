import { citiesMock } from '../mocks/citiesMock';
import { supabase } from '../supabaseClient';

function envReady() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function listCities() {
  try {
    if (!envReady()) return citiesMock;

    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return citiesMock;

    const { data, error } = await supabase
      .from('cities')
      .select(`
        id, name, origin, arrival_datetime,
        city_notes ( body ),
        city_transfers ( info )
      `)
      .order('arrival_datetime', { ascending: true, nullsFirst: false });

    if (error) throw error;
    if (!data) return citiesMock;

    return data.map((c) => ({
      id: c.id,
      name: c.name,
      from: c.origin || null,
      arrivalDateTime: c.arrival_datetime || null,
      transfers: (c.city_transfers || []).map(t => t.info),
      notes: (c.city_notes || []).map(n => n.body),
    }));
  } catch (e) {
    return citiesMock;
  }
}

export async function createCityNote(cityId, body) {
  try {
    if (!envReady()) return { ok: false };
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return { ok: false };
    const { error } = await supabase.from('city_notes').insert({
      user_id: user.id,
      city_id: cityId,
      body,
    });
    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
