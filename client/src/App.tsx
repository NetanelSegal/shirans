import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';
import ScreenProvider from './contexts/ScreenProvider';
import { ProjectsProvider } from './contexts/ProjectsContext';

const Layout = lazy(() => import('./components/Layout'));
const Home = lazy(() => import('./pages/Home'));
const Process = lazy(() => import('./pages/Process'));
const Projects = lazy(() => import('./pages/Projects'));
const Project = lazy(() => import('./pages/Project'));

function App() {
  return (
    <ProjectsProvider>
      <ScreenProvider>
        <AppRoutes />
      </ScreenProvider>
    </ProjectsProvider>
  );
}

export const appRoutes = [
  {
    path: '',
    title: 'בית',
    element: <Home />,
  },
  {
    path: 'process',
    title: 'התהליך',
    element: <Process />,
  },
  {
    path: 'projects',
    title: 'פרויקטים',
    element: <Projects />,
  },
  {
    path: 'projects/:id',
    element: <Project />,
    notNavigateable: true,
  },
  {
    path: 'contact',
    title: 'צור קשר',
    element: <div></div>,
  },
  {
    path: '*',
    title: '404',
    element: <div>404</div>,
    notNavigateable: true,
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: appRoutes.map((route) => ({
      path: route.path,
      element: route.element,
    })),
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default App;
