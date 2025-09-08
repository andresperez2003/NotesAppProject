import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/Login.css';
import { requestPasswordReset } from '../../services/users';

interface ForgotFormData {
  email: string;
}

const schema = yup.object({
  email: yup.string().email('Correo inválido').required('El correo es requerido'),
}).required();

const ForgotPassword: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: ForgotFormData) => {
    setSubmitting(true);
    try {
      await requestPasswordReset(data.email);
      await Swal.fire({
        icon: 'success',
        title: 'Solicitud enviada',
        text: 'Revisa tu correo para cambiar tu contraseña',
        confirmButtonText: 'Entendido',
      });
      navigate('/login');
    } catch (err) {
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo enviar',
        text: 'Intenta nuevamente más tarde',
        confirmButtonText: 'Entendido',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="app-title">
        <h1>Recuperar contraseña</h1>
      </div>
      <div className="login-card">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`login-input ${errors.email ? 'error' : ''}`}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>
          <button type="submit" disabled={submitting} className="login-button">
            {submitting ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
        <div className="login-footer">
          <p className="footer-text">
            ¿Ya la recordaste? <Link to="/login" className="login-link">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;


