'use client';
import { useEffect, useMemo } from 'react';
import useLocalStorage from '../lib/hooks/useLocalStorage';
import { citiesMock } from '../lib/mocks/citiesMock';
import CityCard from './CityCard';
import { listCities, createCityNote } from '../lib/services/citiesService';
import ItinerarySummary from './ItinerarySummary';

export default function CityList() {
  const initial = useMemo(() => citiesMock, []);
  const [cities, setCities] = useLocalStorage('europupis-cities', initial);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await listCities();
      if (mounted && Array.isArray(data) && data.length) {
        setCities(data);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function addNote(cityId, note) {
    setCities(cities.map(c => c.id === cityId ? { ...c, notes: [note, ...(c.notes || [])] } : c));
    // Fire-and-forget to Supabase; UI ya actualizada
    try { await createCityNote(cityId, note); } catch {}
  }

  return (
    <div className="space-y-6">
      <ItinerarySummary cities={cities} />
      <div className="grid gap-4 sm:grid-cols-2">
        {cities.map(c => (
          <CityCard key={c.id} city={c} onAddNote={addNote} />
        ))}
      </div>
    </div>
  );
}
