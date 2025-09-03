import type { EditUserFormData, PasswordFormData, RegisterFormData, UserRegistered } from "../types/user";
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


export async function registerUser(user: RegisterFormData): Promise<void> {
  const response = await fetch(`${apiBackend}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error al registrar el usuario');
  }
}