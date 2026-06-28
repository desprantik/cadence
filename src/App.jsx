import { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import { LearnerProvider } from './context/LearnerContext';
import { PlatformProvider } from './context/PlatformContext';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import PlatformCourses from './pages/PlatformCourses';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import SessionPage from './pages/SessionPage';
import Settings from './pages/Settings';
import { parseRoute } from './utils/routes';

function renderRoute(route) {
  switch (route.name) {
    case 'platform':
      return (
        <PlatformCourses platform={route.platform} status={route.status} />
      );
    case 'search':
      return (
        <SearchResults query={route.query} filter={route.filter} />
      );
    case 'library':
      return <Library platform={route.platform} status={route.status} />;
    case 'settings':
      return <Settings />;
    case 'profile':
      return <Profile />;
    case 'session':
      return <SessionPage />;
    default:
      return <Dashboard celebrate={route.celebrate} />;
  }
}

export default function App() {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <LearnerProvider>
      <PlatformProvider>
        <AppShell route={route}>{renderRoute(route)}</AppShell>
      </PlatformProvider>
    </LearnerProvider>
  );
}
