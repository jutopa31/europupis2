'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthButton from './AuthButton';

export default function Nav() {
  const pathname = usePathname();
  const isActive = (href) => pathname === href;

  const navItems = [
    { href: '/', label: 'Inicio', icon: '🏠' },
    { href: '/tasks', label: 'Tareas', icon: '📝' },
    { href: '/expenses', label: 'Gastos', icon: '💸' },
    { href: '/cities', label: 'Ciudades', icon: '🏙️' },
    { href: '/pantu-investiga', label: 'Pantu Investiga', icon: '🔎' }
  ];

  return (
    <nav className="container-prose flex items-center justify-between py-4">
      <Link
        href="/"
        className="group flex items-center gap-2 font-bold text-xl gradient-text hover:scale-105 transition-transform duration-200"
      >
        <span className="text-2xl">✈️</span>
        <span>Europupis</span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link group ${isActive(item.href) ? 'nav-link-active' : ''}`}
            >
              <span className="mr-2 group-hover:animate-bounce-gentle">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
        </div>
        <AuthButton />
      </div>
    </nav>
  );
}
