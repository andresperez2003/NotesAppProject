export interface Category {
    id: number;
    name: string;
    user_id: number;
    created_at: string;
}

export interface CategoryNote {
    id: number;
    name: string;
}

export interface CategoryNoteFormData {
    name: string;
}

export interface CategoryFormData {
    name: string;
}