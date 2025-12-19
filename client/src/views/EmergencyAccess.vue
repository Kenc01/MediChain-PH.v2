<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { Heart, QrCode, AlertTriangle, Camera, X, Keyboard, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const scannerActive = ref(false)
const manualInput = ref(false)
const nftId = ref('')
const error = ref('')
const videoRef = ref<HTMLVideoElement | null>(null)
let stream: MediaStream | null = null

async function startScanner() {
  scannerActive.value = true
  error.value = ''
  
  try {
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    })
    
    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
  } catch (e) {
    error.value = 'Could not access camera. Please use manual entry.'
    scannerActive.value = false
  }
}

function stopScanner() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }
  scannerActive.value = false
}

function handleManualSubmit() {
  if (!nftId.value.trim()) {
    error.value = 'Please enter a valid NFT ID'
    return
  }
  router.push(`/emergency/${nftId.value.trim()}`)
}

onUnmounted(() => {
  stopScanner()
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <RouterLink to="/" class="flex items-center gap-2">
          <Heart class="h-6 w-6 text-primary" />
          <span class="font-bold text-lg">MediChain-PH</span>
        </RouterLink>
        <button 
          @click="router.back()"
          class="p-2 hover:bg-muted rounded-md flex items-center gap-2 text-muted-foreground hover:text-foreground"
          data-testid="button-back"
        >
          <ArrowLeft class="h-4 w-4" />
          <span class="text-sm">Back</span>
        </button>
      </div>
    </header>

    <main class="container mx-auto px-4 py-8 max-w-lg">
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle class="h-8 w-8 text-red-500" />
        </div>
        <h1 class="text-2xl font-bold mb-2" data-testid="text-emergency-title">Emergency Access</h1>
        <p class="text-muted-foreground">
          Scan a patient's QR code or enter their NFT ID to access critical health information.
        </p>
      </div>
      
      <div v-if="error" class="p-4 rounded-md bg-destructive/10 text-destructive text-sm mb-6" data-testid="text-error">
        {{ error }}
      </div>
      
      <div v-if="!scannerActive && !manualInput" class="space-y-4">
        <button
          @click="startScanner"
          class="w-full p-6 bg-card border rounded-md hover-elevate flex items-center gap-4"
          data-testid="button-scan-qr"
        >
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Camera class="h-6 w-6 text-primary" />
          </div>
          <div class="text-left">
            <h3 class="font-semibold">Scan QR Code</h3>
            <p class="text-sm text-muted-foreground">Use camera to scan patient's emergency QR</p>
          </div>
        </button>
        
        <button
          @click="manualInput = true"
          class="w-full p-6 bg-card border rounded-md hover-elevate flex items-center gap-4"
          data-testid="button-manual-entry"
        >
          <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Keyboard class="h-6 w-6 text-primary" />
          </div>
          <div class="text-left">
            <h3 class="font-semibold">Manual Entry</h3>
            <p class="text-sm text-muted-foreground">Type in the patient's NFT ID</p>
          </div>
        </button>
      </div>
      
      <div v-if="scannerActive" class="space-y-4">
        <div class="relative bg-black rounded-md overflow-hidden aspect-square">
          <video 
            ref="videoRef" 
            autoplay 
            playsinline 
            class="w-full h-full object-cover"
          ></video>
          <div class="absolute inset-0 border-4 border-white/30 m-8 rounded-lg"></div>
        </div>
        
        <button
          @click="stopScanner"
          class="w-full py-3 border rounded-md font-medium hover-elevate flex items-center justify-center gap-2"
          data-testid="button-cancel-scan"
        >
          <X class="h-4 w-4" />
          Cancel
        </button>
        
        <p class="text-center text-sm text-muted-foreground">
          Position the QR code within the frame to scan
        </p>
      </div>
      
      <div v-if="manualInput" class="space-y-4">
        <div class="bg-card border rounded-md p-6">
          <h3 class="font-semibold mb-4">Enter Patient NFT ID</h3>
          <form @submit.prevent="handleManualSubmit" class="space-y-4">
            <input
              v-model="nftId"
              type="text"
              placeholder="e.g., NFT-2024-001234"
              class="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="input-nft-id"
            />
            <button
              type="submit"
              class="w-full py-2 bg-red-500 text-white rounded-md font-medium hover-elevate"
              data-testid="button-access-records"
            >
              Access Emergency Records
            </button>
          </form>
        </div>
        
        <button
          @click="manualInput = false; nftId = ''"
          class="w-full py-3 border rounded-md font-medium hover-elevate"
        >
          Back
        </button>
      </div>
      
      <div class="mt-8 p-4 bg-muted rounded-md">
        <h4 class="font-medium text-sm mb-2">For First Responders</h4>
        <p class="text-xs text-muted-foreground">
          This emergency access system allows authorized personnel to view critical patient 
          information during emergencies. All access is logged for security purposes.
        </p>
      </div>
    </main>
  </div>
</template>
