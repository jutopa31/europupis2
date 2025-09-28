import { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import TransferForm from './TransferForm';
import AccommodationForm from './AccommodationForm';
import {
  createCityTransfer,
  updateCityTransfer,
  deleteCityTransfer,
  createCityAccommodation,
  updateCityAccommodation,
  deleteCityAccommodation,
  deleteCityNote
} from '../lib/services/citiesService';

const cityEmojis = {
  Paris: '🗼',
  Brussels: '🇧🇪',
  Amsterdam: '🚲',
};

function formatDateTimeEs(value) {
  if (!value) return null;
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

export default function CityCard({ city, onAddNote, onUpdateCity }) {
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteValue, setNoteValue] = useState('');
  const [showAddTransfer, setShowAddTransfer] = useState(false);
  const [showAddAccommodation, setShowAddAccommodation] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState(null);
  const [editingAccommodation, setEditingAccommodation] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = form.note.value.trim();
    if (!body) return;
    onAddNote?.(city.id, body);
    form.reset();
    setNoteValue('');
    setShowAddNote(false);
  }

  // === TRANSFER HANDLERS ===
  async function handleAddTransfer(info) {
    try {
      await createCityTransfer(city.id, info);
      onUpdateCity?.();
      setShowAddTransfer(false);
    } catch (error) {
      alert('Error al agregar transporte');
    }
  }

  async function handleUpdateTransfer(info) {
    if (!editingTransfer?.id) return;
    try {
      await updateCityTransfer(editingTransfer.id, info);
      onUpdateCity?.();
      setEditingTransfer(null);
    } catch (error) {
      alert('Error al actualizar transporte');
    }
  }

  async function handleDeleteTransfer(transferId) {
    try {
      await deleteCityTransfer(transferId);
      onUpdateCity?.();
      setEditingTransfer(null);
    } catch (error) {
      alert('Error al eliminar transporte');
    }
  }

  // === ACCOMMODATION HANDLERS ===
  async function handleAddAccommodation(accommodationData) {
    try {
      await createCityAccommodation(city.id, accommodationData);
      onUpdateCity?.();
      setShowAddAccommodation(false);
    } catch (error) {
      alert('Error al agregar alojamiento');
    }
  }

  async function handleUpdateAccommodation(accommodationData) {
    if (!editingAccommodation?.id) return;
    try {
      await updateCityAccommodation(editingAccommodation.id, accommodationData);
      onUpdateCity?.();
      setEditingAccommodation(null);
    } catch (error) {
      alert('Error al actualizar alojamiento');
    }
  }

  async function handleDeleteAccommodation(accommodationId) {
    try {
      await deleteCityAccommodation(accommodationId);
      onUpdateCity?.();
      setEditingAccommodation(null);
    } catch (error) {
      alert('Error al eliminar alojamiento');
    }
  }

  // === NOTE HANDLERS ===
  async function handleDeleteNote(noteId) {
    if (!confirm('¿Eliminar esta nota?')) return;
    try {
      await deleteCityNote(noteId);
      onUpdateCity?.();
    } catch (error) {
      alert('Error al eliminar nota');
    }
  }

  const cityEmoji = cityEmojis[city.name] || '🌍';

  return (
    <div className="card-interactive group h-full flex flex-col">
      {/* Encabezado de ciudad */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-accent-100 dark:from-brand-900/30 dark:to-accent-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
          {cityEmoji}
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{city.name}</h3>
          {city.arrivalDateTime && (
            <p className="text-sm muted">Llegada: {formatDateTimeEs(city.arrivalDateTime)}{city.from ? ` · desde ${city.from}` : ''}</p>
          )}
        </div>
      </div>

      {/* Sección de traslados */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              🚆
            </div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Transporte</h4>
          </div>
          <button
            onClick={() => setShowAddTransfer(!showAddTransfer)}
            className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            {showAddTransfer ? 'Cancelar' : '+ Añadir'}
          </button>
        </div>

        {city.transfers && city.transfers.length > 0 ? (
          <div className="space-y-2 mb-4">
            {city.transfers.map((transfer, i) => {
              const transferData = typeof transfer === 'string' ? { info: transfer } : transfer;
              const transferText = transferData?.info || '';
              const transferId = transferData?.id;

              return (
                <div key={transferId || i} className="flex items-start gap-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-sm group hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 flex-shrink-0"></div>
                  <span className="leading-relaxed flex-1">{transferText}</span>
                  {transferId && (
                    <button
                      onClick={() => setEditingTransfer(transferData)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                    >
                      ✏️
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm muted italic p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 mb-4">
            Sin información de transporte
          </p>
        )}

        {/* Formulario para agregar transporte */}
        {showAddTransfer && (
          <TransferForm
            onSave={handleAddTransfer}
            onCancel={() => setShowAddTransfer(false)}
          />
        )}

        {/* Formulario para editar transporte */}
        {editingTransfer && (
          <TransferForm
            transfer={editingTransfer}
            onSave={handleUpdateTransfer}
            onDelete={handleDeleteTransfer}
            onCancel={() => setEditingTransfer(null)}
          />
        )}
      </div>

      {/* Sección de notas */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              📝
            </div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">Notas</h4>
          </div>
          <button
            onClick={() => setShowAddNote(!showAddNote)}
            className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            {showAddNote ? 'Cancelar' : '+ Añadir'}
          </button>
        </div>

        {city.notes && city.notes.length > 0 ? (
          <div className="space-y-2 mb-4">
            {city.notes.map((note, i) => {
              const noteData = typeof note === 'string' ? { body: note } : note;
              const noteText = noteData?.body || '';
              const noteId = noteData?.id;

              return (
                <div key={noteId || i} className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-sm border border-yellow-200 dark:border-yellow-800/30 group hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                  <span className="leading-relaxed flex-1">{noteText}</span>
                  {noteId && (
                    <button
                      onClick={() => handleDeleteNote(noteId)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm muted italic p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 mb-4">
            Sin notas. ¡Agrega información de tu búsqueda!
          </p>
        )}

        {/* Formulario para añadir nota */}
        {showAddNote && (
          <form onSubmit={handleSubmit} className="space-y-3 animate-slide-up">
            <Input
              name="note"
              placeholder="Agrega información, tips o recordatorios..."
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              className="form-input"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <Button type="submit" className="btn-primary text-sm px-4 py-2">
                Agregar nota
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowAddNote(false);
                  setNoteValue('');
                }}
                className="btn-secondary text-sm px-4 py-2"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Pie de tarjeta */}
      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between text-xs muted">
          <span>{city.transfers?.length || 0} traslados</span>
          <span>{city.notes?.length || 0} notas</span>
        </div>
      </div>
    </div>
  );
}
