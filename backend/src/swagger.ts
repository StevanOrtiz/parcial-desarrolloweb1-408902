import swaggerJsdoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema de Gestión de Tareas API",
      version: "1.0.0",
      description: "API RESTful para gestionar tareas, categorías y usuarios con filtros y paginación",
      contact: {
        name: "Equipo de Desarrollo",
        email: "dev@taskmanager.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor de desarrollo",
      },
    ],
    tags: [
      {
        name: "Tasks",
        description: "Endpoints para gestión de tareas",
      },
      {
        name: "Categories",
        description: "Endpoints para gestión de categorías",
      },
      {
        name: "Users",
        description: "Endpoints para gestión de usuarios",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
}

export const swaggerSpec = swaggerJsdoc(options)
