import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../../styles/Login.css';
import { activateAccount } from '../../services/users';

const DIGITS = 6;

const ActivateAccount: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailFromParams = useMemo(() => {
    return (
      searchParams.get('email') ||
      // Soportar URLs del tipo ?=correo@dominio.com
      searchParams.get('') ||
      ''
    );
  }, [searchParams]);

  const [codeDigits, setCodeDigits] = useState<string[]>(Array.from({ length: DIGITS }, () => ''));
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // Foco en el primer input al cargar
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value === '') {
      setCodeDigits(prev => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    const onlyDigit = value.replace(/\D/g, '');
    if (onlyDigit.length === 0) return;

    setCodeDigits(prev => {
      const next = [...prev];
      next[index] = onlyDigit[0];
      return next;
    });

    // Mover foco al siguiente input
    if (index < DIGITS - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (codeDigits[index] === '' && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      return;
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && index < DIGITS - 1) {
      inputsRef.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, DIGITS);
    if (!pasted) return;
    const next = Array.from({ length: DIGITS }, (_, i) => pasted[i] || '');
    setCodeDigits(next);
    const lastFilled = Math.min(pasted.length, DIGITS) - 1;
    if (lastFilled >= 0) inputsRef.current[lastFilled]?.focus();
  };

  const fullCode = useMemo(() => codeDigits.join(''), [codeDigits]);
  const isValid = fullCode.length === DIGITS && emailFromParams.length > 3;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    setError('');
    try {
      const message = await activateAccount(emailFromParams, fullCode);
      await Swal.fire({
        icon: 'success',
        title: 'Cuenta activada',
        text: message || 'User activated',
        confirmButtonText: 'Ir al login',
      });
      navigate('/login');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error al activar la cuenta';
      setError(errMsg);
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo activar',
        text: errMsg,
        confirmButtonText: 'Entendido',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="app-title">
        <h1>Activar cuenta</h1>
      </div>

      <div className="login-card">
        <form onSubmit={onSubmit} className="login-form">
          {emailFromParams ? (
            <p className="footer-text" style={{ marginBottom: 12 }}>
              Enviamos un código a: <strong>{emailFromParams}</strong>
            </p>
          ) : (
            <div className="error-container">
              <p className="error-text">No se encontró el correo en la URL.</p>
            </div>
          )}

          {error && (
            <div className="error-container">
              <p className="error-text">{error}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
            {codeDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputsRef.current[idx] = el; }}
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className={`login-input${digit ? '' : ''}`}
                style={{ width: 50, textAlign: 'center', fontSize: 20 }}
                placeholder="•"
                aria-label={`Dígito ${idx + 1}`}
              />
            ))}
          </div>

          <button type="submit" disabled={!isValid || submitting} className="login-button">
            {submitting ? 'Verificando...' : 'Enviar'}
          </button>
        </form>

        <div className="login-footer">
          <p className="footer-text">
            ¿Recordaste tu contraseña?{' '}
            <Link to="/login" className="login-link">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;


