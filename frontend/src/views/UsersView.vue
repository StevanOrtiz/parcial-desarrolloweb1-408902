<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold text-foreground">Usuarios</h2>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2"
      >
        <UserPlus class="w-5 h-5" />
        Nuevo Usuario
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="user in users"
        :key="user.id"
        class="bg-card rounded-lg border border-border p-6"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <User class="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-foreground">{{ user.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ user.email }}</p>
            </div>
          </div>
          <button
            @click="deleteUser(user.id)"
            class="p-1 hover:bg-destructive/10 rounded transition-colors"
          >
            <Trash2 class="w-4 h-4 text-destructive" />
          </button>
        </div>
        <span
          :class="[
            'inline-block px-2 py-1 rounded text-xs font-medium',
            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
          ]"
        >
          {{ user.role }}
        </span>
      </div>
    </div>

    <!-- Modal crear -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-card rounded-lg border border-border p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold text-foreground mb-6">Nuevo Usuario</h2>
        <form @submit.prevent="createUser" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Nombre *</label>
            <input
              v-model="newUser.name"
              type="text"
              required
              class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Email *</label>
            <input
              v-model="newUser.email"
              type="email"
              required
              class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-foreground mb-2">Rol *</label>
            <select
              v-model="newUser.role"
              required
              class="w-full px-3 py-2 bg-background border border-input rounded-lg text-foreground"
            >
              <option value="USER">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
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
import { UserPlus, User, Trash2 } from 'lucide-vue-next'
import { userService } from '../services/api'
import type { User as UserType } from '../types'

const users = ref<UserType[]>([])
const showCreateModal = ref(false)
const newUser = ref({
  name: '',
  email: '',
  role: 'USER' as 'USER' | 'ADMIN'
})

const loadUsers = async () => {
  try {
    users.value = await userService.getUsers()
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

const createUser = async () => {
  try {
    await userService.createUser(newUser.value)
    showCreateModal.value = false
    newUser.value = { name: '', email: '', role: 'USER' }
    await loadUsers()
  } catch (error) {
    console.error('Error creating user:', error)
  }
}

const deleteUser = async (id: string) => {
  if (!confirm('¿Estás seguro de eliminar este usuario?')) return
  
  try {
    await userService.deleteUser(id)
    await loadUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

onMounted(loadUsers)
</script>
