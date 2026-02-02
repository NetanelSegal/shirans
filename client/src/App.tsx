import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy } from 'react';
import ScreenProvider from './contexts/ScreenProvider';
import { ProjectsProvider } from './contexts/ProjectsContext';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';

const Layout = lazy(() => import('./components/Layout'));
const Home = lazy(() => import('./pages/Home'));
const Process = lazy(() => import('./pages/Process'));
const Projects = lazy(() => import('./pages/Projects'));
const Project = lazy(() => import('./pages/Project'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ProjectsProvider>
          <ScreenProvider>
            <AppRoutes />
          </ScreenProvider>
        </ProjectsProvider>
      </AuthProvider>
    </HelmetProvider>
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
    element: <NotFound />,
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
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default App;
