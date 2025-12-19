<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { AlertTriangle, Shield, Clock, X, Phone, MapPin, Bell } from 'lucide-vue-next'
import { usePatientStore } from '../../stores/patientStore'
import { blockchain } from '@/utils/blockchainMock'

const patientStore = usePatientStore()
const showConfirmModal = ref(false)
const showDeactivateModal = ref(false)
const emergencyPassword = ref('')
const countdown = ref({ hours: 0, minutes: 0, seconds: 0 })
const locationSharing = ref(false)
const notificationSent = ref(false)
let countdownInterval: ReturnType<typeof setInterval> | null = null

const isActive = computed(() => patientStore.isEmergencyMode)

function updateCountdown() {
  if (!patientStore.emergencyModeExpiry || !patientStore.isEmergencyMode) {
    countdown.value = { hours: 0, minutes: 0, seconds: 0 }
    return
  }
  
  const now = new Date()
  const diff = patientStore.emergencyModeExpiry.getTime() - now.getTime()
  
  if (diff <= 0) {
    patientStore.toggleEmergency()
    countdown.value = { hours: 0, minutes: 0, seconds: 0 }
    return
  }
  
  countdown.value = {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

function activateEmergency() {
  patientStore.toggleEmergency(emergencyPassword.value || undefined)
  showConfirmModal.value = false
  emergencyPassword.value = ''
}

function deactivateEmergency() {
  patientStore.toggleEmergency()
  showDeactivateModal.value = false
}

function callEmergencyContact(phone: string) {
  window.location.href = `tel:${phone}`
}

function shareLocation() {
  locationSharing.value = true
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      blockchain.logEmergencyAccess('location-shared', {
        type: 'location_share',
        latitude,
        longitude,
        timestamp: Date.now()
      })
    })
  }
}

function notifyEmergencyContacts() {
  notificationSent.value = true
  blockchain.logEmergencyAccess('emergency-notification', {
    type: 'emergency_notification',
    message: 'Emergency alert sent to all registered contacts',
    timestamp: Date.now()
  })
  setTimeout(() => {
    notificationSent.value = false
  }, 3000)
}

