import CityList from '../../components/CityList';

export const metadata = { title: 'Pantu Investiga — Europupis' };

export default function PantuInvestigaPage() {
  return (
    <main>
      <h1 className="text-2xl font-semibold">Pantu Investiga</h1>
      <p className="muted mt-1">
        Accede a la lista de ciudades para anotar datos curiosos, averiguaciones e investigaciones sobre cada lugar.
      </p>
      <div className="mt-6">
        <CityList />
      </div>
    </main>
  );
}

