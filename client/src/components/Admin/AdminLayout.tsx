import { useState, ReactNode } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import srcShiranLogo from '../../assets/shiran_logo.svg';
import { useScreenContext } from '../../contexts/ScreenProvider';
import AdminNavbar from './AdminNavbar'; // To be created
import { useEffect } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isSmallScreen } = useScreenContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isSmallScreen) {
      setIsSidebarOpen(false);
    }
  }, [location, isSmallScreen]);

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 z-50 h-full bg-primary text-white transition-all duration-300 ease-in-out ${
          isSmallScreen
            ? isSidebarOpen
              ? 'right-0 w-64'
              : '-right-64 w-64'
            : 'w-64' // Desktop always open
        } ${!isSmallScreen && 'flex-shrink-0'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-primary-light">
          <Link to="/admin">
            <img className="h-10" src={srcShiranLogo} alt="shiran logo icon" />
          </Link>
          {isSmallScreen && (
            <button onClick={() => setIsSidebarOpen(false)} className="text-white text-2xl">
              <i className="fa-solid fa-times" />
            </button>
          )}
        </div>
        <nav className="mt-5">
          <ul>
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg mx-2 p-4 hover:bg-primary/80 transition-colors duration-200 ${
                    isActive ? 'bg-secondary text-primary font-bold' : 'text-white'
                  }`
                }
              >
                <i className="fa-solid fa-home" aria-hidden />
                <span>סקירה כללית</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/projects"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg mx-2 p-4 hover:bg-primary/80 transition-colors duration-200 ${
                    isActive ? 'bg-secondary text-primary font-bold' : 'text-white'
                  }`
                }
              >
                <i className="fa-solid fa-folder" aria-hidden />
                <span>פרויקטים</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/categories"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg mx-2 p-4 hover:bg-primary/80 transition-colors duration-200 ${
                    isActive ? 'bg-secondary text-primary font-bold' : 'text-white'
                  }`
                }
              >
                <i className="fa-solid fa-tags" aria-hidden />
                <span>קטגוריות</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/testimonials"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg mx-2 p-4 hover:bg-primary/80 transition-colors duration-200 ${
                    isActive ? 'bg-secondary text-primary font-bold' : 'text-white'
                  }`
                }
              >
                <i className="fa-solid fa-star" aria-hidden />
                <span>המלצות</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/contacts"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg mx-2 p-4 hover:bg-primary/80 transition-colors duration-200 ${
                    isActive ? 'bg-secondary text-primary font-bold' : 'text-white'
                  }`
                }
              >
                <i className="fa-solid fa-envelope" aria-hidden />
                <span>פניות צור קשר</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && isSmallScreen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content - mr-64 reserves space for fixed sidebar on right (RTL) */}
      <div className={`flex min-w-0 flex-1 flex-col overflow-x-hidden ${!isSmallScreen ? 'mr-64' : ''}`}>
        <AdminNavbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
