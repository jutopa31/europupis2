import CountdownTimer from '../components/CountdownTimer';
import { TRIP_START_ISO } from '../lib/tripConfig';

export default function Page() {
  return (
    <main className="animate-fade-in">
      {/* Sección principal */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-3xl sm:text-4xl animate-bounce-gentle">
            ✈️
          </div>
          <div className="text-left">
            <h1 className="text-3xl sm:text-5xl font-bold gradient-text">
              Europupis
            </h1>
            <p className="text-lg sm:text-xl muted mt-1">
              Nuestra aventura europea nos espera
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Tu planificador integral para la mejor experiencia europea.
            Controla gastos, gestiona tareas, explora ciudades y cuenta los días para la fecha clave.
          </p>
        </div>
      </div>

      {/* Sección de cuenta regresiva */}
      <div className="card text-center mb-12">
        <CountdownTimer targetDate={TRIP_START_ISO} />
      </div>

      {/* Acciones rápidas */}
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4 mb-12">
        <a
          href="/tasks"
          className="group card-interactive p-6 text-center hover:scale-105 transition-all duration-300"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            📝
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Tareas</h3>
          <p className="text-sm muted">Notas adhesivas y recordatorios</p>
        </a>

        <a
          href="/expenses"
          className="group card-interactive p-6 text-center hover:scale-105 transition-all duration-300"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            💸
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Gastos</h3>
          <p className="text-sm muted">Controla tus gastos</p>
        </a>

        <a
          href="/cities"
          className="group card-interactive p-6 text-center hover:scale-105 transition-all duration-300"
        >
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🏙️
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Ciudades</h3>
          <p className="text-sm muted">Destinos y notas</p>
        </a>

        <div className="group card-interactive p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl">
            🗺️
          </div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Planificación</h3>
          <p className="text-sm muted">Mantente organizado</p>
        </div>
      </div>

      {/* Destacados del viaje */}
      <div className="card">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          ✨ Destacados del viaje
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              🏛️
            </div>
            <div>
              <div className="font-medium text-sm">Ciudades históricas</div>
              <div className="text-xs muted">Roma, Florencia, París</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <div className="w-8 h-8 rounded-lg bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
              🎨
            </div>
            <div>
              <div className="font-medium text-sm">Arte y cultura</div>
              <div className="text-xs muted">Museos y galerías</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              🍝
            </div>
            <div>
              <div className="font-medium text-sm">Gastronomía local</div>
              <div className="text-xs muted">Sabores auténticos</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
