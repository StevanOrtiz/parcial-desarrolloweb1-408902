import express, { type Request, type Response } from "express"
import { db } from "../database/Database"
import type { User, CreateUserDTO } from "../models/User"
import { v4 as uuidv4 } from "uuid"

const router = express.Router()

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", (req: Request, res: Response) => {
  const users = db.getUsers()
  res.json(users)
})

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", (req: Request, res: Response) => {
  const user = db.getUserById(req.params.id)

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" })
  }

  res.json(user)
})

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post("/", (req: Request, res: Response) => {
  const data: CreateUserDTO = req.body

  const user: User = {
    id: uuidv4(),
    name: data.name,
    email: data.email,
    role: data.role || "USER",
    createdAt: new Date(),
  }

  db.createUser(user)
  res.status(201).json(user)
})

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id", (req: Request, res: Response) => {
  const deleted = db.deleteUser(req.params.id)

  if (!deleted) {
    return res.status(404).json({ error: "Usuario no encontrado" })
  }

  res.status(204).send()
})

export default router
