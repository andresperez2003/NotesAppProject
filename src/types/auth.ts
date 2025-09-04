import type { UserRegistered } from "./user";

export interface AuthState {
    isAuthenticated: boolean;
    user: UserRegistered | null;
    token: string | null;
  }

  export interface LoginResponse {
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

  export interface LoginFormData {
    email: string;
    password: string;
  }