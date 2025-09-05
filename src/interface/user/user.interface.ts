export interface User {
  id: number;
  username: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
  
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  id_rol: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    role: {
      id: number;
      name: string;
    };
  };
}