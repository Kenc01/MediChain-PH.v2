<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { AlertTriangle, Droplet, AlertCircle, Clock, MapPin, Phone, X, CheckCircle2 } from 'lucide-vue-next'
import { blockchain } from '@/utils/blockchainMock'

const props = withDefaults(defineProps<{
  patientNftId?: string
  bloodType?: string
  allergies?: string[]
  name?: string
  emergencyContacts?: { name: string; phone: string; relationship: string }[]
}>(), {
  patientNftId: 'DEMO-001',
  bloodType: 'O+',
  allergies: () => ['Penicillin'],
  name: 'Demo Patient',
  emergencyContacts: () => [
    { name: 'Maria Santos', phone: '+63 917 123 4567', relationship: 'Spouse' },
    { name: 'Pedro Santos', phone: '+63 918 234 5678', relationship: 'Son' }
  ]
})

const emit = defineEmits<{
  close: []
  accessed: [accessCode: string]
}>()

const stage = ref<'scan' | 'critical' | 'full' | 'timer'>('scan')
const accessCode = ref('')
const timeRemaining = ref(24)
let timerInterval: ReturnType<typeof setInterval> | null = null

const criticalInfo = computed(() => ({
  name: props.name,
  bloodType: props.bloodType,
  allergies: props.allergies,
  accessGrantedAt: new Date().toLocaleTimeString()
}))

