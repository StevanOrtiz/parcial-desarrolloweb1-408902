<template>
  <div class="space-y-6">
    <h2 class="text-3xl font-bold text-foreground">Estadísticas</h2>

    <div v-if="stats" class="space-y-6">
      <!-- Total -->
      <div class="bg-card rounded-lg border border-border p-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
            <CheckSquare class="w-8 h-8 text-primary" />
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Total de Tareas</p>
            <p class="text-4xl font-bold text-foreground">{{ stats.total }}</p>
          </div>
        </div>
      </div>

      <!-- Por Estado -->
      <div>
        <h3 class="text-xl font-semibold text-foreground mb-4">Por Estado</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-card rounded-lg border border-border p-4">
            <p class="text-sm text-muted-foreground mb-2">Pendientes</p>
            <p class="text-3xl font-bold text-gray-700">{{ stats.byStatus.pending }}</p>
          </div>
          <div class="bg-card rounded-lg border border-border p-4">
            <p class="text-sm text-muted-foreground mb-2">En Progreso</p>
            <p class="text-3xl font-bold text-blue-600">{{ stats.byStatus.inProgress }}</p>
          </div>
          <div class="bg-card rounded-lg border border-border p-4">
            <p class="text-sm text-muted-foreground mb-2">Completadas</p>
            <p class="text-3xl font-bold text-green-600">{{ stats.byStatus.completed }}</p>
          </div>
          <div class="bg-card rounded-lg border border-border p-4">
            <p class="text-sm text-muted-foreground mb-2">Canceladas</p>
            <p class="text-3xl font-bold text-red-600">{{ stats.byStatus.cancelled }}</p>
          </div>
        </div>
      </div>

      <!-- Por Prioridad -->
      <div>
        <h3 class="text-xl font-semibold text-foreground mb-4">Por Prioridad</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-card rounded-lg border border-border p-4">
            <p class="text-sm text-muted-foreground mb-2">Baja</p>
            <p class="text-3xl font-bold text-blue-600">{{ stats.byPriority.low }}</p>
          </div>
          <div class="bg-card rounded-lg border border-border p-4">
            <p class="text-sm text-muted-foreground mb-2">Media</p>
            <p class="text-3xl font-bold text-yellow-600">{{ stats.byPriority.medium }}</p>
          </div>
          <div class="bg-card rounded-lg border border-border p-4">
            <p class="text-sm text-muted-foreground mb-2">Alta</p>
            <p class="text-3xl font-bold text-orange-600">{{ stats.byPriority.high }}</p>
          </div>
          <div class="bg-card rounded-lg border border-border p-4">
            <p class="text-sm text-muted-foreground mb-2">Urgente</p>
            <p class="text-3xl font-bold text-red-600">{{ stats.byPriority.urgent }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CheckSquare } from 'lucide-vue-next'
import { taskService } from '../services/api'

const stats = ref<any>(null)

const loadStats = async () => {
  try {
    stats.value = await taskService.getStats()
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

onMounted(loadStats)
</script>
