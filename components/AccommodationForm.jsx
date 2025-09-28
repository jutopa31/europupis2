'use client';
import { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

export default function AccommodationForm({
  accommodation = null,
  onSave,
  onCancel,
  onDelete
}) {
  const [formData, setFormData] = useState({
    name: accommodation?.name || '',
    address: accommodation?.address || '',
    checkInDate: accommodation?.checkInDate || '',
    checkOutDate: accommodation?.checkOutDate || '',
    price: accommodation?.price || '',
    bookingUrl: accommodation?.bookingUrl || '',
    notes: accommodation?.notes || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      const accommodationData = {
        name: formData.name.trim(),
        address: formData.address.trim() || null,
        checkInDate: formData.checkInDate || null,
        checkOutDate: formData.checkOutDate || null,
        price: formData.price ? parseFloat(formData.price) : null,
        bookingUrl: formData.bookingUrl.trim() || null,
        notes: formData.notes.trim() || null
      };
      await onSave?.(accommodationData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!accommodation?.id) return;
    if (!confirm('¿Estás seguro de eliminar este alojamiento?')) return;

    setIsLoading(true);
    try {
      await onDelete?.(accommodation.id);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isEditing = Boolean(accommodation);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-slide-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Nombre del alojamiento *
          </label>
          <Input
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Ej: ClinkNOORD Hostel"
            className="form-input"
            autoFocus
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Precio por noche (€)
          </label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="45.00"
            className="form-input"
            step="0.01"
            min="0"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Dirección
        </label>
        <Input
          value={formData.address}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder="Badhuiskade 3, 1031 KV Amsterdam"
          className="form-input"
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Check-in
          </label>
          <Input
            type="date"
            value={formData.checkInDate}
            onChange={(e) => updateField('checkInDate', e.target.value)}
            className="form-input"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
            Check-out
          </label>
          <Input
            type="date"
            value={formData.checkOutDate}
            onChange={(e) => updateField('checkOutDate', e.target.value)}
            className="form-input"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          URL de reserva
        </label>
        <Input
          type="url"
          value={formData.bookingUrl}
          onChange={(e) => updateField('bookingUrl', e.target.value)}
          placeholder="https://booking.com/hotel-name"
          className="form-input"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Notas adicionales
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Ferry gratuito al centro, muy moderno..."
          className="form-input resize-none"
          rows="2"
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button
          type="submit"
          className="btn-primary text-sm px-4 py-2"
          disabled={isLoading || !formData.name.trim()}
        >
          {isLoading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Agregar alojamiento'}
        </Button>

        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary text-sm px-4 py-2"
          disabled={isLoading}
        >
          Cancelar
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors ml-2"
            disabled={isLoading}
          >
            🗑️ Eliminar
          </button>
        )}
      </div>

      {isEditing && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Editando alojamiento existente
        </p>
      )}
    </form>
  );
}