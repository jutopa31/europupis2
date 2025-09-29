import ResearchBoard from '../../components/ResearchBoard';

export const metadata = { title: 'Pantu Investiga — Europupis' };

export default function PantuInvestigaPage() {
  return (
    <main>
      <h1 className="text-2xl font-semibold">Pantu Investiga</h1>
      <p className="muted mt-1">Notas adhesivas con conteo de ciudades y texto libre.</p>
      <div className="mt-6">
        <ResearchBoard />
      </div>
    </main>
  );
}
