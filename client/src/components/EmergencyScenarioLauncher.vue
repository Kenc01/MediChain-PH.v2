<script setup lang="ts">
import { ref } from 'vue'
import { AlertTriangle, QrCode, Clock } from 'lucide-vue-next'

const isSimulating = ref(false)
const simulationMessage = ref('')

async function launchEmergencySimulation() {
  isSimulating.value = true
  simulationMessage.value = 'Generating emergency QR code...'
  
  await new Promise(resolve => setTimeout(resolve, 500))
  simulationMessage.value = 'Simulating paramedic access...'
  
  await new Promise(resolve => setTimeout(resolve, 500))
  simulationMessage.value = '24-hour access granted'
  
  setTimeout(() => {
    isSimulating.value = false
    simulationMessage.value = ''
  }, 1500)
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-lg flex items-center gap-2">
      <AlertTriangle class="h-5 w-5 text-red-600" />
      Emergency Simulator
    </h3>
    
    <div class="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
      <p class="text-sm text-red-800 dark:text-red-200 mb-3">
        This simulates a real emergency scenario where a paramedic needs instant access to patient data.
      </p>
      
      <button
        @click="launchEmergencySimulation()"
        :disabled="isSimulating"
        class="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <QrCode class="h-5 w-5" />
        {{ isSimulating ? 'Simulating...' : 'Launch Emergency Scenario' }}
      </button>

      <div v-if="simulationMessage" class="mt-3 p-3 bg-red-100 dark:bg-red-900 rounded text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
        <Clock class="h-4 w-4 animate-spin" />
        {{ simulationMessage }}
      </div>

      <div v-else-if="!isSimulating" class="mt-3 p-3 bg-red-100 dark:bg-red-900 rounded text-sm text-red-800 dark:text-red-200">
        ✓ Ready for emergency scenario
      </div>
    </div>
  </div>
</template>
