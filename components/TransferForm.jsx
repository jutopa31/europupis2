'use client';
import { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';

export default function TransferForm({
  transfer = null,
  onSave,
  onCancel,
  onDelete
}) {
  const [formData, setFormData] = useState({
    info: transfer?.info || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.info.trim()) return;

    setIsLoading(true);
    try {
      await onSave?.(formData.info.trim());
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!transfer?.id) return;
    if (!confirm('¿Estás seguro de eliminar este transporte?')) return;

    setIsLoading(true);
    try {
      await onDelete?.(transfer.id);
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = Boolean(transfer);

  return (
    <form onSubmit={handleSubmit} className="space-y-3 animate-slide-up">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Información de transporte
        </label>
        <Input
          value={formData.info}
          onChange={(e) => setFormData({ info: e.target.value })}
          placeholder="Ej: Tren París → Bruselas (14:30 - 17:25)"
          className="form-input"
          autoFocus
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          className="btn-primary text-sm px-4 py-2"
          disabled={isLoading || !formData.info.trim()}
        >
          {isLoading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Agregar transporte'}
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
          Editando transporte existente
        </p>
      )}
    </form>
  );
}