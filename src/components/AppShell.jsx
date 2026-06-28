import GlobalSearch from './GlobalSearch';
import { isNavActive } from '../utils/routes';

const navItems = [
  { name: 'dashboard', label: 'Home', href: '#/' },
  { name: 'library', label: 'Library', href: '#/library' },
  { name: 'settings', label: 'Settings', href: '#/settings' },
];

export default function AppShell({ route, children }) {
  const searchQuery = route.name === 'search' ? route.query : '';

  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <div className="app-shell__inner">
          <a href="#/" className="app-shell__logo">
            Cadence
          </a>

          <GlobalSearch initialQuery={searchQuery} />

          <nav className="app-shell__nav" aria-label="Main">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`app-shell__link${
                  isNavActive(item.name, route) ? ' app-shell__link--active' : ''
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#/profile"
              className={`app-shell__avatar${
                route.name === 'profile' ? ' app-shell__avatar--active' : ''
              }`}
              aria-label="Profile"
              title="Profile"
            >
              P
            </a>
          </nav>
        </div>
      </header>

      <main className="app-shell__main">{children}</main>
    </div>
  );
}
