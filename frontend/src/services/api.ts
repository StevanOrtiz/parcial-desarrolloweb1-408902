const API_BASE_URL = "http://localhost:3001/api"

interface PaginationParams {
  page?: number
  limit?: number
  status?: string
  priority?: string
  categoryId?: string
  search?: string
}

export const taskService = {
  async getTasks(params: PaginationParams = {}) {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString())
    })

    const response = await fetch(`${API_BASE_URL}/tasks?${queryParams}`)
    return response.json()
  },

  async getTask(id: string) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`)
    return response.json()
  },

  async createTask(data: any) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async updateTask(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async deleteTask(id: string) {
    await fetch(`${API_BASE_URL}/tasks/${id}`, { method: "DELETE" })
  },

  async updateStatus(id: string, status: string) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    return response.json()
  },

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/tasks/stats/summary`)
    return response.json()
  },
}

export const categoryService = {
  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`)
    return response.json()
  },

  async createCategory(data: any) {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async deleteCategory(id: string) {
    await fetch(`${API_BASE_URL}/categories/${id}`, { method: "DELETE" })
  },
}

export const userService = {
  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`)
    return response.json()
  },

  async createUser(data: any) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async deleteUser(id: string) {
    await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" })
  },
}
