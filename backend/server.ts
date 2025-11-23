import express, { type Request, type Response } from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./swagger"

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Base de datos en memoria
interface Task {
  id: number
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  createdAt: string
}

let tasks: Task[] = [
  {
    id: 1,
    title: "Ejemplo de tarea 1",
    description: "Esta es una tarea de ejemplo",
    status: "pending",
    priority: "high",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Ejemplo de tarea 2",
    description: "Otra tarea de ejemplo",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date().toISOString(),
  },
]

let nextId = 3

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Obtener todas las tareas con filtros y paginación
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
app.get("/api/tasks", (req: Request, res: Response) => {
  let filteredTasks = [...tasks]

  // Filtros
  const { status, priority, page = "1", limit = "10", search } = req.query

  if (status) {
    filteredTasks = filteredTasks.filter((t) => t.status === status)
  }

  if (priority) {
    filteredTasks = filteredTasks.filter((t) => t.priority === priority)
  }

  if (search && typeof search === "string") {
    filteredTasks = filteredTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()),
    )
  }

  // Paginación
  const pageNum = Number.parseInt(page as string)
  const limitNum = Number.parseInt(limit as string)
  const startIndex = (pageNum - 1) * limitNum
  const endIndex = startIndex + limitNum

  const paginatedTasks = filteredTasks.slice(startIndex, endIndex)

  res.json({
    data: paginatedTasks,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: filteredTasks.length,
      totalPages: Math.ceil(filteredTasks.length / limitNum),
    },
  })
})

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Obtener una tarea por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *       404:
 *         description: Tarea no encontrada
 */
app.get("/api/tasks/:id", (req: Request, res: Response) => {
  const task = tasks.find((t) => t.id === Number.parseInt(req.params.id))
  if (!task) {
    return res.status(404).json({ error: "Tarea no encontrada" })
  }
  res.json(task)
})

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crear nueva tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               priority:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarea creada
 */
app.post("/api/tasks", (req: Request, res: Response) => {
  const { title, description, status = "pending", priority = "medium" } = req.body

  if (!title) {
    return res.status(400).json({ error: "El título es requerido" })
  }

  const newTask: Task = {
    id: nextId++,
    title,
    description: description || "",
    status,
    priority,
    createdAt: new Date().toISOString(),
  }

  tasks.push(newTask)
  res.status(201).json(newTask)
})

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Actualizar tarea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tarea actualizada
 */
app.put("/api/tasks/:id", (req: Request, res: Response) => {
  const taskIndex = tasks.findIndex((t) => t.id === Number.parseInt(req.params.id))

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" })
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...req.body }
  res.json(tasks[taskIndex])
})

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Eliminar tarea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea eliminada
 */
app.delete("/api/tasks/:id", (req: Request, res: Response) => {
  const taskIndex = tasks.findIndex((t) => t.id === Number.parseInt(req.params.id))

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" })
  }

  tasks.splice(taskIndex, 1)
  res.json({ message: "Tarea eliminada correctamente" })
})

/**
 * @swagger
 * /api/tasks/bulk/delete:
 *   post:
 *     summary: Eliminar múltiples tareas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Tareas eliminadas
 */
app.post("/api/tasks/bulk/delete", (req: Request, res: Response) => {
  const { ids } = req.body

  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: "Se requiere un array de IDs" })
  }

  tasks = tasks.filter((t) => !ids.includes(t.id))
  res.json({ message: `${ids.length} tareas eliminadas` })
})

/**
 * @swagger
 * /api/tasks/status/{status}:
 *   get:
 *     summary: Obtener tareas por estado
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
app.get("/api/tasks/status/:status", (req: Request, res: Response) => {
  const filteredTasks = tasks.filter((t) => t.status === req.params.status)
  res.json(filteredTasks)
})

/**
 * @swagger
 * /api/tasks/priority/{priority}:
 *   get:
 *     summary: Obtener tareas por prioridad
 *     parameters:
 *       - in: path
 *         name: priority
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de tareas
 */
app.get("/api/tasks/priority/:priority", (req: Request, res: Response) => {
  const filteredTasks = tasks.filter((t) => t.priority === req.params.priority)
  res.json(filteredTasks)
})

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Obtener estadísticas
 *     responses:
 *       200:
 *         description: Estadísticas de tareas
 */
app.get("/api/stats", (req: Request, res: Response) => {
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    byPriority: {
      low: tasks.filter((t) => t.priority === "low").length,
      medium: tasks.filter((t) => t.priority === "medium").length,
      high: tasks.filter((t) => t.priority === "high").length,
    },
  }

  res.json(stats)
})

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   patch:
 *     summary: Actualizar solo el estado de una tarea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
app.patch("/api/tasks/:id/status", (req: Request, res: Response) => {
  const taskIndex = tasks.findIndex((t) => t.id === Number.parseInt(req.params.id))

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" })
  }

  tasks[taskIndex].status = req.body.status
  res.json(tasks[taskIndex])
})

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`)
  console.log(`Documentación Swagger en http://localhost:${PORT}/api-docs`)
})
