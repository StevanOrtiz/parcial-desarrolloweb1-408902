export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  categoryId: string
  assignedUserId?: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  tags: string[]
  completedAt?: Date
}

export interface CreateTaskDTO {
  title: string
  description: string
  priority: TaskPriority
  categoryId: string
  assignedUserId?: string
  dueDate?: string
  tags?: string[]
}

export interface UpdateTaskDTO {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  categoryId?: string
  assignedUserId?: string
  dueDate?: string
  tags?: string[]
}
