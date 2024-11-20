import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
export default function Layout() {
  return (
    <>
      <Navbar />
      <div className='px-page-all overflow-hidden'>
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
