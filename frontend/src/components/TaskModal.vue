<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-card rounded-lg border border-border p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold text-foreground mb-6">
        {{ task ? 'Editar Tarea' : 'Nueva Tarea' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Título *</label>
          <input
            v-model="formData.title"
            type="text"
            required
            class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Descripción *</label>
          <textarea
            v-model="formData.description"
            required
            rows="3"
            class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Prioridad *</label>
            <select
              v-model="formData.priority"
              required
              class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Estado</label>
            <select
              v-model="formData.status"
              class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
            >
              <option value="PENDING">Pendiente</option>
              <option value="IN_PROGRESS">En Progreso</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Categoría *</label>
            <select
              v-model="formData.categoryId"
              required
              class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
            >
              <option value="">Seleccionar categoría</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Asignado a</label>
            <select
              v-model="formData.assignedUserId"
              class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
            >
              <option value="">Sin asignar</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Fecha de vencimiento</label>
          <input
            v-model="formData.dueDate"
            type="date"
            class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-foreground mb-2">Etiquetas (separadas por coma)</label>
          <input
            v-model="tagsInput"
            type="text"
            placeholder="etiqueta1, etiqueta2, etiqueta3"
            class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
          />
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            {{ task ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Task, Category, User } from '../types'

const props = defineProps<{
  task?: Task | null
  categories: Category[]
  users: User[]
}>()

const emit = defineEmits<{
  close: []
  save: [data: any]
}>()

const formData = ref({
  title: '',
  description: '',
  priority: 'MEDIUM',
  status: 'PENDING',
  categoryId: '',
  assignedUserId: '',
  dueDate: ''
})

const tagsInput = ref('')

const handleSubmit = () => {
  const data = {
    ...formData.value,
    tags: tagsInput.value ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean) : []
  }
  emit('save', data)
}

onMounted(() => {
  if (props.task) {
    formData.value = {
      title: props.task.title,
      description: props.task.description,
      priority: props.task.priority,
      status: props.task.status,
      categoryId: props.task.categoryId,
      assignedUserId: props.task.assignedUserId || '',
      dueDate: props.task.dueDate ? new Date(props.task.dueDate).toISOString().split('T')[0] : ''
    }
    tagsInput.value = props.task.tags.join(', ')
  }
})
</script>
