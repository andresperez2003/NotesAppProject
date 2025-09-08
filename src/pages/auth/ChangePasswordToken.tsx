import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Swal from 'sweetalert2';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import '../../styles/Login.css';
import { confirmPasswordReset } from '../../services/users';

interface ChangeFormData {
  password: string;
  confirmPassword: string;
}

const schema = yup.object({
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

const ChangePasswordToken: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const [passwordValue, setPasswordValue] = useState<string>('');

  const requirements = useMemo(() => {
    return [
      { key: 'lower', label: 'Minúsculas', test: /[a-z]/.test(passwordValue) },
      { key: 'upper', label: 'Mayúsculas', test: /[A-Z]/.test(passwordValue) },
      { key: 'digit', label: 'Números', test: /\d/.test(passwordValue) },
      { key: 'special', label: 'Caracter especial (@$!%*?&)', test: /[@$!%*?&]/.test(passwordValue) },
      { key: 'length', label: 'Al menos 8 caracteres', test: passwordValue.length >= 8 },
    ];
  }, [passwordValue]);

  const tokenFromParams = useMemo(() => {
    return (
      searchParams.get('token') ||
      // Soportar URLs del tipo ?=token
      searchParams.get('') ||
      ''
    );
  }, [searchParams]);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ChangeFormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: ChangeFormData) => {
    if (!tokenFromParams) {
      await Swal.fire({ icon: 'error', title: 'Token inválido', text: 'Falta el token de recuperación' });
      return;
    }
    setSubmitting(true);
    try {
      const message = await confirmPasswordReset(tokenFromParams, data.password);
      await Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada',
        text: message || 'Password successful updated',
        confirmButtonText: 'Ok',
      });
      navigate('/login');
    } catch (err) {
      await Swal.fire({ icon: 'error', title: 'No se pudo actualizar', text: 'Intenta nuevamente' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="app-title">
        <h1>Cambiar contraseña</h1>
      </div>
      <div className="login-card">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="input-group">
            <label htmlFor="password" className="input-label">Nueva contraseña</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                onChange={(e) => {
                  setPasswordValue(e.target.value);
                }}
                className={`login-input ${errors.password ? 'error' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((s) => !s)}
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
            {errors.password && <span className="error-message">{errors.password.message}</span>}
            <div style={{ marginTop: 8, display: 'grid', rowGap: 6 }}>
              {requirements.map(req => (
                <div key={req.key} style={{ display: 'flex', alignItems: 'center', gap: 8, color: req.test ? 'green' : '#666' }}>
                  {req.test ? <FiCheckCircle size={16} /> : <FiXCircle size={16} />}
                  <span>{req.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">Confirmar contraseña</label>
            <div className="password-input-container">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                {...register('confirmPassword')}
                className={`login-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirm ? (
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
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
          </div>

          <button type="submit" disabled={submitting} className="login-button">
            {submitting ? 'Guardando...' : 'Enviar'}
          </button>
        </form>
        <div className="login-footer">
          <p className="footer-text">
            ¿Recordaste tu contraseña? <Link to="/login" className="login-link">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordToken;


