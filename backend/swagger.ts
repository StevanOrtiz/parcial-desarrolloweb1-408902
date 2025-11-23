import swaggerJsdoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "API para gestión de tareas con filtros y paginación",
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
        description: "Operaciones sobre tareas",
      },
      {
        name: "Stats",
        description: "Estadísticas",
      },
    ],
  },
  apis: ["./server.ts"],
}

export const swaggerSpec = swaggerJsdoc(options)
