import { citiesMock } from '../mocks/citiesMock';
import { supabase } from '../supabaseClient';

// Tabla/campos configurables para adaptarnos a cambios en el esquema
const T_CITIES = process.env.NEXT_PUBLIC_CITIES_TABLE_NAME || 'cities';
const T_NOTES = process.env.NEXT_PUBLIC_CITY_NOTES_TABLE || 'city_notes';
const T_TRANSFERS = process.env.NEXT_PUBLIC_CITY_TRANSFERS_TABLE || 'city_transfers';
const T_ACCOMMS = process.env.NEXT_PUBLIC_CITY_ACCOMMS_TABLE || 'city_accommodations';
const COL_ARRIVAL = process.env.NEXT_PUBLIC_CITIES_ARRIVAL_COL || 'arrival_datetime';
const COL_ORIGIN = process.env.NEXT_PUBLIC_CITIES_ORIGIN_COL || 'origin';
const COL_NOTE_BODY = process.env.NEXT_PUBLIC_CITY_NOTES_BODY_COL || 'body';
const COL_NOTE_CITY_ID = process.env.NEXT_PUBLIC_CITY_NOTES_CITY_ID_COL || 'city_id';

function envReady() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function listCities() {
  try {
    if (!envReady()) return citiesMock;

    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return citiesMock;

    const select = `
      id, name, ${COL_ORIGIN}, ${COL_ARRIVAL},
      ${T_NOTES} ( id, ${COL_NOTE_BODY} ),
      ${T_TRANSFERS} ( id, info ),
      ${T_ACCOMMS} ( id, name, address, check_in_date, check_out_date, price, booking_url, notes )
    `;

    let { data, error } = await supabase
      .from(T_CITIES)
      .select(select)
      .order(COL_ARRIVAL, { ascending: true, nullsFirst: false });

    if (error) throw error;
    if (!data) return citiesMock;

    return data.map((c) => ({
      id: c.id,
      name: c.name || c.city_name || c.title || 'Ciudad',
      from: c[COL_ORIGIN] ?? c.origin ?? c.from ?? null,
      arrivalDateTime: c[COL_ARRIVAL] ?? c.arrival_datetime ?? c.arrival_at ?? c.arrival ?? null,
      transfers: (c[T_TRANSFERS] || c.city_transfers || []).map(t => ({ id: t.id, info: t.info || t.text || t.description })).filter(x => x.info),
      notes: (c[T_NOTES] || c.city_notes || []).map(n => ({ id: n.id, body: n[COL_NOTE_BODY] ?? n.body ?? n.text ?? n.note })).filter(x => x.body),
      accommodations: (c[T_ACCOMMS] || c.city_accommodations || []).map(a => ({
        id: a.id,
        name: a.name,
        address: a.address,
        checkInDate: a.check_in_date ?? a.checkInDate,
        checkOutDate: a.check_out_date ?? a.checkOutDate,
        price: a.price,
        bookingUrl: a.booking_url ?? a.bookingUrl,
        notes: a.notes
      })),
    }));
  } catch (e) {
    return citiesMock;
  }
}

// === CITY BASIC INFO ===
export async function updateCityBasicInfo(cityId, { name, origin, arrivalDateTime }) {
  try {
    if (!envReady()) return { ok: false };
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (origin !== undefined) updateData.origin = origin;
    if (arrivalDateTime !== undefined) updateData.arrival_datetime = arrivalDateTime;

    const { error } = await supabase
      .from('cities')
      .update(updateData)
      .eq('id', cityId)
      .eq('user_id', user.id);

    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

// === CITY NOTES ===
export async function createCityNote(cityId, body) {
  try {
    if (!envReady()) return { ok: false };
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return { ok: false };
    const insertRow = {
      user_id: user.id,
      [COL_NOTE_CITY_ID]: cityId,
      [COL_NOTE_BODY]: body,
    };
    const { error } = await supabase.from(T_NOTES).insert(insertRow);
    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function deleteCityNote(noteId) {
  try {
    if (!envReady()) return { ok: false };
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    const { error } = await supabase
      .from('city_notes')
      .delete()
      .eq('id', noteId)
      .eq('user_id', user.id);

    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

// === CITY TRANSFERS ===
export async function createCityTransfer(cityId, info) {
  try {
    if (!envReady()) return { ok: false };
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    const { error } = await supabase.from('city_transfers').insert({
      user_id: user.id,
      city_id: cityId,
      info,
    });

    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function updateCityTransfer(transferId, info) {
  try {
    if (!envReady()) return { ok: false };
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    const { error } = await supabase
      .from('city_transfers')
      .update({ info })
      .eq('id', transferId)
      .eq('user_id', user.id);

    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function deleteCityTransfer(transferId) {
  try {
    if (!envReady()) return { ok: false };
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    const { error } = await supabase
      .from('city_transfers')
      .delete()
      .eq('id', transferId)
      .eq('user_id', user.id);

    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

// === CITY ACCOMMODATIONS ===
export async function createCityAccommodation(cityId, accommodationData) {
  try {
    if (!envReady()) return { ok: false };
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    const { error } = await supabase.from('city_accommodations').insert({
      user_id: user.id,
      city_id: cityId,
      name: accommodationData.name,
      address: accommodationData.address,
      check_in_date: accommodationData.checkInDate,
      check_out_date: accommodationData.checkOutDate,
      price: accommodationData.price,
      booking_url: accommodationData.bookingUrl,
      notes: accommodationData.notes,
    });

    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function updateCityAccommodation(accommodationId, accommodationData) {
  try {
    if (!envReady()) return { ok: false };
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    const updateData = {};
    if (accommodationData.name !== undefined) updateData.name = accommodationData.name;
    if (accommodationData.address !== undefined) updateData.address = accommodationData.address;
    if (accommodationData.checkInDate !== undefined) updateData.check_in_date = accommodationData.checkInDate;
    if (accommodationData.checkOutDate !== undefined) updateData.check_out_date = accommodationData.checkOutDate;
    if (accommodationData.price !== undefined) updateData.price = accommodationData.price;
    if (accommodationData.bookingUrl !== undefined) updateData.booking_url = accommodationData.bookingUrl;
    if (accommodationData.notes !== undefined) updateData.notes = accommodationData.notes;

    const { error } = await supabase
      .from('city_accommodations')
      .update(updateData)
      .eq('id', accommodationId)
      .eq('user_id', user.id);

    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function deleteCityAccommodation(accommodationId) {
  try {
    if (!envReady()) return { ok: false };
    const { data: { user } = {} } = await supabase.auth.getUser();
    if (!user) return { ok: false };

    const { error } = await supabase
      .from('city_accommodations')
      .delete()
      .eq('id', accommodationId)
      .eq('user_id', user.id);

    if (error) throw error;
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
