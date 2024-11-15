import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import ScreenProvider from './contexts/ScreenProvider';
import Home from './pages/Home';

function App() {
  return (
    <ScreenProvider>
      <AppRoutes />
    </ScreenProvider>
  );
}

export const appRoutes = [
  {
    path: '',
    title: 'בית',
    element: <Home />,
  },
  {
    path: 'about',
    title: 'עוד עלי',
    element: <div>About</div>,
  },
  {
    path: 'the-process',
    title: 'התהליך',
    element: <div>The Process</div>,
  },
  {
    path: 'projects',
    title: 'פרויקטים',
    element: <div>Projects</div>,
  },
  {
    path: 'contact',
    title: 'צור קשר',
    element: <div>Contact</div>,
  },
  {
    path: '*',
    title: '404',
    element: <div>404</div>,
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
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
