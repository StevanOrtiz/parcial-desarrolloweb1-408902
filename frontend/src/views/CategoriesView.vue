<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-foreground">Categorías</h2>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2"
      >
        <Plus class="w-5 h-5" />
        Nueva Categoría
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-card rounded-lg border border-border p-6"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div
              class="w-4 h-4 rounded-full"
              :style="{ backgroundColor: category.color }"
            ></div>
            <h3 class="text-xl font-semibold text-foreground">{{ category.name }}</h3>
          </div>
          <button
            @click="deleteCategory(category.id)"
            class="p-1 hover:bg-destructive/10 rounded transition-colors"
          >
            <Trash2 class="w-4 h-4 text-destructive" />
          </button>
        </div>
        <p class="text-muted-foreground">{{ category.description }}</p>
      </div>
    </div>

    <!-- Modal crear -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-card rounded-lg border border-border p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold text-foreground mb-6">Nueva Categoría</h2>
        <form @submit.prevent="createCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Nombre *</label>
            <input
              v-model="newCategory.name"
              type="text"
              required
              class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Descripción *</label>
            <textarea
              v-model="newCategory.description"
              required
              rows="3"
              class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Color *</label>
            <input
              v-model="newCategory.color"
              type="color"
              required
              class="w-full h-12 px-3 py-2 bg-background border border-input rounded-lg"
            />
          </div>
          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Trash2 } from 'lucide-vue-next'
import { categoryService } from '../services/api'
import type { Category } from '../types'

const categories = ref<Category[]>([])
const showCreateModal = ref(false)
const newCategory = ref({
  name: '',
  description: '',
  color: '#3b82f6'
})

const loadCategories = async () => {
  try {
    categories.value = await categoryService.getCategories()
  } catch (error) {
    console.error('Error loading categories:', error)
  }
}

const createCategory = async () => {
  try {
    await categoryService.createCategory(newCategory.value)
    showCreateModal.value = false
    newCategory.value = { name: '', description: '', color: '#3b82f6' }
    await loadCategories()
  } catch (error) {
    console.error('Error creating category:', error)
  }
}

const deleteCategory = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar esta categoría?')) return
  
  try {
    await categoryService.deleteCategory(id)
    await loadCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
  }
}

onMounted(loadCategories)
</script>
