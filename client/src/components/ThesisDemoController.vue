<script setup lang="ts">
import { Play, Square, Settings } from 'lucide-vue-next'
import { useThesisStore } from '../stores/thesisStore'

const thesisStore = useThesisStore()

const emit = defineEmits<{
  'run-scenario': [scenarioId: string]
}>()

function runScenario(scenarioId: string) {
  const scenario = thesisStore.scenarios.find(s => s.id === scenarioId)
  if (scenario) {
    thesisStore.setScenario(scenario)
    emit('run-scenario', scenarioId)
  }
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-lg flex items-center gap-2">
      <Settings class="h-5 w-5" />
      Demo Controller
    </h3>
    
    <div class="space-y-2">
      <div class="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div :class="['w-3 h-3 rounded-full', thesisStore.isThesisMode ? 'bg-green-500 animate-pulse' : 'bg-gray-300']"></div>
        <span class="text-sm font-medium">
          {{ thesisStore.isThesisMode ? 'Thesis Mode: ACTIVE' : 'Thesis Mode: Inactive' }}
        </span>
      </div>

      <button
        @click="thesisStore.toggleThesisMode()"
        :class="['w-full px-4 py-2 rounded font-medium flex items-center justify-center gap-2 transition-colors', thesisStore.isThesisMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white']"
      >
        <component :is="thesisStore.isThesisMode ? Square : Play" class="h-4 w-4" />
        {{ thesisStore.isThesisMode ? 'Stop' : 'Start' }} Thesis Mode
      </button>
    </div>

    <div class="border-t pt-3">
      <p class="text-xs font-semibold text-muted-foreground mb-2">Run Scenarios:</p>
      <div class="space-y-2">
        <button
          v-for="scenario in thesisStore.scenarios"
          :key="scenario.id"
          @click="runScenario(scenario.id)"
          class="w-full text-left px-3 py-2 bg-card border rounded hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm"
        >
          <p class="font-medium">{{ scenario.name }}</p>
          <p class="text-xs text-muted-foreground">{{ scenario.description }}</p>
        </button>
      </div>
    </div>
  </div>
</template>
