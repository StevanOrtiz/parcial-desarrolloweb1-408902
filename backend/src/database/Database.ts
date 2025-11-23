import { type Task, TaskStatus, TaskPriority } from "../models/Task"
import type { Category } from "../models/Category"
import type { User } from "../models/User"
import { v4 as uuidv4 } from "uuid"

class Database {
  private tasks: Map<string, Task> = new Map()
  private categories: Map<string, Category> = new Map()
  private users: Map<string, User> = new Map()

  constructor() {
    this.seedData()
  }

  private seedData() {
    // Seed Categories
    const categories = [
      { name: "Trabajo", description: "Tareas relacionadas con trabajo", color: "#3b82f6" },
      { name: "Personal", description: "Tareas personales", color: "#10b981" },
      { name: "Estudio", description: "Tareas académicas", color: "#f59e0b" },
      { name: "Hogar", description: "Tareas del hogar", color: "#8b5cf6" },
    ]

    categories.forEach((cat) => {
      const category: Category = {
        id: uuidv4(),
        ...cat,
        createdAt: new Date(),
      }
      this.categories.set(category.id, category)
    })

    // Seed Users
    const users = [
      { name: "Juan Pérez", email: "juan@example.com", role: "ADMIN" as const },
      { name: "María García", email: "maria@example.com", role: "USER" as const },
      { name: "Carlos López", email: "carlos@example.com", role: "USER" as const },
    ]

    users.forEach((userData) => {
      const user: User = {
        id: uuidv4(),
        ...userData,
        createdAt: new Date(),
      }
      this.users.set(user.id, user)
    })

    // Seed Tasks
    const firstCategory = Array.from(this.categories.values())[0]
    const firstUser = Array.from(this.users.values())[0]

    const tasks = [
      {
        title: "Completar informe mensual",
        description: "Redactar y enviar el informe de ventas del mes",
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
        tags: ["reporte", "ventas"],
      },
      {
        title: "Reunión con cliente",
        description: "Presentación de propuesta para nuevo proyecto",
        status: TaskStatus.PENDING,
        priority: TaskPriority.URGENT,
        tags: ["reunión", "cliente"],
      },
      {
        title: "Actualizar documentación",
        description: "Revisar y actualizar la documentación técnica del sistema",
        status: TaskStatus.COMPLETED,
        priority: TaskPriority.MEDIUM,
        tags: ["documentación", "técnico"],
      },
    ]

    tasks.forEach((taskData) => {
      const task: Task = {
        id: uuidv4(),
        ...taskData,
        categoryId: firstCategory.id,
        assignedUserId: firstUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: taskData.status === TaskStatus.COMPLETED ? new Date() : undefined,
      }
      this.tasks.set(task.id, task)
    })
  }

  // Task methods
  getTasks(): Task[] {
    return Array.from(this.tasks.values())
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.get(id)
  }

  createTask(task: Task): Task {
    this.tasks.set(task.id, task)
    return task
  }

  updateTask(id: string, updates: Partial<Task>): Task | undefined {
    const task = this.tasks.get(id)
    if (!task) return undefined

    const updatedTask = { ...task, ...updates, updatedAt: new Date() }
    this.tasks.set(id, updatedTask)
    return updatedTask
  }

  deleteTask(id: string): boolean {
    return this.tasks.delete(id)
  }

  // Category methods
  getCategories(): Category[] {
    return Array.from(this.categories.values())
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.get(id)
  }

  createCategory(category: Category): Category {
    this.categories.set(category.id, category)
    return category
  }

  deleteCategory(id: string): boolean {
    return this.categories.delete(id)
  }

  // User methods
  getUsers(): User[] {
    return Array.from(this.users.values())
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id)
  }

  createUser(user: User): User {
    this.users.set(user.id, user)
    return user
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id)
  }
}

export const db = new Database()
