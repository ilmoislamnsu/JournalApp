import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { NewEntry } from './pages/NewEntry';
import { EntryDetail } from './pages/EntryDetail';
import { Settings } from './pages/Settings';

// Home is no longer a child route — Layout always renders it as the
// persistent left panel so it can animate alongside the detail panel.
export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    Component: Layout,
    children: [
      {
        path: 'new',
        Component: NewEntry,
      },
      {
        path: 'entry/:id',
        Component: EntryDetail,
      },
      {
        path: 'settings',
        Component: Settings,
      },
    ],
  },
]);
