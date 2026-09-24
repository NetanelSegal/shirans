import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import ScreenProvider from './contexts/ScreenProvider';
import { AuthProvider } from './contexts/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { queryClient } from './lib/queryClient';
import { ProtectedRoute } from './components/Auth/ProtectedRoute'; // Import ProtectedRoute
import Layout from './components/Layout';
import PageLoader from './components/Loader/PageLoader';
import { LoadingState } from './components/DataState';
import { AdminTableSkeleton } from './components/skeletons';
import apiClient from './utils/apiClient';
import { urls } from './constants/urls';
import { USE_FILE_DATA } from './constants/dataSource';
import { SERVICE_PAGES } from './data/service-pages';
import { SITE_CONFIG } from './constants/siteConfig';

const Home = lazy(() => import('./pages/Home'));
const Process = lazy(() => import('./pages/Process'));
const Services = lazy(() => import('./pages/Services'));
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
const LandingCalculator = lazy(() => import('./pages/LandingCalculator'));
const CalculatorResult = lazy(() => import('./pages/CalculatorResult'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const Blog = lazy(() => import('./pages/Blog'));
const Article = lazy(() => import('./pages/Article'));
const ArticlesManagement = lazy(() => import('./pages/Admin/ArticlesManagement'));
const CalculatorLeadsManagement = lazy(
  () => import('./pages/Admin/CalculatorLeadsManagement')
);
const CalculatorConfigManagement = lazy(
  () => import('./pages/Admin/CalculatorConfigManagement')
);

const pingHealth = async () => {
  try {
    await apiClient.get(urls.health);
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
    path: 'services',
    title: 'שירותים',
    element: <Services />,
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
    path: 'about',
    title: 'אודות',
    element: <About />,
  },
  {
    path: 'projects/:id',
    element: <Project />,
    notNavigateable: true,
  },
  {
    path: 'contact',
    title: 'צור קשר',
    element: <Contact />,
  },
  {
    path: 'blog',
    title: 'מרכז הידע',
    element: <Blog />,
  },
  {
    path: 'blog/:slug',
    element: <Article />,
    notNavigateable: true,
  },
  // A page per service, at its own top-level URL (see data/service-pages.ts).
  ...SERVICE_PAGES.map((page) => ({
    path: page.slug,
    title: page.title,
    element: <ServiceDetail />,
    notNavigateable: true,
  })),
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
  {
    path: 'calculator/result',
    title: 'תוצאת המחשבון',
    element: <CalculatorResult />,
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
        <Suspense fallback={<PageLoader />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<LoadingState />}>
            <Overview />
          </Suspense>
        ),
      },
      {
        path: 'projects',
        element: (
          <Suspense fallback={<AdminTableSkeleton searchable />}>
            <ProjectsManagement />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<LoadingState />}>
            <CategoriesManagement />
          </Suspense>
        ),
      },
      {
        path: 'testimonials',
        element: (
          <Suspense fallback={<LoadingState />}>
            <TestimonialsManagement />
          </Suspense>
        ),
      },
      {
        path: 'articles',
        element: (
          <Suspense fallback={<AdminTableSkeleton searchable />}>
            <ArticlesManagement />
          </Suspense>
        ),
      },
      {
        path: 'contacts',
        element: (
          <Suspense fallback={<LoadingState />}>
            <ContactsManagement />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<LoadingState />}>
            <UsersManagement />
          </Suspense>
        ),
      },
      {
        path: 'calculator-leads',
        element: (
          <Suspense fallback={<LoadingState />}>
            <CalculatorLeadsManagement />
          </Suspense>
        ),
      },
      {
        path: 'calculator-config',
        element: (
          <Suspense fallback={<LoadingState />}>
            <CalculatorConfigManagement />
          </Suspense>
        ),
      },
    ],
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default App;
