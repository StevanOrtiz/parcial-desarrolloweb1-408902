# Diagrama de Clases - Sistema de Gestión de Tareas

## Descripción del Sistema

El Sistema de Gestión de Tareas es una aplicación full-stack que permite a los usuarios crear, organizar y gestionar tareas con diferentes prioridades y estados. El sistema cuenta con categorización, asignación de usuarios, filtros avanzados y paginación.

## Diagrama de Clases

\`\`\`
┌─────────────────────────────────────┐
│           Task                      │
├─────────────────────────────────────┤
│ - id: string                        │
│ - title: string                     │
│ - description: string               │
│ - status: TaskStatus                │
│ - priority: TaskPriority            │
│ - categoryId: string                │
│ - assignedUserId?: string           │
│ - dueDate?: Date                    │
│ - createdAt: Date                   │
│ - updatedAt: Date                   │
│ - tags: string[]                    │
│ - completedAt?: Date                │
├─────────────────────────────────────┤
│ + create(): Task                    │
│ + update(data): Task                │
│ + delete(): boolean                 │
│ + updateStatus(status): Task        │
│ + assignUser(userId): Task          │
└─────────────────────────────────────┘
            │
            │ belongsTo
            ▼
┌─────────────────────────────────────┐
│         Category                    │
├─────────────────────────────────────┤
│ - id: string                        │
│ - name: string                      │
│ - description: string               │
│ - color: string                     │
│ - createdAt: Date                   │
├─────────────────────────────────────┤
│ + create(): Category                │
│ + delete(): boolean                 │
│ + getTasks(): Task[]                │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│           User                      │
├─────────────────────────────────────┤
│ - id: string                        │
│ - name: string                      │
│ - email: string                     │
│ - role: UserRole                    │
│ - createdAt: Date                   │
├─────────────────────────────────────┤
│ + create(): User                    │
│ + delete(): boolean                 │
│ + getAssignedTasks(): Task[]        │
└─────────────────────────────────────┘
            │
            │ hasMany
            ▼
         Task


┌─────────────────────────────────────┐
│        TaskStatus (Enum)            │
├─────────────────────────────────────┤
│ - PENDING                           │
│ - IN_PROGRESS                       │
│ - COMPLETED                         │
│ - CANCELLED                         │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│      TaskPriority (Enum)            │
├─────────────────────────────────────┤
│ - LOW                               │
│ - MEDIUM                            │
│ - HIGH                              │
│ - URGENT                            │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│       UserRole (Enum)               │
├─────────────────────────────────────┤
│ - ADMIN                             │
│ - USER                              │
└─────────────────────────────────────┘


┌─────────────────────────────────────┐
│         Database                    │
├─────────────────────────────────────┤
│ - tasks: Map<string, Task>          │
│ - categories: Map<string, Category> │
│ - users: Map<string, User>          │
├─────────────────────────────────────┤
│ + getTasks(filters?): Task[]        │
│ + getTaskById(id): Task             │
│ + createTask(task): Task            │
│ + updateTask(id, data): Task        │
│ + deleteTask(id): boolean           │
│ + getCategories(): Category[]       │
│ + getUsers(): User[]                │
│ + seedData(): void                  │
└─────────────────────────────────────┘
\`\`\`

## Relaciones

1. **Task - Category** (N:1)
   - Una tarea pertenece a una categoría
   - Una categoría puede tener muchas tareas

2. **Task - User** (N:1)
   - Una tarea puede ser asignada a un usuario
   - Un usuario puede tener muchas tareas asignadas

3. **Database - Entities** (1:N)
   - La clase Database gestiona todas las entidades
   - Proporciona métodos CRUD para cada entidad

## DTOs (Data Transfer Objects)

\`\`\`
┌─────────────────────────────────────┐
│      CreateTaskDTO                  │
├─────────────────────────────────────┤
│ - title: string                     │
│ - description: string               │
│ - priority: TaskPriority            │
│ - categoryId: string                │
│ - assignedUserId?: string           │
│ - dueDate?: string                  │
│ - tags?: string[]                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      UpdateTaskDTO                  │
├─────────────────────────────────────┤
│ - title?: string                    │
│ - description?: string              │
│ - status?: TaskStatus               │
│ - priority?: TaskPriority           │
│ - categoryId?: string               │
│ - assignedUserId?: string           │
│ - dueDate?: string                  │
│ - tags?: string[]                   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    CreateCategoryDTO                │
├─────────────────────────────────────┤
│ - name: string                      │
│ - description: string               │
│ - color: string                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      CreateUserDTO                  │
├─────────────────────────────────────┤
│ - name: string                      │
│ - email: string                     │
│ - role?: UserRole                   │
└─────────────────────────────────────┘
\`\`\`

## Arquitectura del Sistema

### Backend (Express + TypeScript)
- **Capa de Rutas**: Maneja las peticiones HTTP
- **Capa de Modelos**: Define las estructuras de datos
- **Capa de Base de Datos**: Gestiona el almacenamiento en memoria

### Frontend (Vue 3 + TypeScript)
- **Componentes de Vista**: Páginas principales (Tasks, Categories, Users, Stats)
- **Componentes Reutilizables**: Modales, formularios
- **Servicios API**: Comunicación con el backend
- **Tipos**: Interfaces TypeScript compartidas
