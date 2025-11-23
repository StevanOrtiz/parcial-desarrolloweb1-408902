import express, { type Request, type Response } from "express"
import { db } from "../database/Database"
import type { Category, CreateCategoryDTO } from "../models/Category"
import { v4 as uuidv4 } from "uuid"

const router = express.Router()

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get("/", (req: Request, res: Response) => {
  const categories = db.getCategories()
  res.json(categories)
})

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *       404:
 *         description: Categoría no encontrada
 */
router.get("/:id", (req: Request, res: Response) => {
  const category = db.getCategoryById(req.params.id)

  if (!category) {
    return res.status(404).json({ error: "Categoría no encontrada" })
  }

  res.json(category)
})

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - color
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada
 */
router.post("/", (req: Request, res: Response) => {
  const data: CreateCategoryDTO = req.body

  const category: Category = {
    id: uuidv4(),
    ...data,
    createdAt: new Date(),
  }

  db.createCategory(category)
  res.status(201).json(category)
})

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Categoría eliminada
 *       404:
 *         description: Categoría no encontrada
 */
router.delete("/:id", (req: Request, res: Response) => {
  const deleted = db.deleteCategory(req.params.id)

  if (!deleted) {
    return res.status(404).json({ error: "Categoría no encontrada" })
  }

  res.status(204).send()
})

export default router
