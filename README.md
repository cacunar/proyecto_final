# 📌 Marketplace de Alquiler de Vehículos

## 🏁 Introducción

Este proyecto es una plataforma web donde los usuarios pueden publicar y alquilar vehículos de manera segura. Los propietarios pueden listar sus autos y los arrendatarios pueden buscar y reservar fácilmente.

## 🚀 Características Principales

- **Autenticación Segura**: Registro y login con JWT (`AuthContext.js`).
- **Búsqueda Avanzada**: Filtros por tipo de vehículo, precio y ubicación (`gallery.css`).
- **Gestión de Publicaciones**: Creación, edición y eliminación de vehículos (`CreatePost.js`, `EditPost.js`).
- **Reservas en Línea**: Sistema automatizado con notificaciones \*(Bajo construcción)\*🚧.
- **Pagos Seguros**: Integración con pasarelas de pago confiables \*(Bajo construcción)\*🚧.
- **Sistema de Reseñas**: Los usuarios pueden calificar vehículos y propietarios *(Bajo construcción)*🚧.
- **Gestión de Usuarios**: Panel de control y perfil (`profile.css`).

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React y Tailwind CSS.
- **Backend**: Node.js con Express (`server.js`).
- **Base de Datos**: PostgreSQL (`db.js`).
- **Seguridad**: JWT para autenticación (`authMiddleware.js`).
- **Manejo de Estado**: Redux para la gestión global.

## 🔍 Arquitectura y Flujo de Datos

- **Rutas Protegidas**: Acceso restringido con `PrivateRoute.js`.
- **Servicios API**: Comunicación con `api.js`, `authService.js`, `postService.js`.
- **Controladores**:
  - `authController.js`: Registro, login y perfil de usuario.
  - `postController.js`: Gestión de publicaciones.
- **Rutas API**:
  - `authRoutes.js`: Manejo de autenticación (`/register`, `/login`, `/me`).
  - `postRoutes.js`: Creación, actualización y eliminación de publicaciones.
- **Modelos de Datos**:
  - `userModel.js`: Define la estructura de los usuarios.
  - `postModel.js`: Gestión de publicaciones.
- **Optimización de Rendimiento**: Medición con `reportWebVitals.js`.

## 🚀 Cómo Ejecutar el Proyecto

### 🛢️ Creación de la Base de Datos
1. Asegúrate de tener PostgreSQL instalado y en ejecución.
2. Crea la base de datos ejecutando:
   ```sql
   CREATE DATABASE marketplace_db;
   ```
3. Configura las credenciales en el archivo `.env`:
   ```env
   DB_USER=tu_usuario
   DB_PASS=tu_contraseña
   DB_HOST=localhost
   DB_NAME=marketplace_db
   DB_PORT=5432
   ```
4. Crea las tablas necesarias ejecutando los siguientes comandos en PostgreSQL:
   ```sql
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       first_name VARCHAR(100) NOT NULL,
       last_name VARCHAR(100) NOT NULL,
       country VARCHAR(50) NOT NULL,
       document VARCHAR(50) UNIQUE NOT NULL,
       phone VARCHAR(20) NOT NULL,
       email VARCHAR(100) UNIQUE NOT NULL,
       password TEXT NOT NULL,
       address TEXT NOT NULL,
       zip_code VARCHAR(20) NOT NULL,
       birth_date DATE NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE posts (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
       title VARCHAR(255) NOT NULL,
       description TEXT NOT NULL,
       price DECIMAL(10,2) NOT NULL,
       year INTEGER NOT NULL,
       km INTEGER NOT NULL,
       model VARCHAR(100) NOT NULL,
       fuel_type VARCHAR(50) NOT NULL,
       doors INTEGER NOT NULL,
       version VARCHAR(100) NOT NULL,
       transmission VARCHAR(50) NOT NULL,
       color VARCHAR(50) NOT NULL,
       body_type VARCHAR(100) NOT NULL,
       image_data BYTEA,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```
5. Ejecuta las migraciones necesarias si existen.
1. Asegúrate de tener PostgreSQL instalado y en ejecución.
2. Crea la base de datos ejecutando:
   ```sql
   CREATE DATABASE marketplace_db;
   ```
3. Configura las credenciales en el archivo `.env`:
   ```env
   DB_USER=tu_usuario
   DB_PASS=tu_contraseña
   DB_HOST=localhost
   DB_NAME=marketplace_db
   DB_PORT=5432
   ```
4. Ejecuta las migraciones necesarias si existen.


### 🔧 Requisitos Previos

- Node.js y npm instalados.
- PostgreSQL configurado con las credenciales en un archivo `.env`.

### ▶️ Pasos para levantar la aplicación

1. Clonar el repositorio.
2. Instalar dependencias en el frontend y backend:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Configurar variables de entorno (`.env`).
4. Iniciar el backend:
   ```bash
   cd backend
   npm start
   ```
5. Iniciar el frontend:
   ```bash
   cd frontend
   npm start
   ```
6. Acceder a la aplicación en `http://localhost:3000`.

## 🎨 Experiencia de Usuario y Diseño

- **Interfaz Moderna**: Diseño con `global.css`, `navbar.css`.
- **Flujo Intuitivo**: Formularios accesibles (`login.css`, `register.css`).
- **Exploración Rápida**: Galería interactiva (`gallery.css`).

## 🔥 Retos y Aprendizajes

- **Desafío**: Manejo de estados y seguridad.
- **Solución**: Implementación de Redux y autenticación robusta.

## ✅ Pruebas y Validaciones

- **Pruebas de API**: Implementadas con Jest y Supertest (`api.test.js`).
- **Validaciones**: Datos protegidos con `registerValidation.js`, `postValidation.js`.
- **Seguridad**: Protección de endpoints con `authMiddleware.js`.

## 🚧 Futuras Mejoras

- **Verificación de Publicaciones**: Mayor seguridad en las publicaciones.

## 👤 Autor

- **Carlos Acuña**
- **Clase: Fullstack JS G70**

## ❓ Preguntas y Apreciaciones

Cualquier comentario o duda es bienvenido.

**📢 ¡Gracias por tu interés en este proyecto!** 🚗💨

