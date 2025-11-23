export interface Category {
  id: string
  name: string
  description: string
  color: string
  createdAt: Date
}

export interface CreateCategoryDTO {
  name: string
  description: string
  color: string
}
