<script setup lang="ts">
import { ref } from 'vue'
import { Building2, Clock, Check, X } from 'lucide-vue-next'

interface HospitalRequest {
  id: string
  hospitalName: string
  requestedAt: Date
  status: 'pending' | 'approved' | 'rejected'
}

const props = defineProps<{
  requests: HospitalRequest[]
}>()

const emit = defineEmits<{
  approve: [id: string]
  reject: [id: string]
}>()

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
    case 'rejected':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
    default:
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
  }
}

const getStatusLabel = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-lg flex items-center gap-2">
      <Building2 class="h-5 w-5" />
      Hospital Connection Requests
    </h3>
    
    <div v-if="requests.length === 0" class="text-center py-8">
      <Building2 class="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <p class="text-muted-foreground">No hospital requests at this time</p>
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="request in requests"
        :key="request.id"
        :class="['p-4 border rounded-lg', getStatusColor(request.status)]"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-start gap-3 flex-1">
            <div class="w-10 h-10 rounded-lg bg-current/10 flex items-center justify-center flex-shrink-0">
              <Building2 class="h-5 w-5" />
            </div>
            <div>
              <p class="font-medium">{{ request.hospitalName }}</p>
              <div class="flex items-center gap-2 text-sm opacity-75 mt-1">
                <Clock class="h-3 w-3" />
                Requested {{ formatDate(request.requestedAt) }}
              </div>
            </div>
          </div>
          <span class="px-2 py-1 bg-current/20 rounded text-xs font-semibold whitespace-nowrap ml-2">
            {{ getStatusLabel(request.status) }}
          </span>
        </div>

        <div v-if="request.status === 'pending'" class="flex gap-2 pt-3 border-t border-current/20">
          <button
            @click="emit('approve', request.id)"
            class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Check class="h-4 w-4" />
            Approve
          </button>
          <button
            @click="emit('reject', request.id)"
            class="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <X class="h-4 w-4" />
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
