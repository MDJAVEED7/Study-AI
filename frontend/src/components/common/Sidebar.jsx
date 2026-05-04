import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { LayoutDashboard, FileText, User, LogOut, BookOpen, X, Dock } from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    {
      to: '/dashboard',
      icon: LayoutDashboard,
      text: 'Dashboard',
    },
    {
      to: '/documents',
      icon: FileText,
      text: 'Documents',
    },
    {
      to: '/flashcards',
      icon: Dock,
      text: 'Flashcards',
    },
    {
      to: '/profile',
      icon: User,
      text: 'Profile',
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black md:hidden transition-opacity duration-200 ${isSidebarOpen ? 'opacity-30' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleSidebar}
        aria-hidden="true"
      ></div>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-border shadow-lg z-50 md:relative md:w-64 md:shrink-0 md:flex md:flex-col md:translate-x-0 transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo and Close button for mobile */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary text-white shadow-md">
              <BookOpen className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Notes Drill</h1>
          </div>
          <button onClick={toggleSidebar} className="md:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-6 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' 
                    : 'text-foreground hover:bg-gray-100 text-gray-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={20}
                    strokeWidth={2}
                    className={`transition-transform duration-200 ${isActive ? 'text-white' : 'text-primary group-hover:scale-110'}`}
                  />
                  <span className="font-medium text-sm">{link.text}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="px-2 py-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <LogOut
              size={20}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
