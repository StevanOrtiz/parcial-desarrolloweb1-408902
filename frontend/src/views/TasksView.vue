<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-foreground">Gestión de Tareas</h2>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
      >
        <Plus class="w-5 h-5" />
        Nueva Tarea
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-card rounded-lg border border-border p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Buscar tareas..."
            class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Estado</label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
          >
            <option value="">Todos</option>
            <option value="PENDING">Pendiente</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="COMPLETED">Completada</option>
            <option value="CANCELLED">Cancelada</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Prioridad</label>
          <select
            v-model="filters.priority"
            class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
          >
            <option value="">Todas</option>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Categoría</label>
          <select
            v-model="filters.categoryId"
            class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
          >
            <option value="">Todas</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <Loader2 class="w-8 h-8 animate-spin text-primary mx-auto" />
    </div>

    <!-- Lista de tareas -->
    <div v-else class="space-y-4">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-foreground">{{ task.title }}</h3>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  getPriorityClass(task.priority)
                ]"
              >
                {{ getPriorityLabel(task.priority) }}
              </span>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  getStatusClass(task.status)
                ]"
              >
                {{ getStatusLabel(task.status) }}
              </span>
            </div>
            <p class="text-muted-foreground mb-3">{{ task.description }}</p>
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <div class="flex items-center gap-1">
                <Tag class="w-4 h-4" />
                <span>{{ getCategoryName(task.categoryId) }}</span>
              </div>
              <div v-if="task.assignedUserId" class="flex items-center gap-1">
                <User class="w-4 h-4" />
                <span>{{ getUserName(task.assignedUserId) }}</span>
              </div>
              <div v-if="task.dueDate" class="flex items-center gap-1">
                <Calendar class="w-4 h-4" />
                <span>{{ formatDate(task.dueDate) }}</span>
              </div>
            </div>
            <div v-if="task.tags.length" class="flex gap-2 mt-2">
              <span
                v-for="tag in task.tags"
                :key="tag"
                class="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
          <div class="flex gap-2">
            <button
              @click="editTask(task)"
              class="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Edit2 class="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              @click="deleteTask(task.id)"
              class="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <Trash2 class="w-4 h-4 text-destructive" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="pagination.totalPages > 1" class="flex justify-center gap-2">
      <button
        @click="changePage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50"
      >
        Anterior
      </button>
      <span class="px-4 py-2 bg-card border border-border rounded-lg">
        Página {{ pagination.page }} de {{ pagination.totalPages }}
      </span>
      <button
        @click="changePage(pagination.page + 1)"
        :disabled="pagination.page === pagination.totalPages"
        class="px-4 py-2 bg-card border border-border rounded-lg disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>

    <!-- Modal crear/editar -->
    <TaskModal
      v-if="showCreateModal || editingTask"
      :task="editingTask"
      :categories="categories"
      :users="users"
      @close="closeModal"
      @save="saveTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Plus, Edit2, Trash2, Tag, User, Calendar, Loader2 } from 'lucide-vue-next'
import TaskModal from '../components/TaskModal.vue'
import { taskService, categoryService, userService } from '../services/api'
import type { Task, Category, User as UserType } from '../types'

const tasks = ref<Task[]>([])
const categories = ref<Category[]>([])
const users = ref<UserType[]>([])
const loading = ref(false)
const showCreateModal = ref(false)
const editingTask = ref<Task | null>(null)

const filters = ref({
  search: '',
  status: '',
  priority: '',
  categoryId: ''
})

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
})

const loadTasks = async () => {
  loading.value = true
  try {
    const response = await taskService.getTasks({
      ...filters.value,
      page: pagination.value.page,
      limit: pagination.value.limit
    })
    tasks.value = response.data
    pagination.value = response.pagination
  } catch (error) {
    console.error('Error loading tasks:', error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    categories.value = await categoryService.getCategories()
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

const loadUsers = async () => {
  try {
    users.value = await userService.getUsers()
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const editTask = (task: Task) => {
  editingTask.value = task
}

const deleteTask = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar esta tarea?')) return
  
  try {
    await taskService.deleteTask(id)
    await loadTasks()
  } catch (error) {
    console.error('Error deleting task:', error)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingTask.value = null
}

const saveTask = async (taskData: any) => {
  try {
    if (editingTask.value) {
      await taskService.updateTask(editingTask.value.id, taskData)
    } else {
      await taskService.createTask(taskData)
    }
    closeModal()
    await loadTasks()
  } catch (error) {
    console.error('Error saving task:', error)
  }
}

const changePage = (page: number) => {
  pagination.value.page = page
  loadTasks()
}

const getPriorityClass = (priority: string) => {
  const classes = {
    LOW: 'bg-blue-100 text-blue-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH: 'bg-orange-100 text-orange-700',
    URGENT: 'bg-red-100 text-red-700'
  }
  return classes[priority as keyof typeof classes]
}

const getPriorityLabel = (priority: string) => {
  const labels = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
    URGENT: 'Urgente'
  }
  return labels[priority as keyof typeof labels]
}

const getStatusClass = (status: string) => {
  const classes = {
    PENDING: 'bg-gray-100 text-gray-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700'
  }
  return classes[status as keyof typeof classes]
}

const getStatusLabel = (status: string) => {
  const labels = {
    PENDING: 'Pendiente',
    IN_PROGRESS: 'En Progreso',
    COMPLETED: 'Completada',
    CANCELLED: 'Cancelada'
  }
  return labels[status as keyof typeof labels]
}

const getCategoryName = (id: string) => {
  return categories.value.find(c => c.id === id)?.name || 'Sin categoría'
}

const getUserName = (id: string) => {
  return users.value.find(u => u.id === id)?.name || 'Sin asignar'
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('es-ES')
}

watch(filters, () => {
  pagination.value.page = 1
  loadTasks()
}, { deep: true })

onMounted(() => {
  loadTasks()
  loadCategories()
  loadUsers()
})
</script>
