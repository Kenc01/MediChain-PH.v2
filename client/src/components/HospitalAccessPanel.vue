<script setup lang="ts">
import { Building2, Clock, CheckCircle, AlertCircle } from 'lucide-vue-next'

const hospitalRequests = [
  {
    id: '1',
    hospital: 'Philippine General Hospital',
    requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'pending' as const
  },
  {
    id: '2',
    hospital: 'St. Luke\'s Medical Center',
    requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'approved' as const
  },
  {
    id: '3',
    hospital: 'Makati Medical Center',
    requestedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    status: 'rejected' as const
  }
]

function getStatusColor(status: string) {
  switch (status) {
    case 'approved': return 'text-green-600 dark:text-green-400'
    case 'rejected': return 'text-red-600 dark:text-red-400'
    default: return 'text-amber-600 dark:text-amber-400'
  }
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-lg flex items-center gap-2">
      <Building2 class="h-5 w-5" />
      Hospital Access
    </h3>
    
    <div class="space-y-3 max-h-64 overflow-y-auto">
      <div
        v-for="request in hospitalRequests"
        :key="request.id"
        class="p-3 bg-card border rounded-lg text-sm"
      >
        <div class="flex items-start justify-between mb-2">
          <p class="font-medium">{{ request.hospital }}</p>
          <span :class="['flex items-center gap-1', getStatusColor(request.status)]">
            <component
              :is="request.status === 'approved' ? CheckCircle : request.status === 'rejected' ? AlertCircle : Clock"
              class="h-3 w-3"
            />
            <span class="text-xs font-semibold capitalize">{{ request.status }}</span>
          </span>
        </div>
        <p class="text-xs text-muted-foreground flex items-center gap-1">
          <Clock class="h-3 w-3" />
          {{ request.requestedAt.toLocaleDateString('en-PH') }}
        </p>
      </div>
    </div>

    <p class="text-xs text-muted-foreground border-t pt-3">
      You maintain complete control over which hospitals can access your records. Every request requires your explicit approval.
    </p>
  </div>
</template>
