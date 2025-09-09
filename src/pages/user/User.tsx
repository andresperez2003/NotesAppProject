
import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, 
 
  Lock, 
  Eye, 
  EyeOff, 
  Settings,
  CheckCircle,
  AlertCircle,
  X,

} from 'lucide-react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import '../../styles/User.css';
import type { PasswordFormData, UserRegistered } from '../../types/user';
import { changePassword, getCurrentUser } from '../../services/users';
import Swal from 'sweetalert2';


const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('La contraseña actual es requerida'),
  newPassword: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'La contraseña no cumple los requisitos'
    )
    .required('La nueva contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Las contraseñas deben coincidir')
    .required('Confirma tu nueva contraseña'),
}).required();



const User: React.FC = () => {
  const [user, setUser] = useState<UserRegistered | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  // Mensajes ahora con SweetAlert
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  const newPasswordValue = watchPassword('newPassword') || '';
  const confirmPasswordValue = watchPassword('confirmPassword') || '';
  const requirements = useMemo(() => {
    return [
      { key: 'lower', label: 'Minúsculas', test: /[a-z]/.test(newPasswordValue) },
      { key: 'upper', label: 'Mayúsculas', test: /[A-Z]/.test(newPasswordValue) },
      { key: 'digit', label: 'Números', test: /\d/.test(newPasswordValue) },
      { key: 'special', label: 'Caracter especial (@$!%*?&)', test: /[@$!%*?&]/.test(newPasswordValue) },
      { key: 'length', label: 'Al menos 8 caracteres', test: newPasswordValue.length >= 8 },
    ];
  }, [newPasswordValue]);

  // Obtener datos del usuario actual
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setIsLoadingProfile(true);
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        await Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar el perfil del usuario', confirmButtonText: 'Entendido' });
      } finally {
        setIsLoadingProfile(false);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsLoading(true);
    

    try {
      await changePassword(data);
      
      await Swal.fire({
        title: 'Contraseña actualizada exitosamente',
        icon: 'success',
        timer: 2000
      });
      resetPassword();
      setShowPasswordModal(false);
      
    } catch (err) {
      await Swal.fire({ icon: 'error', title: 'Error', text: 'Error al actualizar la contraseña', confirmButtonText: 'Entendido' });
    } finally {
      setIsLoading(false);
    }
  };





  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    resetPassword();
    
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

      {/* Alertas inline reemplazadas por SweetAlert */}

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
                  <div style={{ marginTop: 8, display: 'grid', rowGap: 6 }}>
                    {requirements.map(req => (
                      <div key={req.key} style={{ display: 'flex', alignItems: 'center', gap: 8, color: req.test ? 'green' : '#666' }}>
                        {req.test ? <FiCheckCircle size={16} /> : <FiXCircle size={16} />}
                        <span>{req.label}</span>
                      </div>
                    ))}
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
                  {newPasswordValue.length > 0 && confirmPasswordValue.length > 0 && newPasswordValue !== confirmPasswordValue ? (
                    <span className="error-message">Las contraseñas no coinciden</span>
                  ) : null}
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