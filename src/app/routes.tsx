import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { NewEntry } from './pages/NewEntry';
import { EntryDetail } from './pages/EntryDetail';

// Home is no longer a child route — Layout always renders it as the
// persistent left panel so it can animate alongside the detail panel.
export const router = createBrowserRouter([
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
    ],
  },
]);
