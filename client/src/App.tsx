import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import ScreenProvider from './contexts/ScreenProvider';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from './lib/queryClient';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/Auth/ProtectedRoute'; // Import ProtectedRoute
import Layout from './components/Layout';
import Loader from './components/Loader/Loader'; // Import Loader for Suspense fallback
import apiClient from './utils/apiClient';
import { urls } from './constants/urls';
import { USE_FILE_DATA } from './constants/dataSource';
import { SITE_CONFIG } from './constants/siteConfig';

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
const UsersManagement = lazy(() => import('./pages/Admin/UsersManagement'));
const Calculator = lazy(() => import('./pages/Calculator'));
const LandingCalculator = lazy(() => import('./pages/LandingCalculator'));
const CalculatorLeadsManagement = lazy(
  () => import('./pages/Admin/CalculatorLeadsManagement')
);
const CalculatorConfigManagement = lazy(
  () => import('./pages/Admin/CalculatorConfigManagement')
);

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
        <QueryClientProvider client={queryClient}>
          <ScreenProvider>
            <AppRoutes />
          </ScreenProvider>
        </QueryClientProvider>
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
  {
    path: 'calculator',
    title: 'מחשבון אומדן',
    element: <LandingCalculator />,
    showInNavbar: SITE_CONFIG.calculator.showInNavbar,
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
        <Suspense fallback={<Loader />}>
          <Dashboard />
        </Suspense>
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
      {
        path: 'users',
        element: (
          <Suspense fallback={<Loader />}>
            <UsersManagement />
          </Suspense>
        ),
      },
      {
        path: 'calculator',
        element: (
          <Suspense fallback={<Loader />}>
            <Calculator />
          </Suspense>
        ),
      },
      {
        path: 'calculator-leads',
        element: (
          <Suspense fallback={<Loader />}>
            <CalculatorLeadsManagement />
          </Suspense>
        ),
      },
      {
        path: 'calculator-config',
        element: (
          <Suspense fallback={<Loader />}>
            <CalculatorConfigManagement />
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
