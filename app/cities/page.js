import CityList from '../../components/CityList';

export const metadata = { title: 'Ciudades — Europupis' };

export default function CitiesPage() {
  return (
    <main>
      <h1 className="text-2xl font-semibold">Ciudades e itinerario</h1>
      <p className="muted mt-1">Resumen rápido de llegadas, traslados y notas por ciudad.</p>
      <div className="mt-6">
        <CityList />
      </div>
    </main>
  );
}




