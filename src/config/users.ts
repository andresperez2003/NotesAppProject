// Usuarios hardcodeados para pruebas del frontend
export const MOCK_USERS = [
  {
    id: 1,
    name: 'Administrador',
    email: 'admin@example.com',
    password: 'Admin2024!',
    role: 'admin' as const,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Usuario Demo',
    email: 'user@example.com',
    password: 'User2024!',
    role: 'user' as const,
    created_at: '2024-01-02T00:00:00Z'
  }
];

export const findUserByCredentials = (email: string, password: string) => {
  return MOCK_USERS.find(user => 
    user.email === email && user.password === password
  );
};

export const findUserByEmail = (email: string) => {
  return MOCK_USERS.find(user => user.email === email);
};
