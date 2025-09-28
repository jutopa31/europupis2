import './globals.css';
import Nav from '../components/Nav';

export const metadata = {
  title: 'Europupis',
  description: 'Our Europe trip planner',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 glass-effect border-b border-zinc-200/80 dark:border-zinc-800/80 shadow-sm">
          <Nav />
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="container-prose py-6 sm:py-8 lg:py-12">
            {children}
          </div>
        </main>

        {/* Pie de página */}
        <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="container-prose py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs muted">
              <div className="flex items-center gap-2">
                <span>✈️</span>
                <span>© {new Date().getFullYear()} Europupis — Planificador de viaje minimalista</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xs">Hecho con ❤️ para tu aventura</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
