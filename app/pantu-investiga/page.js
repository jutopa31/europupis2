import ResearchBoard from '../../components/ResearchBoard';

export const metadata = { title: 'Pantu Investiga — Europupis' };

export default function PantuInvestigaPage() {
  return (
    <main className="relative">
      {/* Decorative cat background element */}
      <div className="absolute top-40 right-8 w-32 h-32 opacity-5 pointer-events-none z-0 hidden lg:block">
        <img
          src="/mi-gato.jpg"
          alt=""
          className="w-full h-full object-cover rounded-full grayscale"
        />
      </div>

      <div className="relative z-10">
        <h1 className="text-2xl font-semibold">Pantu Investiga</h1>
        <p className="muted mt-1">Notas adhesivas con conteo de ciudades y texto libre.</p>
        <div className="mt-6">
          <ResearchBoard />
        </div>
      </div>
    </main>
  );
}
