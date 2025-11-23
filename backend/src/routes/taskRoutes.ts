import express, { type Request, type Response } from "express"
import { db } from "../database/Database"
import { type Task, TaskStatus, TaskPriority, type CreateTaskDTO, type UpdateTaskDTO } from "../models/Task"
import { v4 as uuidv4 } from "uuid"

const router = express.Router()

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Obtener todas las tareas con filtros y paginación
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [LOW, MEDIUM, HIGH, URGENT]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: assignedUserId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Lista de tareas con paginación
 */
router.get("/", (req: Request, res: Response) => {
  let tasks = db.getTasks()

  // Filtros
  const { status, priority, categoryId, assignedUserId, search, page = "1", limit = "10" } = req.query

  if (status) {
    tasks = tasks.filter((t) => t.status === status)
  }

  if (priority) {
    tasks = tasks.filter((t) => t.priority === priority)
  }

  if (categoryId) {
    tasks = tasks.filter((t) => t.categoryId === categoryId)
  }

  if (assignedUserId) {
    tasks = tasks.filter((t) => t.assignedUserId === assignedUserId)
  }

  if (search) {
    const searchLower = (search as string).toLowerCase()
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
    )
  }

  // Ordenar por fecha de creación (más reciente primero)
  tasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  // Paginación
  const pageNum = Number.parseInt(page as string)
  const limitNum = Number.parseInt(limit as string)
  const startIndex = (pageNum - 1) * limitNum
  const endIndex = startIndex + limitNum

  const paginatedTasks = tasks.slice(startIndex, endIndex)

  res.json({
    data: paginatedTasks,
    pagination: {
      total: tasks.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(tasks.length / limitNum),
    },
  })
})

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Obtener una tarea por ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarea encontrada
 *       404:
 *         description: Tarea no encontrada
 */
router.get("/:id", (req: Request, res: Response) => {
  const task = db.getTaskById(req.params.id)

  if (!task) {
    return res.status(404).json({ error: "Tarea no encontrada" })
  }

  res.json(task)
})

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - priority
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH, URGENT]
 *               categoryId:
 *                 type: string
 *               assignedUserId:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Tarea creada exitosamente
 */
router.post("/", (req: Request, res: Response) => {
  const data: CreateTaskDTO = req.body

  const task: Task = {
    id: uuidv4(),
    title: data.title,
    description: data.description,
    status: TaskStatus.PENDING,
    priority: data.priority,
    categoryId: data.categoryId,
    assignedUserId: data.assignedUserId,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: data.tags || [],
  }

  db.createTask(task)
  res.status(201).json(task)
})

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Actualizar una tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tarea actualizada
 *       404:
 *         description: Tarea no encontrada
 */
router.put("/:id", (req: Request, res: Response) => {
  const updates: UpdateTaskDTO = req.body

  const updatedTask = db.updateTask(req.params.id, {
    ...updates,
    dueDate: updates.dueDate ? new Date(updates.dueDate) : undefined,
    completedAt: updates.status === TaskStatus.COMPLETED ? new Date() : undefined,
  })

  if (!updatedTask) {
    return res.status(404).json({ error: "Tarea no encontrada" })
  }

  res.json(updatedTask)
})

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Eliminar una tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tarea eliminada
 *       404:
 *         description: Tarea no encontrada
 */
router.delete("/:id", (req: Request, res: Response) => {
  const deleted = db.deleteTask(req.params.id)

  if (!deleted) {
    return res.status(404).json({ error: "Tarea no encontrada" })
  }

  res.status(204).send()
})

/**
 * @swagger
 * /api/tasks/{id}/status:
 *   patch:
 *     summary: Actualizar el estado de una tarea
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch("/:id/status", (req: Request, res: Response) => {
  const { status } = req.body

  const updatedTask = db.updateTask(req.params.id, {
    status,
    completedAt: status === TaskStatus.COMPLETED ? new Date() : undefined,
  })

  if (!updatedTask) {
    return res.status(404).json({ error: "Tarea no encontrada" })
  }

  res.json(updatedTask)
})

/**
 * @swagger
 * /api/tasks/stats/summary:
 *   get:
 *     summary: Obtener estadísticas de tareas
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: Estadísticas generales
 */
router.get("/stats/summary", (req: Request, res: Response) => {
  const tasks = db.getTasks()

  const stats = {
    total: tasks.length,
    byStatus: {
      pending: tasks.filter((t) => t.status === TaskStatus.PENDING).length,
      inProgress: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length,
      completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
      cancelled: tasks.filter((t) => t.status === TaskStatus.CANCELLED).length,
    },
    byPriority: {
      low: tasks.filter((t) => t.priority === TaskPriority.LOW).length,
      medium: tasks.filter((t) => t.priority === TaskPriority.MEDIUM).length,
      high: tasks.filter((t) => t.priority === TaskPriority.HIGH).length,
      urgent: tasks.filter((t) => t.priority === TaskPriority.URGENT).length,
    },
  }

  res.json(stats)
})

export default router
