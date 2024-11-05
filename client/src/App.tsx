import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
  },
]);
function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
