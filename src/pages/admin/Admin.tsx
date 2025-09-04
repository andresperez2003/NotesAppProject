import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 

  Mail,

  Shield,
  ChevronLeft,
  ChevronRight,

} from 'lucide-react';
import '../../styles/Admin.css';
import { getUsers } from '../../services/users';
import type { UserRegistered } from '../../types/user';
import type { Rol } from '../../types/rol';


const Admin: React.FC = () => {
  const [users, setUsers] = useState<UserRegistered[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);

  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const users = await getUsers();
        setUsers(users as UserRegistered[]);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesName = user.name.toLowerCase().includes(filterName.toLowerCase()) ||
                       user.email.toLowerCase().includes(filterName.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.name === filterRole;
    return matchesName && matchesRole;
  });

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const getRoleText = (role: Rol) => {
    return role.name === 'admin' ? 'Administrador' : 'Usuario';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div 
      className="admin-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="admin-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="header-content">
          <h1 className="admin-title">Usuarios Registrados</h1>
        </div>
      </motion.div>

      <motion.div 
        className="admin-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Filtros y controles */}
        <div className="controls-section">
          <div className="search-filter-container">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-container">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'user')}
                className="filter-select"
              >
                <option value="all">Todos los roles</option>
                <option value="admin">Administradores</option>
                <option value="user">Usuarios</option>
              </select>
            </div>
            <div className="filter-container">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="filter-select"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
          {/* Leyenda de colores por rol */}
          <div className="legend">
            <div className="legend-item">
              <span className="legend-dot admin"></span>
              <span className="legend-text">Admin</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot user"></span>
              <span className="legend-text">Usuario</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isLoadingUsers && (
            <motion.div 
              className="loading-spinner-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="loading-text">Cargando usuarios...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de usuarios */}
        {!isLoadingUsers && (
          <div className="users-list">
            {currentUsers.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Users className="empty-icon" />
                <h3 className="empty-title">No hay usuarios</h3>
                <p className="empty-description">
                  {filterName || filterRole !== 'all' || filterStatus !== 'all' 
                    ? 'No se encontraron usuarios con esos filtros' 
                    : 'No hay usuarios registrados en el sistema'
                  }
                </p>
              </motion.div>
            ) : (
              <>
                {currentUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    className={`user-item ${user.role.name}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
                  >
                    <div className="user-info">
                      <div className="user-avatar">
                        <div className="avatar-content">
                          <span className="avatar-initials">{getInitials(user.name)}</span>
                        </div>
                      </div>
                      <div className="user-details">
                        <div className="user-name" title={user.name}>
                          {user.name}
                        </div>
                        <div className="user-email" title={user.email}>
                          <Mail className="meta-icon" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Paginación */}
        {!isLoadingUsers && totalPages > 1 && (
          <motion.div 
            className="pagination-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft />
            </motion.button>
            
            <div className="page-info">
              <span className="page-text">
                Página {currentPage} de {totalPages}
              </span>
              <span className="total-text">
                {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <motion.button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
              whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight />
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Admin;
