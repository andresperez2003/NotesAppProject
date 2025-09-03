import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { findUserByCredentials } from '../../config/users';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/Login.css';
import type { UserRegistered } from '../../types/user';

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
  const apiBackend = import.meta.env.VITE_PATH_BACKEND;
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

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    
  try {

      const response = await fetch(`${apiBackend}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (response.ok) {
        const result: LoginResponse = await response.json();
        console.log(result);
        localStorage.setItem('token', result.token);
        const user: UserRegistered = {
          ...result.user,
          role: result.user.role
        };

        login(result.token, user);
        

        // Redirigir según el rol del usuario
        if (result.user.role.name === 'admin') {
            navigate('/admin');
        } else {
          navigate('/dashboard');
        } 
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
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
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`login-input ${errors.password ? 'error' : ''}`}
              placeholder="••••••••"
            />
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
        </div>
      </div>
    </div>
  );
};

export default Login;
