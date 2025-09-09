import type { Category, CategoryFormData } from '../types/category';
import { PATH_BACKEND } from './paths';
import { authFetch } from './http';


const apiBackend = PATH_BACKEND;

export async function getCategories(): Promise<Category[]> {
  const response = await authFetch(`${apiBackend}/categories`, {
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
    throw new Error('Error al obtener las categorías');
  }
}

export async function createCategory(category: CategoryFormData):Promise<void>{
  const response = await authFetch(`${apiBackend}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(category)
  });

  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error al crear la categoría');
  }
}
export async function updateCategory(categoryId: number, category: CategoryFormData):Promise<void>{
  const response = await authFetch(`${apiBackend}/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(category)
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error al actualizar la categoría');
  }
}
export async function deleteCategory(categoryId: number):Promise<void>{
  const response = await authFetch(`${apiBackend}/categories/${categoryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error al eliminar la categoría');
  }
}
export async function getCategoryById(categoryId: number):Promise<Category>{
  const response = await authFetch(`${apiBackend}/categories/${categoryId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('Error al obtener la categoría');
  }
}








