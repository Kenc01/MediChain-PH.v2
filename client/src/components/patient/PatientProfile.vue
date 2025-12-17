<script setup lang="ts">
import { computed, ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { User, Droplet, AlertTriangle, Pill, Phone, Heart, Copy, Check } from 'lucide-vue-next'
import { usePatientStore } from '../../stores/patientStore'

const patientStore = usePatientStore()
const copied = ref(false)

const props = defineProps<{
  patient: {
    nftId: string
    fullName: string
    bloodType: string
    allergies: string[]
    currentMedications: string[]
    emergencyContacts: { name: string; relationship: string; phone: string }[]
    dateOfBirth?: Date
    phone?: string
    email?: string
    address?: string
  }
}>()

const qrValue = computed(() => {
  const baseUrl = window.location.origin
  if (patientStore.isEmergencyMode) {
    return `${baseUrl}/emergency/${props.patient.nftId}?code=${patientStore.emergencyCode}`
  }
  return `${baseUrl}/emergency/${props.patient.nftId}`
})

const age = computed(() => {
  if (!props.patient.dateOfBirth) return null
  const today = new Date()
  const birth = new Date(props.patient.dateOfBirth)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
})

function copyQrUrl() {
  navigator.clipboard.writeText(qrValue.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-card border rounded-lg p-6">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="flex-shrink-0">
          <div class="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <User class="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <div class="flex-1 space-y-2">
          <h2 class="text-2xl font-bold" data-testid="patient-name">{{ patient.fullName }}</h2>
          <div class="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span v-if="age" class="flex items-center gap-1">
              <User class="h-4 w-4" /> {{ age }} years old
            </span>
            <span v-if="patient.phone" class="flex items-center gap-1">
              <Phone class="h-4 w-4" /> {{ patient.phone }}
            </span>
          </div>
          <p class="text-xs font-mono text-muted-foreground" data-testid="patient-nft-id">
            NFT ID: {{ patient.nftId }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="bg-card border rounded-lg p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <Droplet class="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 class="font-semibold">Blood Type</h3>
            <p class="text-xs text-muted-foreground">Critical info</p>
          </div>
        </div>
        <p class="text-4xl font-bold text-red-500" data-testid="blood-type">
          {{ patient.bloodType }}
        </p>
      </div>

      <div class="bg-card border rounded-lg p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
            <AlertTriangle class="h-5 w-5 text-orange-500" />
          </div>
          <div>
            <h3 class="font-semibold">Allergies</h3>
            <p class="text-xs text-muted-foreground">{{ patient.allergies.length }} known</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2" data-testid="allergies-list">
          <span 
            v-for="allergy in patient.allergies" 
            :key="allergy"
            class="px-2 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded text-sm font-medium"
          >
            {{ allergy }}
          </span>
          <span v-if="!patient.allergies.length" class="text-muted-foreground text-sm">
            None recorded
          </span>
        </div>
      </div>

      <div class="bg-card border rounded-lg p-5">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Pill class="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 class="font-semibold">Medications</h3>
            <p class="text-xs text-muted-foreground">{{ patient.currentMedications.length }} active</p>
          </div>
        </div>
        <div class="flex flex-wrap gap-2" data-testid="medications-list">
          <span 
            v-for="med in patient.currentMedications" 
            :key="med"
            class="px-2 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-sm"
          >
            {{ med }}
          </span>
          <span v-if="!patient.currentMedications.length" class="text-muted-foreground text-sm">
            None recorded
          </span>
        </div>
      </div>
    </div>

    <div class="bg-card border rounded-lg p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center">
          <Heart class="h-5 w-5 text-pink-500" />
        </div>
        <div>
          <h3 class="font-semibold">Emergency Contacts</h3>
          <p class="text-xs text-muted-foreground">People to call in emergencies</p>
        </div>
      </div>
      <div class="grid sm:grid-cols-2 gap-4" data-testid="emergency-contacts">
        <div 
          v-for="contact in patient.emergencyContacts" 
          :key="contact.phone"
          class="p-4 bg-muted/50 rounded-lg"
        >
          <p class="font-medium">{{ contact.name }}</p>
          <p class="text-sm text-muted-foreground">{{ contact.relationship }}</p>
          <a :href="`tel:${contact.phone}`" class="text-sm text-primary hover:underline">
            {{ contact.phone }}
          </a>
        </div>
        <div v-if="!patient.emergencyContacts.length" class="text-muted-foreground text-sm">
          No emergency contacts added
        </div>
      </div>
    </div>

    <div class="bg-card border rounded-lg p-6" :class="{ 'ring-2 ring-red-500 bg-red-50 dark:bg-red-950/20': patientStore.isEmergencyMode }">
      <div class="flex flex-col md:flex-row items-center gap-6">
        <div class="flex-shrink-0 p-3 bg-white rounded-xl shadow-sm">
          <QrcodeVue 
            :value="qrValue" 
            :size="160"
            level="H"
            data-testid="qr-code"
          />
        </div>
        <div class="flex-1 text-center md:text-left">
          <h3 class="font-semibold text-lg mb-2">
            {{ patientStore.isEmergencyMode ? 'Emergency QR Code (ACTIVE)' : 'Emergency QR Code' }}
          </h3>
          <p class="text-sm text-muted-foreground mb-3">
            <template v-if="patientStore.isEmergencyMode">
              Emergency access is <span class="text-red-500 font-medium">ACTIVE</span>. 
              Anyone scanning this QR code can view your critical health information.
            </template>
            <template v-else>
              Share this QR code with first responders during emergencies. 
              Enable Emergency Mode to allow full access to your health data.
            </template>
          </p>
          <div class="flex flex-wrap gap-2 justify-center md:justify-start">
            <button 
              @click="copyQrUrl"
              class="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-muted rounded-md hover:bg-muted/80"
            >
              <Check v-if="copied" class="h-4 w-4 text-green-500" />
              <Copy v-else class="h-4 w-4" />
              {{ copied ? 'Copied!' : 'Copy Link' }}
            </button>
          </div>
          <p class="text-xs font-mono mt-3 p-2 bg-muted rounded break-all">
            {{ qrValue }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
