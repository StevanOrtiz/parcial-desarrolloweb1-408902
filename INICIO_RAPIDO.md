# Guía de Inicio Rápido

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm (incluido con Node.js)
- Navegador web moderno

## Pasos para Ejecutar

### 1. Abrir DOS terminales

Necesitarás dos ventanas de terminal: una para el backend y otra para el frontend.

### 2. En la Terminal 1 - Backend

\`\`\`bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar el servidor backend
npm run dev
\`\`\`

Deberías ver:
\`\`\`
Server running on http://localhost:3001
Swagger docs available at http://localhost:3001/api-docs
\`\`\`

Deja esta terminal abierta y corriendo.

### 3. En la Terminal 2 - Frontend

\`\`\`bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar el servidor frontend
npm run dev
\`\`\`

Deberías ver algo como:
\`\`\`
VITE v4.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
\`\`\`

### 4. Abrir en el Navegador

Abre tu navegador y ve a: **http://localhost:5173**

## Cómo Usar la Aplicación

### Tareas
1. **Ver tareas**: Se cargan automáticamente con datos de ejemplo
2. **Crear tarea**: Clic en "Nueva Tarea" → completa el formulario → Guardar
3. **Editar tarea**: Clic en el ícono de lápiz → modifica → Guardar
4. **Eliminar tarea**: Clic en el ícono de basura → Confirmar
5. **Filtrar tareas**: 
   - Por estado: Pendiente, En Progreso, Completada
   - Por prioridad: Baja, Media, Alta
   - Por búsqueda: escribe en el campo de búsqueda
6. **Cambiar página**: Usa los botones Anterior/Siguiente

### Categorías
1. Clic en la pestaña "Categorías"
2. Ver categorías existentes (Trabajo, Personal, Urgente)
3. Crear nueva categoría con nombre, descripción y color
4. Eliminar categorías que no estén en uso

### Usuarios
1. Clic en la pestaña "Usuarios"
2. Ver usuarios existentes
3. Crear nuevo usuario con nombre y email
4. Eliminar usuarios que no tengan tareas asignadas

### Estadísticas
1. Clic en la pestaña "Estadísticas"
2. Ver:
   - Total de tareas
   - Tareas completadas
   - Tareas pendientes
   - Tasa de completación
   - Distribución por estado y prioridad

## Probar la API con Swagger

1. Abre en tu navegador: **http://localhost:3001/api-docs**
2. Verás todos los endpoints documentados
3. Puedes probar cada endpoint directamente desde Swagger:
   - Clic en un endpoint
   - Clic en "Try it out"
   - Completa los parámetros (si los hay)
   - Clic en "Execute"
   - Ve la respuesta

## Comandos Importantes

### Primera vez (instalación)
\`\`\`bash
# En la carpeta backend
cd backend
npm install

# En la carpeta frontend
cd frontend
npm install
\`\`\`

### Cada vez que quieras usar la app
\`\`\`bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
\`\`\`

### Para detener los servidores
Presiona `Ctrl + C` en cada terminal

## Estructura de Carpetas

\`\`\`
proyecto/
├── backend/          # Servidor Express + TypeScript
│   ├── src/          # Código fuente
│   └── package.json  # Dependencias backend
│
├── frontend/         # Aplicación Vue 3
│   ├── src/          # Código fuente
│   └── package.json  # Dependencias frontend
│
├── docs/             # Documentación
│   ├── DIAGRAMA_CLASES.md
│   └── API_DOCUMENTATION.md
│
├── README.md         # Documentación principal
└── INICIO_RAPIDO.md  # Esta guía
\`\`\`

## Solución de Problemas

### "npm: command not found"
- Instala Node.js desde https://nodejs.org

### "Port 3001 is already in use"
- Cierra cualquier aplicación usando el puerto 3001
- O cambia el puerto en `backend/src/server.ts` (línea con `const PORT = 3001`)

### "Cannot GET /"
- Asegúrate de abrir `http://localhost:5173` (frontend) no `localhost:3001` (backend)

### La página está en blanco
- Abre las DevTools del navegador (F12)
- Revisa la pestaña Console para errores
- Verifica que el backend esté corriendo

### Los cambios no se reflejan
- Guarda el archivo
- Los servidores se recargan automáticamente
- Si no, detén (Ctrl+C) y reinicia `npm run dev`

## Siguiente Paso

Una vez que todo funcione, puedes:
1. Explorar el código en las carpetas `src`
2. Modificar componentes Vue en `frontend/src/components`
3. Agregar nuevos endpoints en `backend/src/routes`
4. Personalizar estilos en `frontend/src/style.css`
5. Revisar el diagrama de clases en `docs/DIAGRAMA_CLASES.md`

## Soporte

Si tienes problemas:
1. Lee la documentación en `README.md`
2. Revisa la documentación de la API en `docs/API_DOCUMENTATION.md`
3. Verifica los logs en las terminales
4. Usa las DevTools del navegador (F12)
