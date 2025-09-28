'use client';
import { useMemo, useState } from 'react';
import useLocalStorage from '../lib/hooks/useLocalStorage';
import { expensesMock } from '../lib/mocks/expensesMock';
import Input from './ui/Input';
import Button from './ui/Button';

const categoryColors = {
  Food: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  Transport: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Accommodation: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Lodging: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Activities: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Shopping: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  General: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300',
  Comida: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  Transporte: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Alojamiento: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Actividades: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Compras: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
};

export default function ExpenseList() {
  const initial = useMemo(() => expensesMock, []);
  const [expenses, setExpenses] = useLocalStorage('europupis-expenses', initial);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category || 'General';
    acc[category] = (acc[category] || 0) + Number(expense.amount || 0);
    return acc;
  }, {});

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const description = form.description.value.trim();
    const amount = parseFloat(form.amount.value || '0');
    const date = form.date.value || new Date().toISOString().slice(0, 10);
    const paid_by = form.paid_by.value || 'Both';
    const category = form.category.value || 'General';
    if (!description || isNaN(amount) || amount <= 0) return;
    const id = `e_${Date.now()}`;
    setExpenses([{ id, date, description, amount, paid_by, category }, ...expenses]);
    form.reset();
    setIsFormExpanded(false);
  }

  function handleDelete(id) {
    setExpenses(expenses.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Formulario de gasto */}
      <div className="card-interactive">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold">
              💸
            </div>
            <h2 className="text-xl font-semibold">Agregar gasto</h2>
          </div>
          <button
            onClick={() => setIsFormExpanded(!isFormExpanded)}
            className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium"
          >
            {isFormExpanded ? 'Simple' : 'Detallado'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2" htmlFor="description">
                Descripción *
              </label>
              <Input id="description" name="description" placeholder="¿Qué compraste?" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2" htmlFor="amount">
                Importe (€) *
              </label>
              <Input id="amount" name="amount" type="number" step="0.01" min="0" placeholder="0.00" required />
            </div>
          </div>

          {isFormExpanded && (
            <div className="grid gap-4 sm:grid-cols-3 animate-slide-up">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2" htmlFor="date">
                  Fecha
                </label>
                <Input id="date" name="date" type="date" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2" htmlFor="paid_by">
                  Pagado por
                </label>
                <select id="paid_by" name="paid_by" className="form-input">
                  <option value="Both">Ambos</option>
                  <option value="You">Tú</option>
                  <option value="Partner">Pareja</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2" htmlFor="category">
                  Categoría
                </label>
                <select id="category" name="category" className="form-input">
                  <option value="General">General</option>
                  <option value="Food">Comida</option>
                  <option value="Transport">Transporte</option>
                  <option value="Lodging">Alojamiento</option>
                  <option value="Activities">Actividades</option>
                  <option value="Shopping">Compras</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" className="btn-primary">
              Agregar gasto
            </Button>
          </div>
        </form>
      </div>

      {/* Total y desglose por categoría */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card text-center">
          <div className="text-3xl font-bold gradient-text mb-2">€{total.toFixed(2)}</div>
          <div className="text-sm muted">Total de gastos</div>
        </div>

        {Object.keys(categoryTotals).length > 0 && (
          <div className="card">
            <h3 className="font-semibold mb-3">Por categoría</h3>
            <div className="space-y-2">
              {Object.entries(categoryTotals)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[category] || categoryColors.General}`}>
                      {{ Food: 'Comida', Transport: 'Transporte', Accommodation: 'Alojamiento', Lodging: 'Alojamiento', Activities: 'Actividades', Shopping: 'Compras', General: 'General' }[category] || category}
                    </span>
                    <span className="font-medium">€{amount.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Lista de gastos */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Gastos recientes</h3>
        {expenses.length === 0 ? (
          <div className="card text-center py-8">
            <div className="text-4xl mb-3">💸</div>
            <p className="muted">Sin gastos aún. ¡Agrega tu primer gasto arriba!</p>
          </div>
        ) : (
          expenses.map((expense, index) => (
            <div
              key={expense.id}
              className={`card hover:shadow-lg transition-all duration-200 animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                      {expense.description}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[expense.category] || categoryColors.General}`}>
                      {{ Food: 'Comida', Transport: 'Transporte', Accommodation: 'Alojamiento', Lodging: 'Alojamiento', Activities: 'Actividades', Shopping: 'Compras', General: 'General' }[expense.category] || expense.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm muted">
                    <span>📅 {new Date(expense.date).toLocaleDateString()}</span>
                    <span>👤 {expense.paid_by === 'Both' ? 'Ambos' : expense.paid_by === 'You' ? 'Tú' : expense.paid_by === 'Partner' ? 'Pareja' : expense.paid_by}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">€{Number(expense.amount).toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    aria-label="Eliminar gasto"
                    className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
