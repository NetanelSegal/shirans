import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import ScreenProvider from './contexts/ScreenProvider';
import { ProjectsProvider } from './contexts/ProjectsContext';
import { CategoriesProvider } from './contexts/CategoriesContext';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/Auth/ProtectedRoute'; // Import ProtectedRoute
import Loader from './components/Loader/Loader'; // Import Loader for Suspense fallback
import apiClient from './utils/apiClient';
import { urls } from './constants/urls';
import { USE_FILE_DATA } from './constants/dataSource';

const Layout = lazy(() => import('./components/Layout'));
const Home = lazy(() => import('./pages/Home'));
const Process = lazy(() => import('./pages/Process'));
const Projects = lazy(() => import('./pages/Projects'));
const Project = lazy(() => import('./pages/Project'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Overview = lazy(() => import('./pages/Admin/Overview'));
const ProjectsManagement = lazy(() => import('./pages/Admin/ProjectsManagement'));
const CategoriesManagement = lazy(() => import('./pages/Admin/CategoriesManagement'));
const TestimonialsManagement = lazy(() => import('./pages/Admin/TestimonialsManagement'));
const ContactsManagement = lazy(() => import('./pages/Admin/ContactsManagement'));

const pingHealth = async () => {
  try {
    const response = await apiClient.get(urls.health);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }
};


function App() {
  useEffect(() => {
    if (!USE_FILE_DATA) {
      pingHealth();
    }
  }, [])
  return (
    <HelmetProvider>
      <AuthProvider>
        <ProjectsProvider>
          <CategoriesProvider>
            <ScreenProvider>
              <AppRoutes />
            </ScreenProvider>
          </CategoriesProvider>
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
  {
    path: 'login',
    title: 'התחברות',
    element: <Login />,
    notNavigateable: true,
  },
  {
    path: 'register',
    title: 'הרשמה',
    element: <Register />,
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
    path: '/admin',
    element: (
      <ProtectedRoute requireAdmin={true}>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<Loader />}>
            <Overview />
          </Suspense>
        ),
      },
      {
        path: 'projects',
        element: (
          <Suspense fallback={<Loader />}>
            <ProjectsManagement />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<Loader />}>
            <CategoriesManagement />
          </Suspense>
        ),
      },
      {
        path: 'testimonials',
        element: (
          <Suspense fallback={<Loader />}>
            <TestimonialsManagement />
          </Suspense>
        ),
      },
      {
        path: 'contacts',
        element: (
          <Suspense fallback={<Loader />}>
            <ContactsManagement />
          </Suspense>
        ),
      },
    ],
  },
]);

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" dir="rtl">
        <Loader />
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;
