<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Tareas</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 py-8">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <p class="text-sm text-gray-600">Total</p>
          <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <p class="text-sm text-gray-600">Pendientes</p>
          <p class="text-3xl font-bold text-yellow-600">{{ stats.pending }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <p class="text-sm text-gray-600">En Progreso</p>
          <p class="text-3xl font-bold text-blue-600">{{ stats.inProgress }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border">
          <p class="text-sm text-gray-600">Completadas</p>
          <p class="text-3xl font-bold text-green-600">{{ stats.completed }}</p>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white p-6 rounded-lg shadow-sm border mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar tareas..."
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="loadTasks"
          />
          <select
            v-model="filterStatus"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="loadTasks"
          >
            <option value="">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="in-progress">En Progreso</option>
            <option value="completed">Completada</option>
          </select>
          <select
            v-model="filterPriority"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="loadTasks"
          >
            <option value="">Todas las prioridades</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
          <button
            @click="openCreateModal"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nueva Tarea
          </button>
        </div>
      </div>

      <!-- Tasks List -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="divide-y" v-if="tasks.length > 0">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900">{{ task.title }}</h3>
                <p class="text-gray-600 mt-1">{{ task.description }}</p>
                <div class="flex items-center gap-4 mt-3">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ getStatusLabel(task.status) }}
                  </span>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      task.priority === 'low' ? 'bg-gray-100 text-gray-800' :
                      task.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ getPriorityLabel(task.priority) }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <button
                  @click="openEditModal(task)"
                  class="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Editar
                </button>
                <button
                  @click="deleteTask(task.id)"
                  class="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="p-12 text-center text-gray-500">
          No hay tareas para mostrar
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex items-center justify-between" v-if="pagination.totalPages > 1">
        <p class="text-sm text-gray-600">
          Página {{ pagination.page }} de {{ pagination.totalPages }}
          ({{ pagination.total }} tareas en total)
        </p>
        <div class="flex gap-2">
          <button
            @click="changePage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            @click="changePage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </main>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 class="text-2xl font-bold mb-4">
          {{ editingTask ? 'Editar Tarea' : 'Nueva Tarea' }}
        </h2>
        <form @submit.prevent="saveTask">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                v-model="formData.title"
                type="text"
                required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                v-model="formData.description"
                rows="3"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                v-model="formData.status"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pendiente</option>
                <option value="in-progress">En Progreso</option>
                <option value="completed">Completada</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                v-model="formData.priority"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>
          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const API_URL = 'http://localhost:3001/api'

interface Task {
  id: number
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  createdAt: string
}

const tasks = ref<Task[]>([])
const stats = ref({
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0
})
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

const searchQuery = ref('')
const filterStatus = ref('')
const filterPriority = ref('')

const showModal = ref(false)
const editingTask = ref<Task | null>(null)
const formData = ref({
  title: '',
  description: '',
  status: 'pending' as const,
  priority: 'medium' as const
})

const loadTasks = async () => {
  try {
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString()
    })
    
    if (searchQuery.value) params.append('search', searchQuery.value)
    if (filterStatus.value) params.append('status', filterStatus.value)
    if (filterPriority.value) params.append('priority', filterPriority.value)

    const response = await fetch(`${API_URL}/tasks?${params}`)
    const data = await response.json()
    
    tasks.value = data.data
    pagination.value = data.pagination
  } catch (error) {
    console.error('Error loading tasks:', error)
  }
}

const loadStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`)
    stats.value = await response.json()
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

const openCreateModal = () => {
  editingTask.value = null
  formData.value = {
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium'
  }
  showModal.value = true
}

const openEditModal = (task: Task) => {
  editingTask.value = task
  formData.value = {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingTask.value = null
}

const saveTask = async () => {
  try {
    if (editingTask.value) {
      await fetch(`${API_URL}/tasks/${editingTask.value.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.value)
      })
    } else {
      await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.value)
      })
    }
    closeModal()
    await loadTasks()
    await loadStats()
  } catch (error) {
    console.error('Error saving task:', error)
  }
}

const deleteTask = async (id: number) => {
  if (!confirm('¿Estás seguro de eliminar esta tarea?')) return
  
  try {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' })
    await loadTasks()
    await loadStats()
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}

const changePage = (page: number) => {
  pagination.value.page = page
  loadTasks()
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'pending': 'Pendiente',
    'in-progress': 'En Progreso',
    'completed': 'Completada'
  }
  return labels[status] || status
}

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    'low': 'Baja',
    'medium': 'Media',
    'high': 'Alta'
  }
  return labels[priority] || priority
}

onMounted(() => {
  loadTasks()
  loadStats()
})
</script>
