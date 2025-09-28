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
        city_notes ( id, body ),
        city_transfers ( id, info ),
        city_accommodations ( id, name, address, check_in_date, check_out_date, price, booking_url, notes )
      `)
      .order('arrival_datetime', { ascending: true, nullsFirst: false });

    if (error) throw error;
    if (!data) return citiesMock;

    return data.map((c) => ({
      id: c.id,
      name: c.name,
      from: c.origin || null,
      arrivalDateTime: c.arrival_datetime || null,
      transfers: (c.city_transfers || []).map(t => ({ id: t.id, info: t.info })),
      notes: (c.city_notes || []).map(n => ({ id: n.id, body: n.body })),
      accommodations: (c.city_accommodations || []).map(a => ({
        id: a.id,
        name: a.name,
        address: a.address,
        checkInDate: a.check_in_date,
        checkOutDate: a.check_out_date,
        price: a.price,
        bookingUrl: a.booking_url,
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
