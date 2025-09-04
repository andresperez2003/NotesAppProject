
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
 
  Lock, 
  Eye, 
  EyeOff, 
  Settings,
  CheckCircle,
  AlertCircle,
  X,

} from 'lucide-react';
import '../../styles/User.css';
import type { EditUserFormData, PasswordFormData, UserRegistered } from '../../types/user';
import { changePassword, getCurrentUser } from '../../services/users';
import Swal from 'sweetalert2';


const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .min(6, 'La contraseña actual debe tener al menos 6 caracteres')
    .required('La contraseña actual es requerida'),
  newPassword: yup
    .string()
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres')
    .required('La nueva contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Las contraseñas deben coincidir')
    .required('Confirma tu nueva contraseña'),
}).required();

const editUserSchema = yup.object({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'El nombre no puede tener más de 80 caracteres')
    .required('El nombre es requerido'),
  email: yup
    .string()
    .email('Debe ser un correo electrónico válido')
    .required('El correo electrónico es requerido'),
}).required();

const User: React.FC = () => {
  const [user, setUser] = useState<UserRegistered | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: editErrors },
    reset: resetEdit,
    setValue: setEditValue,
  } = useForm<EditUserFormData>({
    resolver: yupResolver(editUserSchema),
  });

  // Obtener datos del usuario actual
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoadingProfile(true);
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        setError('Error al cargar el perfil del usuario');
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await changePassword(data);
      
      setSuccess('Contraseña actualizada exitosamente');
      Swal.fire({
        title: 'Contraseña actualizada exitosamente',
        icon: 'success',
        timer: 2000
      });
      resetPassword();
      setShowPasswordModal(false);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitEdit = async (data: EditUserFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simular actualización de usuario
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (user) {
        const updatedUser = {
          ...user,
          name: data.name,
          email: data.email
        };
        setUser(updatedUser);
      }
      
      setSuccess('Información actualizada exitosamente');
      resetEdit();
      setShowEditModal(false);
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al actualizar la información');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    resetPassword();
    setError('');
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    resetEdit();
    setError('');
  };

  const handleOpenEditModal = () => {
    if (user) {
      setEditValue('name', user.name);
      setEditValue('email', user.email);
    }
    setShowEditModal(true);
  };

  const getRoleText = (role: { id: number; name: string }) => {
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

  if (isLoadingProfile) {
    return (
      <motion.div 
        className="user-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="loading-container">
          <motion.div 
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="loading-text">Cargando información del usuario...</p>
        </div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div 
        className="user-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="error-container">
          <p className="error-text">No se pudo cargar la información del usuario</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="user-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="user-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="header-content">
          <h1 className="user-title">Mi Perfil</h1>
          <p className="user-subtitle">Gestiona tu información personal y seguridad</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="error-container"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="error-icon" />
            <p className="error-text">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div 
            className="success-container"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="success-icon" />
            <p className="success-text">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="user-profile-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="profile-header">
          <motion.div 
            className="profile-avatar"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="avatar-content">
              <span className="avatar-initials">{getInitials(user.name)}</span>
            </div>
            <div className="avatar-status">
              <div className="status-dot online"></div>
            </div>
          </motion.div>
          
          <div className="profile-info">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <motion.span 
              className={`role-badge ${user.role.name}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Shield className="role-icon" />
              {getRoleText(user.role)}
            </motion.span>
          </div>
        </div>

        {/* <div className="profile-details">
          <motion.div 
            className="detail-card"
            whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}
            transition={{ duration: 0.2 }}
          >
            <div className="detail-icon">
              <Calendar />
            </div>
            <div className="detail-label">Rol</div>
            <div className="detail-value">{user.role.name}</div>
            <div className="detail-label">Correo Electrónico</div>
            <div className="detail-value">{user.email}</div>
          </motion.div>
        </div> */}

        <motion.div 
          className="profile-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
{/*           <motion.button
            className="edit-profile-btn"
            onClick={handleOpenEditModal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Edit3 className="btn-icon" />
            <span>Editar Perfil</span>
          </motion.button> */}
          
          <motion.button
            className="change-password-btn"
            onClick={() => setShowPasswordModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Lock className="btn-icon" />
            <span>Cambiar Contraseña</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Modal para editar perfil */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div 
            className="modal-overlay" 
            onClick={handleCloseEditModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="modal-header">
                <div className="modal-title-section">
                  <UserIcon className="modal-title-icon" />
                  <h2 className="modal-title">Editar Perfil</h2>
                </div>
                <motion.button 
                  className="close-btn" 
                  onClick={handleCloseEditModal}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <X />
                </motion.button>
              </div>

              <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="modal-form">
                <div className="input-group">
                  <label htmlFor="editName" className="input-label">
                    <UserIcon className="input-icon" />
                    Nombre Completo
                  </label>
                  <input
                    id="editName"
                    type="text"
                    {...registerEdit('name')}
                    className={`modal-input ${editErrors.name ? 'error' : ''}`}
                    placeholder="Ingresa tu nombre completo"
                    maxLength={80}
                  />
                  {editErrors.name && (
                    <motion.span 
                      className="error-message"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {editErrors.name.message}
                    </motion.span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="editEmail" className="input-label">
                    <Mail className="input-icon" />
                    Correo Electrónico
                  </label>
                  <input
                    id="editEmail"
                    type="email"
                    {...registerEdit('email')}
                    className={`modal-input ${editErrors.email ? 'error' : ''}`}
                    placeholder="Ingresa tu correo electrónico"
                  />
                  {editErrors.email && (
                    <motion.span 
                      className="error-message"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {editErrors.email.message}
                    </motion.span>
                  )}
                </div>

                <div className="modal-actions">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="submit-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isLoading ? (
                      <motion.div 
                        className="loading-spinner-small"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <CheckCircle className="btn-icon" />
                    )}
                    {isLoading ? 'Actualizando...' : 'Actualizar Perfil'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="cancel-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Cancelar
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal para cambiar contraseña */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div 
            className="modal-overlay" 
            onClick={handleClosePasswordModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="modal-content" 
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="modal-header">
                <div className="modal-title-section">
                  <Settings className="modal-title-icon" />
                  <h2 className="modal-title">Cambiar Contraseña</h2>
                </div>
                <motion.button 
                  className="close-btn" 
                  onClick={handleClosePasswordModal}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <X />
                </motion.button>
              </div>

              <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="modal-form">
                <div className="input-group">
                  <label htmlFor="currentPassword" className="input-label">
                    <Lock className="input-icon" />
                    Contraseña Actual
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...registerPassword('currentPassword')}
                      className={`modal-input ${passwordErrors.currentPassword ? 'error' : ''}`}
                      placeholder="Ingresa tu contraseña actual"
                    />
                    <motion.button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showCurrentPassword ? <EyeOff /> : <Eye />}
                    </motion.button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <motion.span 
                      className="error-message"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {passwordErrors.currentPassword.message}
                    </motion.span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="newPassword" className="input-label">
                    <Lock className="input-icon" />
                    Nueva Contraseña
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      {...registerPassword('newPassword')}
                      className={`modal-input ${passwordErrors.newPassword ? 'error' : ''}`}
                      placeholder="Ingresa tu nueva contraseña"
                    />
                    <motion.button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showNewPassword ? <EyeOff /> : <Eye />}
                    </motion.button>
                  </div>
                  {passwordErrors.newPassword && (
                    <motion.span 
                      className="error-message"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {passwordErrors.newPassword.message}
                    </motion.span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword" className="input-label">
                    <Lock className="input-icon" />
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...registerPassword('confirmPassword')}
                      className={`modal-input ${passwordErrors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirma tu nueva contraseña"
                    />
                    <motion.button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </motion.button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <motion.span 
                      className="error-message"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {passwordErrors.confirmPassword.message}
                    </motion.span>
                  )}
                </div>

                <div className="modal-actions">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="submit-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isLoading ? (
                      <motion.div 
                        className="loading-spinner-small"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <CheckCircle className="btn-icon" />
                    )}
                    {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleClosePasswordModal}
                    className="cancel-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    Cancelar
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default User;