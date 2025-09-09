import type { CategoryNote } from "./category";

export interface Note {
    id: number;
    name: string;
    description: string;
    category: CategoryNote;
    user_id: number;
  }
  export interface CreateNote {
    name: string;
    description: string;
    category: number;
  }
  
 export  interface NoteFormData {
    name: string;
    description: string;
    category: number;
  }