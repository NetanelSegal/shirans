import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import ScreenProvider from './contexts/ScreenProvider';
import Home from './pages/Home';
import Process from './pages/Process';
import Projects from './pages/Projects';
import Project from './pages/Project';
// import About from './pages/About';

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
  // {
  //   path: 'about',
  //   title: 'עוד עלי',
  //   element: <About />,
  // },
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
    element: <div>Contact</div>,
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
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
