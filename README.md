# 📅 Aplicación de Reserva de Citas Fullstack

Una aplicación web moderna y completa para la gestión y reserva de citas, construida con el stack **MERN** (MongoDB, Express, React, Node.js). Diseñada con una interfaz elegante y oscura, ideal para salones, clínicas o profesionales independientes.

![Vista previa del proyecto](https://via.placeholder.com/800x400?text=CitasApp+Dashboard)

## ✨ Características Principales

* **Reserva Intuitiva:** Los clientes pueden agendar fácilmente seleccionando su nombre, servicio, fecha y hora.
* **Notificaciones por Correo Electrónico:** Envío automático de confirmaciones de citas al correo del cliente.
* **Códigos QR Inteligentes:** Cada cita genera un código QR único que se adjunta en el correo. Al escanearlo, muestra todos los detalles de la reserva.
* **Panel de Administración (Dashboard):** Una tabla de control para ver, organizar y eliminar las citas registradas.
* **Diseño Moderno:** Interfaz estilizada utilizando **Ant Design** con un tema oscuro (`dark theme`) y animaciones sutiles.

## 🛠 Tecnologías Utilizadas

### Frontend (Cliente)
* **[React](https://react.dev/) + [Vite](https://vitejs.dev/):** Renderizado rápido y desarrollo ágil.
* **[Ant Design](https://ant.design/):** Componentes visuales y sistema de diseño.
* **[Axios](https://axios-http.com/):** Para peticiones HTTP al servidor.
* **[React Router](https://reactrouter.com/):** Manejo de navegación entre páginas.

### Backend (Servidor)
* **[Node.js](https://nodejs.org/) & [Express](https://expressjs.com/):** Arquitectura del servidor y creación de la API REST.
* **[MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/):** Base de datos NoSQL para el almacenamiento de citas.
* **[Nodemailer](https://nodemailer.com/):** Envío automatizado de correos electrónicos.
* **[qrcode](https://www.npmjs.com/package/qrcode):** Generación de imágenes de códigos QR en el servidor.
* **[TypeScript](https://www.typescriptlang.org/):** Tipado estricto para un código más robusto en ambos lados.

---

## 🚀 Guía de Instalación y Uso

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### 1. Clonar el repositorio
```bash
git clone https://github.com/gmartinezarpe/Reserva-citas-fullstack.git
cd Reserva-citas-fullstack
```

### 2. Configurar el Backend
1. Entra a la carpeta del servidor:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la carpeta `backend` con las siguientes variables:
   ```env
   PORT=4000
   MONGO_URI=tu_cadena_de_conexion_de_mongodb
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### 3. Configurar el Frontend
1. Abre una nueva terminal y entra a la carpeta del cliente:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación web:
   ```bash
   npm run dev
   ```

### 4. ¡A Disfrutar!
Abre tu navegador y entra a `http://localhost:5173/` para ver la aplicación funcionando. El servidor estará escuchando en el puerto `4000`.

---

## 👨‍💻 Autor
Creado y mantenido como un proyecto de aprendizaje y portafolio de Fullstack Development.
