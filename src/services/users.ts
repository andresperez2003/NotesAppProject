import type { LoginResponse } from "../types/auth";
import type { PasswordFormData, RegisterFormData, UserRegistered } from "../types/user";
import { PATH_BACKEND } from "./paths";

const apiBackend = PATH_BACKEND;

export async function getUsers(): Promise<UserRegistered[]> {
  const response = await fetch(`${apiBackend}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (response.ok) {
    const data = await response.json();
    return data.data;
  } else {
    throw new Error('Error al obtener los usuarios');
  }
}

export async function changePassword(password: PasswordFormData):Promise<void>{
  const response = await fetch(`${apiBackend}/auth/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(password)
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error al cambiar la contraseña');
  }
}

export async function getCurrentUser(): Promise<UserRegistered> {
  const response = await fetch(`${apiBackend}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (response.ok) {
    const data = await response.json();
    return data.data;
  } else {
    throw new Error('Error al obtener el perfil del usuario');
  }
}


export async function registerUser(user: RegisterFormData): Promise<string> {
  const response = await fetch(`${apiBackend}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (response.ok) {
    try {
      const data = await response.json();
      return data?.message || 'Registro exitoso';
    } catch (_) {
      return 'Registro exitoso';
    }
  } else {
    try {
      const data = await response.json();
      throw new Error(data?.message || 'Error al registrar el usuario');
    } catch (_) {
      throw new Error('Error al registrar el usuario');
    }
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${apiBackend}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });

  if (response.ok) {
    const result: LoginResponse = await response.json();
    console.log(result);
    localStorage.setItem('token', result.token);

    return result;
  } else {
    // Intentar obtener el mensaje de error del backend de forma robusta
    let message = 'Error al iniciar sesión';
    try {
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        const data: any = await response.json();
        const possibleMessage =
          data?.message ??
          data?.error ??
          (Array.isArray(data?.errors) ? (data.errors[0]?.message || data.errors[0]) : null) ??
          (data?.errors && typeof data.errors === 'object' ? Object.values(data.errors)[0] : null) ??
          data?.detail ??
          data?.title;
        if (typeof possibleMessage === 'string') {
          message = possibleMessage;
        } else if (Array.isArray(possibleMessage)) {
          message = String(possibleMessage[0] ?? message);
        }
      } else {
        const text = await response.text();
        if (text && text.trim().length > 0) {
          message = text.trim();
        }
      }
    } catch (_err) {
      // Mantener mensaje por defecto si algo falla al parsear
    }
    throw new Error(message);
  }
}

export async function activateAccount(email: string, code: string): Promise<string> {
  const encodedEmail = encodeURIComponent(email);
  const response = await fetch(`${apiBackend}/auth/activate-account?email=${encodedEmail}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code })
  });

  if (response.ok) {
    try {
      const data = await response.json();
      return data?.message || 'User activated';
    } catch (_) {
      return 'User activated';
    }
  } else {
    let message = 'Error al activar la cuenta';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch (_err) {
      // ignore
    }
    throw new Error(message);
  }
}

export async function requestPasswordReset(email: string): Promise<void> {
  const encodedEmail = encodeURIComponent(email);
  const response = await fetch(`${apiBackend}/auth/reset-password?email=${encodedEmail}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Error al solicitar el cambio de contraseña');
  }
}

export async function confirmPasswordReset(token: string, newPassword: string): Promise<string> {
  const encodedToken = encodeURIComponent(token);
  const response = await fetch(`${apiBackend}/auth/confirm-reset-password?token=${encodedToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ newPassword: newPassword })
  });
  if (response.ok) {
    try {
      const data = await response.json();
      return data?.message || 'Password successful updated';
    } catch (_) {
      return 'Password successful updated';
    }
  } else {
    let message = 'Error al actualizar la contraseña';
    try {
      const data = await response.json();
      message = data?.message || message;
    } catch (_) {}
    throw new Error(message);
  }
}