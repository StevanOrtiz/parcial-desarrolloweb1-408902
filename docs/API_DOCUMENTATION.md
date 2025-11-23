# Documentación de API - Sistema de Gestión de Tareas

## Información General

- **Base URL**: `http://localhost:3001/api`
- **Formato**: JSON
- **Documentación Interactiva**: `http://localhost:3001/api-docs`

## Endpoints

### Health Check

#### GET /api/health
Verifica el estado del servidor.

**Respuesta:**
\`\`\`json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
\`\`\`

---

## Tareas (Tasks)

### GET /api/tasks
Obtiene todas las tareas con filtros y paginación.

**Query Parameters:**
- `status` (opcional): PENDING | IN_PROGRESS | COMPLETED | CANCELLED
- `priority` (opcional): LOW | MEDIUM | HIGH | URGENT
- `categoryId` (opcional): ID de la categoría
- `assignedUserId` (opcional): ID del usuario asignado
- `search` (opcional): Búsqueda en título, descripción y tags
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)

**Respuesta:**
\`\`\`json
{
  "data": [
    {
      "id": "uuid",
      "title": "Completar informe",
      "description": "Redactar informe mensual",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "categoryId": "uuid",
      "assignedUserId": "uuid",
      "dueDate": "2024-01-20T00:00:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z",
      "tags": ["reporte", "ventas"],
      "completedAt": null
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
\`\`\`

### GET /api/tasks/:id
Obtiene una tarea específica por ID.

**Parámetros:**
- `id`: ID de la tarea

**Respuesta:** Objeto Task

### POST /api/tasks
Crea una nueva tarea.

**Body:**
\`\`\`json
{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "priority": "MEDIUM",
  "categoryId": "uuid",
  "assignedUserId": "uuid",
  "dueDate": "2024-01-20",
  "tags": ["tag1", "tag2"]
}
\`\`\`

**Respuesta:** Tarea creada (Status 201)

### PUT /api/tasks/:id
Actualiza una tarea existente.

**Parámetros:**
- `id`: ID de la tarea

**Body:** Cualquier campo de Task (todos opcionales)

**Respuesta:** Tarea actualizada

### DELETE /api/tasks/:id
Elimina una tarea.

**Parámetros:**
- `id`: ID de la tarea

**Respuesta:** 204 No Content

### PATCH /api/tasks/:id/status
Actualiza solo el estado de una tarea.

**Parámetros:**
- `id`: ID de la tarea

**Body:**
\`\`\`json
{
  "status": "COMPLETED"
}
\`\`\`

**Respuesta:** Tarea actualizada

### GET /api/tasks/stats/summary
Obtiene estadísticas generales de tareas.

**Respuesta:**
\`\`\`json
{
  "total": 25,
  "byStatus": {
    "pending": 10,
    "inProgress": 5,
    "completed": 8,
    "cancelled": 2
  },
  "byPriority": {
    "low": 5,
    "medium": 10,
    "high": 7,
    "urgent": 3
  }
}
\`\`\`

---

## Categorías (Categories)

### GET /api/categories
Obtiene todas las categorías.

**Respuesta:**
\`\`\`json
[
  {
    "id": "uuid",
    "name": "Trabajo",
    "description": "Tareas relacionadas con trabajo",
    "color": "#3b82f6",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
\`\`\`

### GET /api/categories/:id
Obtiene una categoría específica.

**Parámetros:**
- `id`: ID de la categoría

**Respuesta:** Objeto Category

### POST /api/categories
Crea una nueva categoría.

**Body:**
\`\`\`json
{
  "name": "Personal",
  "description": "Tareas personales",
  "color": "#10b981"
}
\`\`\`

**Respuesta:** Categoría creada (Status 201)

### DELETE /api/categories/:id
Elimina una categoría.

**Parámetros:**
- `id`: ID de la categoría

**Respuesta:** 204 No Content

---

## Usuarios (Users)

### GET /api/users
Obtiene todos los usuarios.

**Respuesta:**
\`\`\`json
[
  {
    "id": "uuid",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "role": "ADMIN",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
\`\`\`

### GET /api/users/:id
Obtiene un usuario específico.

**Parámetros:**
- `id`: ID del usuario

**Respuesta:** Objeto User

### POST /api/users
Crea un nuevo usuario.

**Body:**
\`\`\`json
{
  "name": "María García",
  "email": "maria@example.com",
  "role": "USER"
}
\`\`\`

**Respuesta:** Usuario creado (Status 201)

### DELETE /api/users/:id
Elimina un usuario.

**Parámetros:**
- `id`: ID del usuario

**Respuesta:** 204 No Content

---

## Códigos de Estado HTTP

- `200 OK`: Solicitud exitosa
- `201 Created`: Recurso creado exitosamente
- `204 No Content`: Recurso eliminado exitosamente
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

## Modelos de Datos

### TaskStatus (Enum)
- `PENDING`: Tarea pendiente
- `IN_PROGRESS`: Tarea en progreso
- `COMPLETED`: Tarea completada
- `CANCELLED`: Tarea cancelada

### TaskPriority (Enum)
- `LOW`: Prioridad baja
- `MEDIUM`: Prioridad media
- `HIGH`: Prioridad alta
- `URGENT`: Prioridad urgente

### UserRole (Enum)
- `ADMIN`: Administrador
- `USER`: Usuario regular
