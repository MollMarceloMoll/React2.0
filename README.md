# Programa Ventas

Este es mi sistema de ventas para forrajeria/pet shop.  
Lo hice para poder gestionar productos, registrar ventas (incluyendo ventas por kilo), controlar stock y ver reportes con ganancias reales.

Actualmente tengo:
- `backend` desplegado en Railway
- `frontend` desplegado en Vercel

---

## Que hace el sistema

- Login de usuarios
- Gestion de productos por categoria (mascota, granja, accesorio, veterinaria)
- Registro de ventas:
  - por unidad
  - por bolsa
  - por kilo
- Descuento de stock automatico al vender
- Reportes de ventas:
  - resumen general
  - grafico por fechas
  - top de productos
  - ventas por metodo de pago
- Gestion de cuenta de usuario:
  - cambio de correo
  - cambio de contrasena

---

## Tecnologias que use

### Frontend
- React + Vite
- TypeScript
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js + Express
- MySQL (`mysql2`)
- JWT
- Bcrypt
- Joi
- CORS / dotenv

---

## Estructura del proyecto

```bash
Programa Ventas/
  backend/
    routes/
    server.js
    db.js
  frontend/
    src/
      pages/
      components/
      api/
```

---

## Variables de entorno

En `backend/.env` uso algo como:

```env
PORT=4000
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=forrajeria_db
DB_PORT=3306
JWT_SECRET=...
```

> Importante: no subir el archivo `.env` al repositorio.

---

## Como correrlo en local

## 1) Backend

```bash
cd backend
npm install
npm run dev
```

Backend disponible en:
- `http://localhost:4000`
- API base: `http://localhost:4000/api`

## 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en:
- `http://localhost:5173`

---

## Endpoints principales

- `POST /api/login`
- `GET /api/productos`
- `POST /api/productos`
- `PUT /api/productos/:id`
- `POST /api/ventas`
- `GET /api/ventas`
- `GET /api/reportes/resumen`
- `GET /api/reportes/grafico`
- `GET /api/reportes/top-productos`
- `GET /api/reportes/ventas-por-metodo`
- `GET /api/usuarios/me`
- `POST /api/usuarios/change-email`
- `POST /api/usuarios/change-password`

---

## Base de datos (puntos importantes)

Para evitar errores al insertar datos, las tablas de movimientos/ventas deben tener `id` con `AUTO_INCREMENT`:

- `usuarios.id`
- `ventas.id`
- `ventas_detalle.id`
- `stock_movimientos.id`

Ademas, para reportar ganancias reales por item, en `ventas_detalle` agregue:
- `costo_unitario`
- `costo_total`
- `ganancia_total`

Esto me permite que los reportes reflejen mejor la ganancia en ventas por kilo y por unidad/bolsa.

---

## Deploy

### Backend en Railway
- Servicio Node apuntando a la carpeta `backend`
- Comando recomendado: `npm start`

### Frontend en Vercel
- Proyecto apuntando a `frontend`
- Build command: `npm run build`
- Output: `dist`

---

## Estado actual

Proyecto funcional para uso diario, con mejoras en curso:
- endurecer validaciones
- mejorar UX de algunos formularios
- agregar mas indicadores de reportes

---

## Autor

Desarrollado por **Marcelo** para administrar ventas y stock de forma simple y practica.

