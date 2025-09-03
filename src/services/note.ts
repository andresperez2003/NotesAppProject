import type { CreateNote, Note, NoteFormData } from "../types/note";

const apiBackend = import.meta.env.VITE_PATH_BACKEND;

export async function createNote(note: CreateNote):Promise<void>{
    const response = await fetch(`${apiBackend}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(note)
    });
  
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error al crear la nota');
    }
  }

  export async function deleteNote(noteId: number):Promise<void>{
    const response = await fetch(`${apiBackend}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error al eliminar la nota');
    }
  }
  

  export async function getNotes(): Promise<Note[]> {
    const response = await fetch(`${apiBackend}/notes`, {
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
      throw new Error('Error al obtener las notas');
    }
    
  }

  export async function updateNote(notedId: number, note:NoteFormData): Promise<void>{
    const response = await fetch(`${apiBackend}/notes/${notedId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(note)
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error al actualizar la nota');
    }

  }
  
  