onMounted(() => {
  patientStore.restoreEmergencyState()
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

watch(() => patientStore.isEmergencyMode, () => {
  updateCountdown()
})
</script>

<template>
  <div class="space-y-4">
    <div 
      v-if="isActive"
      class="bg-red-500 text-white rounded-lg p-4 animate-pulse"
      data-testid="emergency-banner"
    >
      <div class="flex items-center gap-3">
        <AlertTriangle class="h-6 w-6 flex-shrink-0" />
        <div class="flex-1">
          <p class="font-bold">EMERGENCY ACCESS ACTIVE</p>
          <p class="text-sm opacity-90">Your critical health data is accessible via QR code</p>
        </div>
      </div>
    </div>

    <div class="bg-card border rounded-lg p-6" :class="{ 'border-red-500': isActive }">
      <div class="flex flex-col md:flex-row md:items-center gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="isActive ? 'bg-red-500/10' : 'bg-muted'"
            >
              <Shield :class="isActive ? 'h-5 w-5 text-red-500' : 'h-5 w-5 text-muted-foreground'" />
            </div>
            <div>
              <h3 class="font-semibold">Emergency Mode</h3>
              <p class="text-sm text-muted-foreground">
                {{ isActive ? 'Currently active' : 'Enable for emergency access' }}
              </p>
            </div>
          </div>
          
          <p class="text-sm text-muted-foreground mb-4">
            <template v-if="isActive">
              First responders and medical personnel can scan your QR code to view your critical health information including blood type, allergies, medications, and emergency contacts.
            </template>
            <template v-else>
              When enabled, your QR code will provide access to your critical health information for 24 hours. Use this in case of medical emergencies.
            </template>
          </p>
          
          <div v-if="isActive" class="flex items-center gap-2 text-sm mb-4" data-testid="countdown-timer">
            <Clock class="h-4 w-4 text-muted-foreground" />
            <span class="font-mono">
              Expires in: {{ countdown.hours.toString().padStart(2, '0') }}:{{ countdown.minutes.toString().padStart(2, '0') }}:{{ countdown.seconds.toString().padStart(2, '0') }}
            </span>
          </div>
          
          <div v-if="isActive && patientStore.emergencyCode" class="p-3 bg-muted rounded-md mb-4">
            <p class="text-xs text-muted-foreground mb-1">Emergency Access Code:</p>
            <p class="font-mono font-bold text-lg" data-testid="emergency-code">{{ patientStore.emergencyCode }}</p>
          </div>
        </div>
        
        <div class="flex-shrink-0">
          <button 
            v-if="!isActive"
            @click="showConfirmModal = true"
            class="w-full md:w-auto px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105"
            data-testid="activate-emergency-btn"
          >
            <AlertTriangle class="h-5 w-5" />
            ACTIVATE EMERGENCY MODE
          </button>
          <button 
            v-else
            @click="showDeactivateModal = true"
            class="w-full md:w-auto px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg font-medium flex items-center justify-center gap-2"
            data-testid="deactivate-emergency-btn"
          >
            <X class="h-5 w-5" />
            Deactivate Emergency Mode
          </button>
        </div>
      </div>
    </div>

    <!-- Emergency Actions -->
    <div v-if="isActive" class="grid grid-cols-2 md:grid-cols-3 gap-3">
      <button
        @click="notifyEmergencyContacts"
        :class="[
          'px-4 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all',
          notificationSent 
            ? 'bg-green-600 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        ]"
      >
        <Bell :class="notificationSent ? 'h-4 w-4 animate-bounce' : 'h-4 w-4'" />
        {{ notificationSent ? 'Notified!' : 'Notify' }}
      </button>
      
      <button
        @click="shareLocation"
        :class="[
          'px-4 py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all',
          locationSharing 
            ? 'bg-green-600 text-white' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        ]"
      >
        <MapPin class="h-4 w-4" />
        {{ locationSharing ? 'Sharing...' : 'Share Location' }}
      </button>
    </div>

    <div class="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
      <div class="flex gap-3">
        <AlertTriangle class="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div class="text-sm text-amber-800 dark:text-amber-200">
          <p class="font-medium mb-1">Important Notice</p>
          <p class="opacity-80">
            When Emergency Mode is active, anyone with access to your QR code can view your critical health information. 
            Only enable this feature during actual medical emergencies. Access will automatically expire after 24 hours.
          </p>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div 
        v-if="showConfirmModal" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showConfirmModal = false"
      >
        <div class="bg-card border rounded-xl p-6 max-w-md w-full shadow-xl">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle class="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h3 class="font-bold text-lg">Activate Emergency Mode?</h3>
              <p class="text-sm text-muted-foreground">This action enables health data sharing</p>
            </div>
          </div>
          
          <div class="space-y-4 mb-6">
            <p class="text-sm text-muted-foreground">
              Activating Emergency Mode will allow anyone who scans your QR code to access your critical health information for the next 24 hours.
            </p>
            
            <div>
              <label class="block text-sm font-medium mb-2">
                Optional: Set an access code
              </label>
              <input 
                v-model="emergencyPassword"
                type="text"
                placeholder="Leave blank for auto-generated code"
                class="w-full px-3 py-2 border rounded-md bg-background"
              />
              <p class="text-xs text-muted-foreground mt-1">
                This code can be shared with specific medical personnel
              </p>
            </div>
          </div>
          
          <div class="flex gap-3">
            <button 
              @click="showConfirmModal = false"
              class="flex-1 px-4 py-2 border rounded-md hover:bg-muted"
            >
              Cancel
            </button>
            <button 
              @click="activateEmergency"
              class="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium"
              data-testid="confirm-activate-btn"
            >
              Activate
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div 
        v-if="showDeactivateModal" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showDeactivateModal = false"
      >
        <div class="bg-card border rounded-xl p-6 max-w-md w-full shadow-xl">
          <h3 class="font-bold text-lg mb-2">Deactivate Emergency Mode?</h3>
          <p class="text-sm text-muted-foreground mb-6">
            This will immediately revoke emergency access to your health information. Any QR codes scanned after this will not show your data.
          </p>
          
          <div class="flex gap-3">
            <button 
              @click="showDeactivateModal = false"
              class="flex-1 px-4 py-2 border rounded-md hover:bg-muted"
            >
              Cancel
            </button>
            <button 
              @click="deactivateEmergency"
              class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 font-medium"
              data-testid="confirm-deactivate-btn"
            >
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
