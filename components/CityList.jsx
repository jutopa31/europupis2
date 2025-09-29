'use client';
import { useEffect, useMemo } from 'react';
import useLocalStorage from '../lib/hooks/useLocalStorage';
import CityCard from './CityCard';
import Input from './ui/Input';
import { listCities, createCityNote, createCity, deleteCity, updateCityBasicInfo } from '../lib/services/citiesService';
import ItinerarySummary from './ItinerarySummary';

export default function CityList({ showAddCity = true }) {
  // Migramos el almacenamiento local para eliminar mocks por defecto
  const initial = useMemo(() => [], []);
  const [cities, setCities] = useLocalStorage('europupis-cities-v2', initial);

  useEffect(() => {
    loadCities();
  }, []);

  async function loadCities() {
    const data = await listCities();
    if (Array.isArray(data)) {
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
        if (Array.isArray(fresh)) setCities(fresh);
      } else {
        // Revertir el optimismo si no se pudo persistir (p. ej., sin sesión)
        setCities(curr => curr.filter(c => c.id !== temp.id));
        alert('No se pudo guardar la ciudad. Inicia sesión para guardar en Supabase.');
      }
    } catch {
      setCities(curr => curr.filter(c => c.id !== temp.id));
      alert('Ocurrió un problema al guardar la ciudad. Verifica tu conexión/sesión.');
    }

    form.reset();
  }

  function handleUpdateCity() {
    loadCities();
  }

  async function handleUpdateArrival(cityId, arrivalValue) {
    // Optimista: actualizar en memoria/localStorage
    setCities(cities.map(c => c.id === cityId ? { ...c, arrivalDateTime: arrivalValue } : c));
    // Intentar persistir (si hay Supabase + sesión)
    try {
      const res = await updateCityBasicInfo(cityId, { arrivalDateTime: arrivalValue });
      if (!res?.ok) {
        // Si no se pudo persistir, mantén el valor local pero informa
        // y refresca desde el servicio por si hay desajustes
        loadCities();
      }
    } catch {
      loadCities();
    }
  }

  async function handleDeleteCity(id) {
    setCities(cities.filter(c => c.id !== id));
    try {
      await deleteCity(id);
    } catch {
      loadCities();
    }
  }

  async function handleRenameCity(cityId, name) {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    // Optimista en local
    setCities(cities.map(c => c.id === cityId ? { ...c, name: trimmed } : c));
    try {
      const res = await updateCityBasicInfo(cityId, { name: trimmed });
      if (!res?.ok) loadCities();
    } catch {
      loadCities();
    }
  }

  return (
    <div className="space-y-6">
      {/* Añadir ciudad */}
      {showAddCity && (
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
      )}

      <ItinerarySummary cities={cities} onUpdateArrival={handleUpdateArrival} />
      <div className="grid gap-4 sm:grid-cols-2">
        {cities.map(c => (
          <CityCard
            key={c.id}
            city={c}
            onAddNote={addNote}
            onUpdateCity={handleUpdateCity}
            onDeleteCity={handleDeleteCity}
            onRenameCity={handleRenameCity}
          />
        ))}
      </div>
    </div>
  );
}
