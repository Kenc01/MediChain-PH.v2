<script setup lang="ts">
import { computed, ref } from 'vue'
import QrcodeVue from 'qrcode.vue'
import { User, Droplet, AlertTriangle, Pill, Phone, Heart, Copy, Check, QrCode, Shield, MapPin, Phone as PhoneIcon } from 'lucide-vue-next'
import { usePatientStore } from '../../stores/patientStore'
import EmergencyScenario from '../EmergencyScenario.vue'

const patientStore = usePatientStore()
const copied = ref(false)
const showEmergencyScenario = ref(false)
const qrMode = ref<'normal' | 'emergency'>('normal')

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

const normalQRValue = computed(() => {
  const baseUrl = window.location.origin
  return JSON.stringify({
    type: 'normal',
    patientId: props.patient.nftId,
    name: props.patient.fullName,
    timestamp: Date.now()
  })
})

const emergencyQRValue = computed(() => {
  const baseUrl = window.location.origin
  return `${baseUrl}/emergency/${props.patient.nftId}?emergency=true&code=${patientStore.emergencyCode}`
})

const qrValue = computed(() => {
  return qrMode.value === 'emergency' ? emergencyQRValue.value : normalQRValue.value
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

    <!-- QR Codes Section -->
    <div class="bg-card border rounded-lg p-6 space-y-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold flex items-center gap-2">
          <QrCode class="h-5 w-5" />
          My QR Codes
        </h3>
        <div class="flex gap-2">
          <button
            @click="qrMode = 'normal'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              qrMode === 'normal' 
                ? 'bg-blue-600 text-white' 
                : 'bg-muted hover:bg-muted/80'
            ]"
          >
            <Shield class="h-4 w-4 inline mr-1" />
            Normal
          </button>
          <button
            @click="qrMode = 'emergency'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              qrMode === 'emergency' 
                ? 'bg-red-600 text-white' 
                : 'bg-muted hover:bg-muted/80'
            ]"
          >
            <AlertTriangle class="h-4 w-4 inline mr-1" />
            Emergency
          </button>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Normal QR -->
        <div v-if="qrMode === 'normal'" class="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 border border-blue-200 dark:border-blue-800 space-y-4">
          <div class="space-y-2">
            <p class="font-semibold text-sm">Standard QR Code</p>
            <p class="text-xs text-muted-foreground">Scans with basic profile information</p>
          </div>
          <div class="bg-white p-4 rounded flex justify-center">
            <QrcodeVue :value="normalQRValue" :size="200" level="H" />
          </div>
          <button
            @click="copyQrUrl"
            class="w-full px-3 py-2 border rounded-md font-medium text-sm hover:bg-muted transition-colors flex items-center justify-center gap-2"
          >
            <Copy class="h-4 w-4" />
            {{ copied ? 'Copied!' : 'Copy URL' }}
          </button>
        </div>

        <!-- Emergency QR -->
        <div v-if="qrMode === 'emergency'" class="bg-red-50 dark:bg-red-950 rounded-lg p-6 border-2 border-red-300 dark:border-red-700 space-y-4">
          <div class="space-y-2">
            <p class="font-semibold text-sm text-red-900 dark:text-red-100">🚨 Emergency QR Code</p>
            <p class="text-xs text-red-800 dark:text-red-300">Full 24-hour medical access for paramedics/emergency responders</p>
          </div>
          <div class="bg-white p-4 rounded flex justify-center border-2 border-red-300">
            <QrcodeVue :value="emergencyQRValue" :size="200" level="H" />
          </div>
          <button
            @click="showEmergencyScenario = true"
            class="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <AlertTriangle class="h-4 w-4" />
            Simulate Emergency Scan
          </button>
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

    <!-- Emergency Scenario Modal -->
    <EmergencyScenario
      v-if="showEmergencyScenario"
      :patient-nft-id="patient.nftId"
      :blood-type="patient.bloodType"
      :allergies="patient.allergies"
      :name="patient.fullName"
      :emergency-contacts="patient.emergencyContacts"
      @close="showEmergencyScenario = false"
      @accessed="(code) => {}"
    />
  </div>
</template>