function startEmergencyAccess() {
  // Log emergency access to blockchain
  const accessLog = {
    type: 'emergency_access',
    patientId: props.patientNftId,
    timestamp: Date.now(),
    duration: 24,
    accessedData: 'critical_health_info',
    paramedic: 'Demo Paramedic Unit',
    reason: 'Emergency Medical Response'
  }
  blockchain.logEmergencyAccess(props.patientNftId || 'unknown', accessLog)
  
  // Generate access code
  accessCode.value = `EMG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  
  stage.value = 'critical'
  startTimer()
  
  emit('accessed', accessCode.value)
}

function startTimer() {
  timeRemaining.value = 24
  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      if (timerInterval) clearInterval(timerInterval)
      stage.value = 'timer'
    }
  }, 1000 * 60 * 60) // Every hour in real time (simplified for demo)
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="bg-red-600 text-white p-6 flex items-center justify-between sticky top-0">
        <div class="flex items-center gap-3">
          <AlertTriangle class="h-6 w-6" />
          <h2 class="font-bold text-xl">Emergency Medical Access</h2>
        </div>
        <button @click="emit('close')" class="p-1 hover:bg-red-700 rounded">
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="p-6 space-y-6">
        <!-- Scan Stage -->
        <div v-if="stage === 'scan'" class="text-center space-y-4">
          <div class="bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-8 animate-pulse">
            <p class="text-lg font-semibold text-blue-900 dark:text-blue-100">🔍 Scanning Patient QR Code...</p>
            <p class="text-sm text-blue-700 dark:text-blue-300 mt-2">Paramedic emergency access detected</p>
          </div>
          
          <button
            @click="startEmergencyAccess"
            class="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <AlertTriangle class="h-5 w-5" />
            Grant Emergency Access
          </button>
          <p class="text-xs text-muted-foreground">Access will be limited to 24 hours. All access is logged to blockchain.</p>
        </div>

        <!-- Critical Info Stage -->
        <div v-else-if="stage === 'critical'" class="space-y-4">
          <div class="bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-lg p-6 space-y-4">
            <div class="flex items-center gap-2 mb-4">
              <CheckCircle2 class="h-5 w-5 text-green-600" />
              <p class="font-bold text-green-600">Emergency Access Granted</p>
            </div>

            <!-- Critical Health Info -->
            <div class="space-y-3">
              <div class="bg-white dark:bg-slate-800 rounded p-4 border-2 border-red-300 dark:border-red-700">
                <p class="text-xs text-muted-foreground uppercase font-semibold mb-1">Patient Name</p>
                <p class="text-2xl font-bold">{{ criticalInfo.name }}</p>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="bg-white dark:bg-slate-800 rounded p-4 border-2 border-red-300 dark:border-red-700">
                  <p class="text-xs text-muted-foreground uppercase font-semibold mb-2 flex items-center gap-1">
                    <Droplet class="h-4 w-4" /> Blood Type
                  </p>
                  <p class="text-3xl font-bold text-red-600">{{ criticalInfo.bloodType }}</p>
                </div>

                <div class="bg-white dark:bg-slate-800 rounded p-4 border-2 border-red-300 dark:border-red-700">
                  <p class="text-xs text-muted-foreground uppercase font-semibold mb-2 flex items-center gap-1">
                    <Clock class="h-4 w-4" /> Access Granted
                  </p>
                  <p class="text-sm font-mono">{{ criticalInfo.accessGrantedAt }}</p>
                </div>
              </div>

              <div class="bg-white dark:bg-slate-800 rounded p-4 border-2 border-orange-300 dark:border-orange-700">
                <p class="text-xs text-muted-foreground uppercase font-semibold mb-2 flex items-center gap-1">
                  <AlertCircle class="h-4 w-4" /> Critical Allergies
                </p>
                <div v-if="criticalInfo.allergies.length" class="flex flex-wrap gap-2">
                  <span 
                    v-for="allergy in criticalInfo.allergies" 
                    :key="allergy"
                    class="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold"
                  >
                    ⚠️ {{ allergy }}
                  </span>
                </div>
                <p v-else class="text-sm text-green-600">No known allergies</p>
              </div>
            </div>

            <!-- Access Code -->
            <div class="bg-slate-100 dark:bg-slate-800 rounded p-4 border-2 border-slate-300 dark:border-slate-600">
              <p class="text-xs text-muted-foreground uppercase font-semibold mb-2">Access Code</p>
              <code class="text-lg font-mono font-bold tracking-widest">{{ accessCode }}</code>
            </div>

              <!-- Timer -->
            <div class="bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded p-4">
              <div class="flex items-center gap-3 mb-2">
                <Clock class="h-5 w-5 text-blue-600" />
                <div>
                  <p class="text-xs font-semibold text-blue-900 dark:text-blue-100">Access Expires In</p>
                  <p class="text-2xl font-bold text-blue-600">{{ timeRemaining }} hours</p>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                <p class="text-xs text-blue-700 dark:text-blue-300">✓ All access automatically logged to blockchain</p>
                <p class="text-xs text-blue-700 dark:text-blue-300">✓ Audit trail cannot be modified</p>
                <p class="text-xs text-blue-700 dark:text-blue-300">✓ Patient maintains data ownership</p>
              </div>
            </div>

            <!-- Emergency Contacts -->
            <div class="bg-white dark:bg-slate-800 rounded p-4 border-2 border-slate-200 dark:border-slate-700">
              <p class="text-xs text-muted-foreground uppercase font-semibold mb-3 flex items-center gap-1">
                <Phone class="h-4 w-4" /> Emergency Contacts
              </p>
              <div class="space-y-2">
                <div 
                  v-for="contact in emergencyContacts" 
                  :key="contact.phone"
                  class="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700 rounded"
                >
                  <div>
                    <p class="font-medium text-sm">{{ contact.name }}</p>
                    <p class="text-xs text-muted-foreground">{{ contact.relationship }}</p>
                  </div>
                  <a :href="`tel:${contact.phone}`" class="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700">
                    Call
                  </a>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="stage = 'full'"
            class="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
          >
            View Full Medical History
          </button>
        </div>

        <!-- Full History Stage -->
        <div v-else-if="stage === 'full'" class="space-y-4">
          <p class="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 p-3 rounded">
            ⚠️ Full medical history is now visible. All access is logged to the blockchain.
          </p>
          
          <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded border border-slate-200 dark:border-slate-700 space-y-3">
            <p class="text-sm font-semibold">Complete patient medical data is available for emergency treatment decisions.</p>
            <p class="text-xs text-muted-foreground">This access will be automatically revoked after 24 hours.</p>
          </div>

          <button
            @click="emit('close')"
            class="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Close Emergency Access
          </button>
        </div>

        <!-- Timer Expired Stage -->
        <div v-else-if="stage === 'timer'" class="text-center space-y-4">
          <div class="bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg p-6">
            <p class="text-lg font-semibold text-gray-900 dark:text-gray-100">⏰ Access Expired</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">24-hour emergency access period has ended.</p>
            <p class="text-xs text-muted-foreground mt-3">All access has been logged to the blockchain.</p>
          </div>
          
          <button
            @click="emit('close')"
            class="w-full px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
