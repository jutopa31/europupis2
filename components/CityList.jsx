'use client';
import { useEffect, useMemo } from 'react';
import useLocalStorage from '../lib/hooks/useLocalStorage';
import { citiesMock } from '../lib/mocks/citiesMock';
import CityCard from './CityCard';
import Input from './ui/Input';
import { listCities, createCityNote, createCity } from '../lib/services/citiesService';
import ItinerarySummary from './ItinerarySummary';

export default function CityList() {
  const initial = useMemo(() => citiesMock, []);
  const [cities, setCities] = useLocalStorage('europupis-cities', initial);

  useEffect(() => {
    loadCities();
  }, []);

  async function loadCities() {
    const data = await listCities();
    if (Array.isArray(data) && data.length) {
      setCities(data);
    }
  }

  async function addNote(cityId, note) {
    setCities(cities.map(c => c.id === cityId ? {
      ...c,
      notes: [
        { id: `temp-${Date.now()}`, body: note },
        ...(c.notes || [])
      ]
    } : c));
    // Fire-and-forget to Supabase; UI ya actualizada
    try { await createCityNote(cityId, note); } catch {}
  }

  async function addCity(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.name.value.trim();
    const origin = form.origin.value.trim();
    const arrival = form.arrival.value;
    if (!name) return;

    const temp = {
      id: `c_${Date.now()}`,
      name,
      from: origin || null,
      arrivalDateTime: arrival || null,
      transfers: [],
      notes: [],
    };
    setCities([...cities, temp]);

    try {
      const res = await createCity({ name, origin, arrivalDateTime: arrival || null });
      if (res?.ok) {
        const fresh = await listCities();
        if (Array.isArray(fresh) && fresh.length) setCities(fresh);
      }
    } catch {}

    form.reset();
  }

  function handleUpdateCity() {
    loadCities();
  }

  return (
    <div className="space-y-6">
      {/* Añadir ciudad */}
      <form onSubmit={addCity} className="card-interactive">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center text-white font-bold">🏙️</div>
          <h3 className="text-xl font-semibold">Añadir ciudad</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input name="name" placeholder="Nombre de la ciudad" aria-label="Nombre de la ciudad" required />
          <Input name="origin" placeholder="Origen (opcional)" aria-label="Origen" />
          <Input name="arrival" type="datetime-local" placeholder="Llegada (opcional)" aria-label="Fecha y hora de llegada" />
        </div>
        <div className="mt-3">
          <button type="submit" className="btn-primary text-sm px-4 py-2">Agregar</button>
        </div>
      </form>

      <ItinerarySummary cities={cities} />
      <div className="grid gap-4 sm:grid-cols-2">
        {cities.map(c => (
          <CityCard key={c.id} city={c} onAddNote={addNote} onUpdateCity={handleUpdateCity} />
        ))}
      </div>
    </div>
  );
}
