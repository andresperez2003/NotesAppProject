export interface UserRegistered {
    id: number;
    name: string;
    email: string;
    role: {
      id: number;
      name: string;
    };
  }

export interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
export interface EditUserFormData {
    name: string;
    email: string;
  }

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
  }