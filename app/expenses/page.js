import ExpenseList from '../../components/ExpenseList';

export const metadata = { title: 'Gastos — Europupis' };

export default function ExpensesPage() {
  return (
    <main>
      <h1 className="text-2xl font-semibold">Registro de gastos</h1>
      <p className="muted mt-1">Solo mock. Se guarda en tu navegador. Los totales son aproximados.</p>
      <div className="mt-6">
        <ExpenseList />
      </div>
    </main>
  );
}




