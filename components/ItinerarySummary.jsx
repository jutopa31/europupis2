'use client';
import React, { useMemo, useState, useCallback } from 'react';
import Input from './ui/Input';

function formatDateTimeEs(value) {
  if (!value) return '—';
  try {
    const date = new Date(value);
    const fmt = new Intl.DateTimeFormat('es-ES', {
      weekday: 'short', day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
    return fmt.format(date).replaceAll('.', '');
  } catch {
    return value;
  }
}

function toInputLocal(value) {
  if (!value) return '';
  try {
    const d = new Date(value);
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  } catch {
    return '';
  }
}

export default function ItinerarySummary({ cities = [], onUpdateArrival }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');

  const startEdit = useCallback((it) => {
    setEditingId(it.id);
    setDraft(toInputLocal(it.arrival));
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setDraft('');
  }, []);

  const commit = useCallback(async () => {
    if (!editingId) return;
    const value = draft || null; // permitir limpiar
    try {
      if (onUpdateArrival) await onUpdateArrival(editingId, value);
    } finally {
      cancelEdit();
    }
  }, [editingId, draft, onUpdateArrival, cancelEdit]);
  const items = useMemo(() => {
    const withArrival = cities.map((c) => {
      const firstLegRaw = c.transfers?.[0] ?? null;
      const firstLeg = typeof firstLegRaw === 'string' ? firstLegRaw : (firstLegRaw && firstLegRaw.info) || null;
      return ({
        id: c.id,
        name: c.name,
        arrival: c.arrivalDateTime || c.arrival || null,
        from: c.from || null,
        firstLeg,
      });
    });
    return withArrival
      .sort((a, b) => {
        const da = a.arrival ? new Date(a.arrival).getTime() : Infinity;
        const db = b.arrival ? new Date(b.arrival).getTime() : Infinity;
        return da - db;
      });
  }, [cities]);

  if (!items.length) return null;

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Resumen de itinerario</h2>
        <span className="text-xs muted">Días y horas de llegada</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-zinc-500 dark:text-zinc-400">
              <th className="py-2 pr-3">Ciudad</th>
              <th className="py-2 pr-3">Llegada</th>
              <th className="py-2 pr-3">Origen</th>
              <th className="py-2">Primer tramo</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="py-2 pr-3 font-medium">{it.name}</td>
                <td className="py-2 pr-3 align-middle">
                  {editingId === it.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="datetime-local"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commit();
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        onBlur={commit}
                        aria-label={`Editar llegada a ${it.name}`}
                        size="sm"
                        className="max-w-[220px]"
                      />
                      <button
                        type="button"
                        className="btn-secondary text-xs px-2 py-1"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={commit}
                        aria-label="Guardar llegada"
                      >Guardar</button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="underline text-left decoration-dotted underline-offset-4 hover:text-brand-600"
                      onClick={() => startEdit(it)}
                      aria-label={`Editar llegada a ${it.name}`}
                    >{formatDateTimeEs(it.arrival)}</button>
                  )}
                </td>
                <td className="py-2 pr-3">{it.from || '—'}</td>
                <td className="py-2">{it.firstLeg || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
