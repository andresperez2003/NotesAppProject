import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import '../../styles/Login.css';

import { loginUser } from '../../services/users';

// Tipos TypeScript
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: {
      id: number;
      name: string;
    };
  };
}

// Esquema de validación
const loginSchema = yup.object({
  email: yup
    .string()
    .email('El correo electrónico no es válido')
    .required('El correo electrónico es requerido'),
  password: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
}).required();

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    
  try {
      const result: LoginResponse = await loginUser(data.email, data.password);
      const user = {
        ...result.user,
        role: result.user.role
      };

        login(result.token, user);
        

        // Redirigir según el rol del usuario
        if (result.user.role.name === 'admin') {
            navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/notes');
        } 
      
    } catch (err) {
      setError('Error: verifique sus credenciales');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <span className="loading-text">Iniciando sesión...</span>
        </div>
      )}
      <div className="app-title">
        <h1>App de notas personales</h1>
      </div>
      
      <div className="login-card">


        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          {error && (
            <div className="error-container">
              <p className="error-text">{error}</p>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`login-input ${errors.email ? 'error' : ''}`}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Contraseña
            </label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                className={`login-input ${errors.password ? 'error' : ''}`}
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
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="login-button"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="login-link">
              Regístrate aquí
            </Link>
          </p>
          <p className="footer-text" style={{ marginTop: 8 }}>
            <Link to="/forgot-password" className="login-link">
              Olvidé mi contraseña
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
