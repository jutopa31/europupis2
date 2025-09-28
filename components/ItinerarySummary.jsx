import React, { useMemo } from 'react';

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

export default function ItinerarySummary({ cities = [] }) {
  const items = useMemo(() => {
    const withArrival = cities.map((c) => ({
      id: c.id,
      name: c.name,
      arrival: c.arrivalDateTime || c.arrival || null,
      from: c.from || null,
      firstLeg: c.transfers?.[0] || null,
    }));
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
                <td className="py-2 pr-3">{formatDateTimeEs(it.arrival)}</td>
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

