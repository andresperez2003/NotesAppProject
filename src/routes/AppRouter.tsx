import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import User from "../pages/user/User";
import Admin from "../pages/admin/Admin";
import Layout from "../components/Layout";
import { useAuth } from "../hooks/useAuth";
import Note from "../pages/note/Note";
import Category from "../pages/category/Category";

const AppRouter = () => {
  const { isAuthenticated, user } = useAuth();
  


  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={
        isAuthenticated && user ? 
        (user.role.name === 'admin' ? <Navigate to="/dashboard/admin" /> : <Navigate to="/dashboard/notes" />) : 
        <Login />
      } />
      <Route path="/login" element={
        isAuthenticated && user ? 
        (user.role.name === 'admin' ? <Navigate to="/dashboard/admin" /> : <Navigate to="/dashboard/notes" />) : 
        <Login />
      } />
      <Route path="/register" element={
        isAuthenticated && user ? 
        (user.role.name === 'admin' ? <Navigate to="/dashboard/admin" /> : <Navigate to="/dashboard/notes" />) : 
        <Register />
      } />
      
      {/* Rutas protegidas con Layout */}
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated && user ? (
            <Layout 
              userRole={user.role.name}
              userName={user.name}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        {/* Rutas para usuarios normales */}
        <Route path="notes" element={<Note />} />
        <Route path="categories" element={<Category />} />
        <Route path="user" element={<User />} />
        
        {/* Rutas para administradores */}
        <Route path="admin" element={
          user?.role.name === 'admin' ? <Admin /> : <Navigate to="/dashboard/notes" />
        } />
        
        {/* Redirección por defecto según rol */}
        <Route index element={
          user?.role.name === 'admin' ? 
          <Navigate to="admin" /> : 
          <Navigate to="notes" />
        } />
      </Route>

      {/* Redirecciones para rutas sin /dashboard */}
      <Route path="/notes" element={<Navigate to="/dashboard/notes" />} />
      <Route path="/categories" element={<Navigate to="/dashboard/categories" />} />
      <Route path="/user" element={<Navigate to="/dashboard/user" />} />
      <Route path="/admin" element={<Navigate to="/dashboard/admin" />} />
      
      {/* Ruta por defecto si no existe */}
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  );
};

export default AppRouter;
