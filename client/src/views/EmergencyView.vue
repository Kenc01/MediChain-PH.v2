<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { Heart, AlertTriangle, Droplet, Pill, Phone, User, ArrowLeft, Clock } from 'lucide-vue-next'

const route = useRoute()
const patientData = ref<any>(null)
const isLoading = ref(true)
const error = ref('')
const accessTime = ref(new Date())

onMounted(async () => {
  const nftId = route.params.nftId as string
  await fetchPatientData(nftId)
})

async function fetchPatientData(nftId: string) {
  try {
    const response = await fetch(`/api/patient/${nftId}`)
    
    if (response.ok) {
      patientData.value = await response.json()
      
      await fetch('/api/emergency-access/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientRecordId: patientData.value.id,
          accessedBy: 'Emergency Responder',
          reason: 'Emergency access via QR code'
        })
      })
    } else {
      error.value = 'Patient record not found'
    }
  } catch (e) {
    error.value = 'Failed to load patient data'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b bg-red-500 text-white sticky top-0 z-50">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <AlertTriangle class="h-6 w-6" />
          <span class="font-bold text-lg">EMERGENCY ACCESS</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <Clock class="h-4 w-4" />
          {{ accessTime.toLocaleTimeString() }}
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6 max-w-2xl">
      <RouterLink 
        to="/emergency" 
        class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft class="h-4 w-4" />
        Back to Scanner
      </RouterLink>
      
      <div v-if="isLoading" class="text-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
        <p class="mt-4 text-muted-foreground">Loading emergency data...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-12">
        <AlertTriangle class="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 class="text-xl font-bold mb-2">Access Error</h2>
        <p class="text-muted-foreground">{{ error }}</p>
      </div>
      
      <div v-else class="space-y-6">
        <div class="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-md p-4">
          <p class="text-sm text-red-700 dark:text-red-300">
            This is emergency access only. All access is logged and monitored.
          </p>
        </div>
        
        <div class="bg-card border rounded-md p-6">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User class="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 class="text-xl font-bold" data-testid="text-patient-name">
                {{ patientData?.patientName || 'Unknown Patient' }}
              </h2>
              <p class="text-sm text-muted-foreground">NFT ID: {{ patientData?.nftId }}</p>
            </div>
          </div>
          
          <div class="grid gap-4">
            <div class="p-4 bg-red-500/10 rounded-md">
              <div class="flex items-center gap-2 mb-2">
                <Droplet class="h-5 w-5 text-red-500" />
                <span class="font-semibold">Blood Type</span>
              </div>
              <p class="text-3xl font-bold text-red-500" data-testid="text-bloodtype">
                {{ patientData?.bloodType || 'Unknown' }}
              </p>
            </div>
            
            <div class="p-4 bg-orange-500/10 rounded-md">
              <div class="flex items-center gap-2 mb-2">
                <AlertTriangle class="h-5 w-5 text-orange-500" />
                <span class="font-semibold">Allergies</span>
              </div>
              <div class="flex flex-wrap gap-2" data-testid="list-allergies">
                <span 
                  v-for="allergy in (patientData?.allergies || [])" 
                  :key="allergy"
                  class="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-medium"
                >
                  {{ allergy }}
                </span>
                <span v-if="!patientData?.allergies?.length" class="text-muted-foreground">
                  No known allergies
                </span>
              </div>
            </div>
            
            <div class="p-4 bg-blue-500/10 rounded-md">
              <div class="flex items-center gap-2 mb-2">
                <Pill class="h-5 w-5 text-blue-500" />
                <span class="font-semibold">Current Medications</span>
              </div>
              <div class="flex flex-wrap gap-2" data-testid="list-medications">
                <span 
                  v-for="med in (patientData?.medications || [])" 
                  :key="med"
                  class="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-medium"
                >
                  {{ med }}
                </span>
                <span v-if="!patientData?.medications?.length" class="text-muted-foreground">
                  No current medications
                </span>
              </div>
            </div>
            
            <div v-if="patientData?.emergencyContacts?.length" class="p-4 bg-green-500/10 rounded-md">
              <div class="flex items-center gap-2 mb-2">
                <Phone class="h-5 w-5 text-green-500" />
                <span class="font-semibold">Emergency Contacts</span>
              </div>
              <div class="space-y-2" data-testid="list-contacts">
                <div 
                  v-for="contact in patientData.emergencyContacts" 
                  :key="contact.phone"
                  class="flex items-center justify-between"
                >
                  <div>
                    <p class="font-medium">{{ contact.name }}</p>
                    <p class="text-sm text-muted-foreground">{{ contact.relationship }}</p>
                  </div>
                  <a 
                    :href="`tel:${contact.phone}`" 
                    class="px-4 py-2 bg-green-500 text-white rounded-md font-medium"
                  >
                    {{ contact.phone }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
