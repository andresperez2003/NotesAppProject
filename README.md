# 📝 Aplicación de Notas

Una aplicación web moderna para gestionar notas y categorías, con sistema de autenticación y roles de usuario.

## 🚀 Características

### 👥 Sistema de Usuarios
- **Administrador**: Puede ver todos los usuarios registrados
- **Usuario Normal**: Puede crear y gestionar notas y categorías

### 📋 Funcionalidades
- ✅ **Autenticación** con login/registro
- ✅ **Sidebar** responsive con navegación
- ✅ **Gestión de Notas** (crear, editar, eliminar, ver detalles)
- ✅ **Gestión de Categorías** (crear, editar, eliminar)
- ✅ **Gestión de Usuarios** (solo para administradores)
- ✅ **Filtros y búsqueda** en todas las secciones
- ✅ **Paginación** en listas
- ✅ **Diseño responsive** para móviles y desktop

## 🎨 Tecnologías Utilizadas

- **React 18** con TypeScript
- **React Router DOM** para navegación
- **React Hook Form** + **Yup** para formularios
- **Framer Motion** para animaciones
- **Lucide React** para iconos
- **CSS Modules** para estilos

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd note-app
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```
```


## 🗂️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Layout.tsx      # Layout principal con sidebar
│   └── Sidebar.tsx     # Navegación lateral
├── pages/              # Páginas de la aplicación
│   ├── auth/           # Autenticación
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── admin/          # Panel de administrador
│   │   └── Admin.tsx
│   ├── category/       # Gestión de categorías
│   │   └── Category.tsx
│   ├── note/           # Gestión de notas
│   │   └── Note.tsx
│   └── user/           # Perfil de usuario
│       └── User.tsx
├── routes/             # Configuración de rutas
│   └── AppRouter.tsx
├── styles/             # Archivos CSS
└── config/             # Configuraciones
    └── users.ts        # Usuarios hardcodeados
```

## 🎯 Funcionalidades por Rol

### 👑 Administrador
- **Ruta:** `/dashboard/admin`
- **Funcionalidades:**
  - Ver lista de usuarios registrados
  - Filtrar por nombre, rol y estado
  - Paginación (3 usuarios por página)
  - Ver detalles de usuarios

### 👤 Usuario Normal
- **Rutas:** `/dashboard/notes` y `/dashboard/categories`
- **Funcionalidades:**
  - Crear, editar y eliminar notas
  - Crear, editar y eliminar categorías
  - Filtrar y buscar
  - Paginación en ambas secciones

## 🎨 Diseño

### 🎨 Paleta de Colores
- **Primarios:** `#1A2A80`, `#3B38A0`
- **Secundarios:** `#7A85C1`, `#B2B0E8`
- **Éxito:** `#10B981`
- **Error:** `#EF4444`

### 📱 Responsive Design
- **Desktop:** Sidebar fijo a la izquierda
- **Móvil:** Sidebar deslizable con overlay
- **Tablet:** Adaptación automática

## 🔄 Flujo de Navegación

1. **Login** → Verificar credenciales
2. **Redirección automática** según rol:
   - **Admin** → `/dashboard/admin`
   - **Usuario** → `/dashboard/notes`
3. **Sidebar** muestra opciones según rol
4. **Navegación** entre secciones
5. **Logout** limpia localStorage

## 🛠️ Desarrollo

### 📝 Agregar Nuevas Funcionalidades
1. Crear componente en `src/pages/`
2. Agregar ruta en `src/routes/AppRouter.tsx`
3. Actualizar sidebar si es necesario
4. Agregar estilos en `src/styles/`

### 🎨 Modificar Estilos
- Variables CSS en `:root` de cada archivo CSS
- Diseño consistente con la paleta de colores
- Responsive design obligatorio

## 🚀 Despliegue

```bash
# Construir para producción
npm run build

# Servir archivos estáticos
npm run preview
```

## 📄 Licencia

Este proyecto es de uso educativo y demostrativo.



