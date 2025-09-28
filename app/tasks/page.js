import TasksList from '../../components/TasksList';

export const metadata = { title: 'Tareas — Europupis' };

export default function TasksPage() {
  return (
    <main>
      <h1 className="text-2xl font-semibold">Tareas / Notas adhesivas</h1>
      <p className="muted mt-1">Solo mock. Las notas persisten en tu navegador.</p>
      <div className="mt-6">
        <TasksList />
      </div>
    </main>
  );
}




