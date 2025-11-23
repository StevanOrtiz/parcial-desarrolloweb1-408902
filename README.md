# Sistema de Gestión de Tareas

Sistema full-stack para gestión de tareas con TypeScript, Express, y Vue 3.

## CÓMO EJECUTAR LA APLICACIÓN (Pasos Simples)

### Paso 1: Instalar y ejecutar el Backend

\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

Espera a ver el mensaje: "Server running on http://localhost:3001"
Deja esta terminal abierta.

### Paso 2: Instalar y ejecutar el Frontend (en otra terminal)

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Espera a ver el mensaje con la URL (por ejemplo: "http://localhost:5173")
Abre esa URL en tu navegador.

### Paso 3: Usar la aplicación

1. Abre tu navegador en `http://localhost:5173`
2. Verás la interfaz con tareas de ejemplo ya creadas
3. Puedes:
   - Crear nuevas tareas con el botón "Nueva Tarea"
   - Editar tareas existentes haciendo clic en el botón de editar
   - Eliminar tareas con el botón de eliminar
   - Filtrar por estado (Pendiente, En Progreso, Completada)
   - Filtrar por prioridad (Baja, Media, Alta)
   - Buscar tareas por título o descripción
   - Ver estadísticas en la pestaña "Estadísticas"
   - Gestionar categorías y usuarios en sus pestañas

### Documentación Swagger (Opcional)

Abre `http://localhost:3001/api-docs` para ver y probar todos los endpoints de la API.

---

## Características

- CRUD completo de tareas, categorías y usuarios
- Filtros avanzados por estado, prioridad, categoría y búsqueda
- Paginación de resultados
- Sistema de etiquetas (tags)
- Asignación de tareas a usuarios
- Estadísticas en tiempo real
- Documentación Swagger interactiva
- Base de datos en memoria (temporal)
- Interfaz moderna con Vue 3 + Tailwind CSS

## Tecnologías

### Backend
- **TypeScript**: Tipado estático
- **Express**: Framework web
- **Swagger**: Documentación de API
- **UUID**: Generación de IDs únicos

### Frontend
- **Vue 3**: Framework progresivo
- **Script Setup**: Composición API
- **TypeScript**: Tipado en frontend
- **Tailwind CSS**: Estilos utility-first
- **Lucide Icons**: Iconografía moderna
- **Vite**: Build tool rápido

## Estructura del Proyecto

\`\`\`
project/
├── backend/
│   ├── src/
│   │   ├── models/          # Modelos de datos (Task, Category, User)
│   │   ├── routes/          # Rutas de API
│   │   ├── database/        # Base de datos en memoria
│   │   ├── swagger.ts       # Configuración Swagger
│   │   └── server.ts        # Servidor Express
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── views/           # Vistas principales
│   │   ├── services/        # Servicios API
│   │   ├── types/           # Tipos TypeScript
│   │   ├── App.vue          # Componente raíz
│   │   ├── main.ts          # Punto de entrada
│   │   └── style.css        # Estilos globales
│   ├── package.json
│   └── vite.config.ts
│
└── docs/
    ├── DIAGRAMA_CLASES.md   # Diagrama de clases UML
    └── API_DOCUMENTATION.md # Documentación de API
\`\`\`

## Endpoints de API

### Tareas
- `GET /api/tasks` - Listar tareas (con filtros y paginación)
- `GET /api/tasks/:id` - Obtener tarea por ID
- `POST /api/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `PATCH /api/tasks/:id/status` - Actualizar estado
- `GET /api/tasks/stats/summary` - Estadísticas

### Categorías
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:id` - Obtener categoría
- `POST /api/categories` - Crear categoría
- `DELETE /api/categories/:id` - Eliminar categoría

### Usuarios
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `POST /api/users` - Crear usuario
- `DELETE /api/users/:id` - Eliminar usuario

**Total: 14 endpoints funcionales**

## Decisiones de Diseño

### Arquitectura
- **Separación de responsabilidades**: Backend y frontend completamente separados
- **Base de datos en memoria**: Uso de Maps para almacenamiento temporal sin necesidad de configuración externa
- **Patrón Repository**: La clase Database actúa como repositorio centralizado
- **DTOs**: Objetos de transferencia de datos para validación de entrada

### Backend
- **TypeScript estricto**: Configuración strict para máxima seguridad de tipos
- **Estructura modular**: Separación clara entre modelos, rutas y lógica de base de datos
- **Documentación automática**: Swagger genera documentación interactiva desde JSDoc
- **Datos de prueba**: Seed data incluido para testing inmediato

### Frontend
- **Vue 3 Composition API**: Script Setup para código más limpio y conciso
- **Componentes reutilizables**: Separación entre vistas y componentes
- **Servicios API centralizados**: Toda la comunicación HTTP en un módulo
- **Sistema de diseño consistente**: Variables CSS para temas coherentes
- **Responsive design**: Layout adaptable a móviles y desktop

### Funcionalidades Clave
1. **Filtros múltiples**: Combinación de estado, prioridad, categoría y búsqueda de texto
2. **Paginación eficiente**: Control de límite y página para grandes conjuntos de datos
3. **Estadísticas en tiempo real**: Dashboard con métricas actualizadas
4. **Sistema de etiquetas**: Tags flexibles para mejor organización
5. **Asignación de tareas**: Vinculación de tareas con usuarios específicos

## Video de Demostración

[Enlace al video explicativo]

El video incluye:
1. Estructura del código backend y frontend
2. Explicación del diagrama de clases
3. Demostración de endpoints en Swagger
4. Recorrido por la interfaz de usuario
5. Demostración de filtros y paginación
6. Creación, edición y eliminación de recursos

## Desarrollo

### Comandos Útiles

Backend:
\`\`\`bash
npm run dev      # Modo desarrollo con hot-reload
npm run build    # Compilar TypeScript
npm start        # Ejecutar versión compilada
\`\`\`

Frontend:
\`\`\`bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
\`\`\`

## Solución de Problemas

### El backend no inicia
- Asegúrate de estar en la carpeta `backend`
- Verifica que el puerto 3001 esté libre
- Ejecuta `npm install` nuevamente

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo en `http://localhost:3001`
- Revisa que no haya errores en la consola del navegador
- Asegúrate de que ambos servidores estén activos simultáneamente

### Errores de instalación
- Asegúrate de tener Node.js versión 16 o superior instalado
- Borra las carpetas `node_modules` y ejecuta `npm install` nuevamente
- Verifica tu conexión a internet

## Licencia

ISC
