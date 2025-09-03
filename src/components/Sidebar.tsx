import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  FolderOpen, 
  Users, 
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import '../styles/Sidebar.css';

interface SidebarProps {
  userRole: 'admin' | 'user';
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, userName }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const { logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {

    logout();
    

      
    navigate('/login', { replace: true });
  };

  const userMenuItems = [
    {
      path: '/dashboard/notes',
      label: 'Notas',
      icon: FileText,
    },
    {
      path: '/dashboard/categories',
      label: 'Categorías',
      icon: FolderOpen,
    },
    {
      path: '/dashboard/user',
      label: 'Mi Perfil',
      icon: User,
    }
  ];

  const adminMenuItems = [
    {
      path: '/dashboard/admin',
      label: 'Usuarios',
      icon: Users,
    },
    {
      path: '/dashboard/user',
      label: 'Mi Perfil',
      icon: User,
    }
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;
  


  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      pointerEvents: "auto"
    },
    closed: {
      opacity: 0,
      pointerEvents: "none"
    }
  };

  return (
    <>
      {/* Botón de menú móvil */}
      <motion.button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Menu />
      </motion.button>

      {/* Overlay para móvil */}
      <motion.div
        className="sidebar-overlay"
        variants={overlayVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        {/* Header del sidebar */}
        <div className="sidebar-header">
          <div className="sidebar-user">
            <div className="user-avatar">
              <div className="avatar-content">
                <span className="avatar-initials">{getInitials(userName)}</span>
              </div>
            </div>
                         <div className="user-info">
               <h3 className="user-name">{userName}</h3>
             </div>
          </div>
          
          {/* Botón cerrar para móvil */}
          <motion.button
            className="close-btn"
            onClick={() => setIsOpen(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <X />
          </motion.button>
        </div>

        {/* Navegación */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4 className="nav-title">Navegación</h4>
            <ul className="nav-list">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        className="nav-icon"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon />
                      </motion.div>
                      <div className="nav-content">
                        <span className="nav-label">{item.label}</span>
                      </div>
                     
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Botón de salir */}
        <div className="sidebar-footer">
          <motion.button
            className="logout-btn"
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <LogOut className="logout-icon" />
            <span>Cerrar Sesión</span>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
