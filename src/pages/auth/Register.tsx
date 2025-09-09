import React, { useMemo, useState } from 'react';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/Register.css';
import { registerUser } from '../../services/users';
import Swal from 'sweetalert2';

// Tipos TypeScript
interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}


// Esquema de validación
const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'El nombre no puede tener más de 80 caracteres')
    .required('El nombre es requerido'),
  email: yup
    .string()
    .email('El correo electrónico no es válido')
    .required('El correo electrónico es requerido'),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'La contraseña no cumple los requisitos'
    )
    .required('La contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Confirma tu contraseña'),
}).required();

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const passwordValue = watch('password') || '';
  const requirements = useMemo(() => {
    return [
      { key: 'lower', label: 'Minúsculas', test: /[a-z]/.test(passwordValue) },
      { key: 'upper', label: 'Mayúsculas', test: /[A-Z]/.test(passwordValue) },
      { key: 'digit', label: 'Números', test: /\d/.test(passwordValue) },
      { key: 'special', label: 'Caracter especial (@$!%*?&)', test: /[@$!%*?&]/.test(passwordValue) },
      { key: 'length', label: 'Al menos 8 caracteres', test: passwordValue.length >= 8 },
    ];
  }, [passwordValue]);



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const message = await registerUser(data);
      // Detener el loading antes de mostrar el SweetAlert
      setIsLoading(false);
      setSuccess(message || 'Cuenta creada. Revisa tu correo para activar tu cuenta.');
      await Swal.fire({
        title: 'Cuenta creada exitosamente',
        text: message || 'Revisa tu correo y sigue el enlace para activar tu cuenta.',
        icon: 'success',
        confirmButtonText: 'Ingresar código'
      });
      navigate(`/validation/email?=${encodeURIComponent(data.email)}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error: verifique sus datos';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <span className="loading-text">Creando cuenta...</span>
        </div>
      )}
      <div className="app-title">
        <h1>App de notas personales</h1>
      </div>
      
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Crear Cuenta</h1>
          <p className="register-subtitle">Únete a nuestra aplicación de notas</p>
        </div>

        {error && (
          <div className="error-container">
            <p className="error-text">{error}</p>
          </div>
        )}

        {success && (
          <div className="success-container">
            <p className="success-text">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="register-form">
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="name" className="input-label">
                Nombre Completo
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={`register-input ${errors.name ? 'error' : ''}`}
                placeholder="Tu nombre completo"
                maxLength={80}
              />
              {errors.name && (
                <span className="error-message">{errors.name.message}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`register-input ${errors.email ? 'error' : ''}`}
                placeholder="ejemplo@correo.com"
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Contraseña
              </label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`register-input ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
              <div style={{ marginTop: 8, display: 'grid', rowGap: 6 }}>
                {requirements.map(req => (
                  <div key={req.key} style={{ display: 'flex', alignItems: 'center', gap: 8, color: req.test ? 'green' : '#666' }}>
                    {req.test ? <FiCheckCircle size={16} /> : <FiXCircle size={16} />}
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">
                Confirmar Contraseña
              </label>
              <div className="password-input-container">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className={`register-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </div>
              {(() => {
                const pwd = watch('password') || '';
                const confirm = watch('confirmPassword') || '';
                const show = pwd.length > 0 && confirm.length > 0 && pwd !== confirm;
                return show ? (<span className="error-message">Las contraseñas no coinciden</span>) : null;
              })()}
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword.message}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="register-button"
          >
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="register-footer">
          <p className="footer-text">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="register-link">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
