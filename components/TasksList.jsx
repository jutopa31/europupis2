'use client';
import { useMemo, useState } from 'react';
import useLocalStorage from '../lib/hooks/useLocalStorage';
import { tasksMock } from '../lib/mocks/tasksMock';
import StickyNote from './StickyNote';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Button from './ui/Button';

export default function TasksList() {
  const initial = useMemo(() => tasksMock, []);
  const [tasks, setTasks] = useLocalStorage('europupis-tasks', initial);
  const [isFormVisible, setIsFormVisible] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = form.title.value.trim();
    const body = form.body.value.trim();
    if (!title && !body) return;
    const id = `t_${Date.now()}`;
    setTasks([{ id, title, body }, ...tasks]);
    form.reset();
    setIsFormVisible(false);
  }

  function handleDelete(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Notas adhesivas</h2>
          <p className="text-sm muted mt-1">Organiza ideas y recordatorios del viaje</p>
        </div>
        <Button
          onClick={() => setIsFormVisible(!isFormVisible)}
          variant={isFormVisible ? "outline" : "primary"}
          className="gap-2"
        >
          {isFormVisible ? (
            <>
              <span>âœ•</span>
              Cancelar
            </>
          ) : (
            <>
              <span>ðŸ“</span>
              Añadir nota
            </>
          )}
        </Button>
      </div>

      {/* Añadir nota Form */}
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="card-interactive animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center text-white font-bold">
              ðŸ“
            </div>
            <h3 className="text-xl font-semibold">Crear nueva nota</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2" htmlFor="title">
                Título
              </label>
              <Input
                id="title"
                name="title"
                placeholder="¿De qué trata esta nota?"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2" htmlFor="body">
                Detalles
              </label>
              <Textarea
                id="body"
                name="body"
                placeholder="Agrega ideas o recordatorios aquí..."
                rows={4}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="primary">
                Crear nota
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsFormVisible(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Cuadrícula de notas */}
      {tasks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tasks.map((note, index) => (
            <div
              key={note.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StickyNote note={note} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">ðŸ“</div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            Sin notas
          </h3>
          <p className="muted mb-6">
            Crea tu primera nota para empezar a organizar el viaje.
          </p>
          <Button
            onClick={() => setIsFormVisible(true)}
            variant="primary"
            className="gap-2"
          >
            <span>ðŸ“</span>
            Crear primera nota
          </Button>
        </div>
      )}
    </div>
  );
}
