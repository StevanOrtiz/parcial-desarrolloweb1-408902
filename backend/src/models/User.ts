export interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "USER"
  createdAt: Date
}

export interface CreateUserDTO {
  name: string
  email: string
  role?: "ADMIN" | "USER"
}
