<script setup lang="ts">
import { computed } from 'vue'
import { Clock, CheckCircle2, AlertTriangle, Zap, Shield } from 'lucide-vue-next'

interface Activity {
  id: string
  action: string
  description: string
  timestamp: Date
  txHash?: string
}

const props = defineProps<{
  activities: Activity[]
}>()

const getIcon = (action: string) => {
  switch (action) {
    case 'mint':
      return CheckCircle2
    case 'emergency_access':
      return AlertTriangle
    case 'transfer':
      return Zap
    default:
      return Shield
  }
}

const getActionColor = (action: string) => {
  switch (action) {
    case 'mint':
      return 'bg-green-500/10 text-green-600 dark:text-green-400'
    case 'emergency_access':
      return 'bg-red-500/10 text-red-600 dark:text-red-400'
    case 'transfer':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
    default:
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
  }
}

const formattedActivities = computed(() => {
  return props.activities.map(activity => ({
    ...activity,
    formattedTime: new Date(activity.timestamp).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }))
})
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-lg flex items-center gap-2">
      <Clock class="h-5 w-5" />
      Blockchain Activity
    </h3>
    
    <div v-if="formattedActivities.length === 0" class="text-center py-8">
      <Shield class="h-12 w-12 text-muted-foreground mx-auto mb-3" />
      <p class="text-muted-foreground">No blockchain activity yet</p>
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="activity in formattedActivities"
        :key="activity.id"
        class="flex gap-4 p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors"
      >
        <div :class="['w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', getActionColor(activity.action)]">
          <component :is="getIcon(activity.action)" class="h-5 w-5" />
        </div>
        
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm capitalize">{{ activity.action.replace(/_/g, ' ') }}</p>
          <p class="text-sm text-muted-foreground">{{ activity.description }}</p>
          <div class="flex items-center gap-4 mt-2 flex-wrap">
            <span class="text-xs text-muted-foreground">{{ activity.formattedTime }}</span>
            <span v-if="activity.txHash" class="text-xs font-mono bg-muted px-2 py-1 rounded">
              {{ activity.txHash.slice(0, 10) }}...
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
