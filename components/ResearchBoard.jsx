'use client';
import { useEffect, useMemo, useState } from 'react';
import useLocalStorage from '../lib/hooks/useLocalStorage';
import StickyNote from './StickyNote';
import Textarea from './ui/Textarea';
import Button from './ui/Button';
import { listCities } from '../lib/services/citiesService';
import { listResearchNotes, createResearchNote, deleteResearchNote } from '../lib/services/researchService';

export default function ResearchBoard() {
  const initialCities = useMemo(() => [], []);
  const [cities, setCities] = useLocalStorage('europupis-cities-v2', initialCities);

  const initialNotes = useMemo(() => [], []);
  const [notes, setNotes] = useLocalStorage('europupis-research-notes-v1', initialNotes);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    // Refrescar ciudades desde Supabase (si hay sesión) para un conteo actualizado
    (async () => {
      const data = await listCities();
      if (Array.isArray(data)) setCities(data);
    })();
    // Cargar notas de investigación desde Supabase
    (async () => {
      const data = await listResearchNotes();
      if (Array.isArray(data) && data.length) setNotes(data);
    })();
  }, []);

  const citiesCount = cities?.length || 0;

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = form.body.value.trim();
    if (!body) return;
    const id = `r_${Date.now()}`;
    setNotes([{ id, body }, ...notes]);
    form.reset();
    setIsFormVisible(false);
    // Persistencia optimista a Supabase (si disponible)
    createResearchNote(body).catch(() => {});
  }

  function handleDelete(id) {
    setNotes(notes.filter(n => n.id !== id));
    deleteResearchNote(id).catch(() => {});
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Notas de investigación</h2>
          <p className="text-sm muted mt-1">Ideas libres y conteo de ciudades agregadas</p>
        </div>
        <Button
          onClick={() => setIsFormVisible(!isFormVisible)}
          variant={isFormVisible ? 'outline' : 'primary'}
          className="gap-2"
        >
          {isFormVisible ? 'Cancelar' : 'Añadir nota'}
        </Button>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="card-interactive animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold">
              📝
            </div>
            <h3 className="text-xl font-semibold">Nueva nota libre</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2" htmlFor="body">
                Texto
              </label>
              <Textarea id="body" name="body" placeholder="Escribe detalles, dudas o ideas…" rows={4} />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary">Guardar nota</Button>
              <Button type="button" variant="ghost" onClick={() => setIsFormVisible(false)}>Cancelar</Button>
            </div>
          </div>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Nota adhesiva con conteo de ciudades */}
        <StickyNote
          note={{ id: 'meta-cities-count', title: 'Ciudades agregadas', body: `Tienes ${citiesCount} ciudades añadidas.` }}
          deletable={false}
        />

        {/* Notas libres */}
        {notes.map((note, index) => (
          <div key={note.id} className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 80}ms` }}>
            <StickyNote note={note} onDelete={handleDelete} />
          </div>
        ))}
      </div>
    </div>
  );
}

