# Angular Calendar - Agenda de Actividades

Un proyecto completo de agenda con Angular (Frontend) y NestJS (Backend) que permite gestionar actividades en un calendario interactivo.

## Estructura del Proyecto

```
angular-calendar/
├── backend/        # API NestJS con Prisma y MySQL
├── frontend/       # Aplicación Angular con Material Design
└── README.md
```

## Características

### Backend (NestJS)

- ✅ API RESTful con NestJS
- ✅ Base de datos MySQL con Prisma ORM
- ✅ CRUD completo para actividades
- ✅ Validaciones con class-validator
- ✅ Documentación automática con Swagger
- ✅ CORS configurado para el frontend

### Frontend (Angular)

- ✅ Aplicación Angular con componentes standalone
- ✅ Material Design UI
- ✅ Formulario para crear/editar actividades
- ✅ Vista de calendario interactivo
- ✅ Navegación entre meses
- ✅ Notificaciones de éxito/error

## Requisitos Previos

- Node.js (v18 o superior)
- MySQL Server
- npm o yarn

## Instalación y Configuración

### 1. Configurar la Base de Datos

Crea una base de datos MySQL llamada `angular_calendar`:

```sql
CREATE DATABASE angular_calendar;
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Las variables de entorno ya están configuradas en `.env`:

```
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/angular_calendar"
```

Ejecutar migraciones de Prisma:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

## Ejecución del Proyecto

### Ejecutar el Backend

```bash
cd backend
npm run start:dev
```

El backend estará disponible en:

- API: http://localhost:3000
- Swagger: http://localhost:3000/api

### Ejecutar el Frontend

```bash
cd frontend
npm start
```

El frontend estará disponible en: http://localhost:4200

## Uso de la Aplicación

1. **Crear Actividad**:

   - Ve a la pestaña "Nueva Actividad"
   - Completa el formulario con título, descripción (opcional) y fecha
   - Haz clic en "Crear"

2. **Ver Calendario**:

   - Ve a la pestaña "Calendario"
   - Navega entre meses usando las flechas
   - Las actividades aparecen como tarjetas azules en las fechas correspondientes

3. **Editar Actividad**:

   - En el calendario, haz clic en una actividad
   - Se abrirá el formulario con los datos pre-cargados
   - Modifica los campos y haz clic en "Actualizar"

4. **Crear desde el Calendario**:
   - Haz clic en cualquier día del calendario
   - Se abrirá el formulario con la fecha seleccionada

## API Endpoints

- `GET /activities` - Obtener todas las actividades
- `GET /activities?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Filtrar por rango de fechas
- `GET /activities/:id` - Obtener actividad por ID
- `POST /activities` - Crear nueva actividad
- `PATCH /activities/:id` - Actualizar actividad
- `DELETE /activities/:id` - Eliminar actividad

## Tecnologías Utilizadas

### Backend

- NestJS
- Prisma ORM
- MySQL
- TypeScript
- Swagger
- Class Validator

### Frontend

- Angular 18
- Angular Material
- TypeScript
- RxJS
- SCSS

## Desarrollo

Para desarrollo, asegúrate de que tanto el backend como el frontend estén ejecutándose simultáneamente en puertos diferentes (3000 y 4200 respectivamente).

## Troubleshooting

### Error de conexión a la base de datos

- Verifica que MySQL esté ejecutándose
- Confirma las credenciales en el archivo `.env`
- Asegúrate de que la base de datos `angular_calendar` exista

### Error de CORS

- Verifica que el backend esté ejecutándose en el puerto 3000
- El CORS ya está configurado para http://localhost:4200

### Problemas con Material Design

- Ejecuta `npm install` en el directorio frontend
- Verifica que Angular Material esté correctamente instalado
