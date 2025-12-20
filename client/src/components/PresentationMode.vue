<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-vue-next'
import SystemArchitectureDiagram from './SystemArchitectureDiagram.vue'
import DataFlowDiagram from './DataFlowDiagram.vue'
import ComparisonDiagram from './ComparisonDiagram.vue'
import BlockchainVisualizer from './BlockchainVisualizer.vue'
import EmergencyScenarioLauncher from './EmergencyScenarioLauncher.vue'

interface Slide {
  id: string
  title: string
  subtitle?: string
  content: string
  demoComponent?: any
  isLiveDemo?: boolean
}

const props = defineProps<{
  isActive?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const currentSlide = ref(0)
const isPresenting = ref(props.isActive || false)

const slides: Slide[] = [
  {
    id: 'problem-statement',
    title: 'The Problem',
    subtitle: 'Healthcare Record Control in the Philippines',
    content: `Current healthcare systems centralize patient data in hospital silos. Patients have limited access and control over their own medical records, making data portability difficult and emergency access slow.`,
    demoComponent: null
  },
  {
    id: 'proposed-solution',
    title: 'Proposed Solution',
    subtitle: 'NFT-Based Patient Data Ownership',
    content: `MediChain-PH leverages blockchain technology and NFTs to give patients complete ownership and control of their medical records. Each patient\'s profile is minted as an NFT, ensuring portability, security, and verifiable access logs.`,
    demoComponent: null
  },
  {
    id: 'system-architecture',
    title: 'System Architecture',
    subtitle: 'Technical Implementation',
    content: `The system consists of: Patient Portal for health data management, Hospital Portal for record requests, Blockchain layer for immutable audit trails, and Emergency Access system for paramedic integration.`,
    demoComponent: SystemArchitectureDiagram
  },
  {
    id: 'data-flow',
    title: 'Data Flow & Integration',
    subtitle: 'How Components Interact',
    content: `Data flows from patients to the blockchain for immutable logging. Hospital requests trigger approval workflows. Emergency access generates time-limited QR codes with automatic expiration and contact notification.`,
    demoComponent: DataFlowDiagram
  },
  {
    id: 'comparison',
    title: 'Traditional EHR vs MediChain-PH',
    subtitle: 'Key Differences',
    content: `Traditional systems use centralized databases with limited patient control. MediChain-PH decentralizes ownership through blockchain, enables verifiable emergency access, and maintains immutable audit trails of all data access.`,
    demoComponent: ComparisonDiagram
  },
  {
    id: 'patient-portal-demo',
    title: 'Patient Portal Demo',
    subtitle: 'Personal Health Management',
    content: `Patients can view their complete medical history, manage emergency contacts, mint records as NFTs, and toggle emergency mode with automatic contact notification. All activities are logged to the blockchain.`,
    demoComponent: BlockchainVisualizer,
    isLiveDemo: true
  },
  {
    id: 'emergency-system',
    title: 'Emergency Access System',
    subtitle: 'Real-Time Paramedic Integration',
    content: `When emergency mode is active, paramedics scan dual QR codes (normal/emergency) to access critical health information. Access is limited to 24 hours, automatically logged, and emergency contacts are notified instantly.`,
    demoComponent: EmergencyScenarioLauncher,
    isLiveDemo: true
  },
  {
    id: 'blockchain-verification',
    title: 'Blockchain Verification',
    subtitle: 'Immutable Audit Trail',
    content: `Every access event is logged to blockchain with timestamp, user identity, and data accessed. The audit trail is cryptographically signed and cannot be modified, providing complete transparency for patient data access.`,
    demoComponent: null
  },
  {
    id: 'benefits-impact',
    title: 'Benefits & Future Impact',
    subtitle: 'Why This Matters for the Philippines',
    content: `MediChain-PH enables: (1) Patient data ownership and control, (2) Faster emergency response with instant QR access, (3) Portable medical records across providers, (4) Transparent access audit trails, (5) Foundation for blockchain healthcare ecosystem in Southeast Asia.`,
    demoComponent: null
  }
]

const slideProgress = computed(() => {
  return {
    current: currentSlide.value + 1,
    total: slides.length,
    percentage: ((currentSlide.value + 1) / slides.length) * 100
  }
})

function nextSlide() {
  if (currentSlide.value < slides.length - 1) {
    currentSlide.value++
  }
}

function prevSlide() {
  if (currentSlide.value > 0) {
    currentSlide.value--
  }
}

function goToSlide(index: number) {
  currentSlide.value = index
}

function close() {
  isPresenting.value = false
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isPresenting" class="fixed inset-0 bg-black z-50 flex flex-col">
      <!-- Close Button -->
      <button
        @click="close"
        class="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        title="Exit presentation"
      >
        <X class="h-6 w-6" />
      </button>

      <!-- Main Slide Area -->
      <div class="flex-1 flex items-center justify-center overflow-hidden">
        <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <!-- Slide Content -->
          <div class="max-w-4xl w-full px-8 py-12 text-white">
            <!-- Slide Counter & Progress -->
            <div class="mb-8">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-semibold text-cyan-400">
                  SLIDE {{ slideProgress.current }} / {{ slideProgress.total }}
                </span>
                <span class="text-sm text-gray-400">{{ slides[currentSlide].id }}</span>
              </div>
              <div class="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  :style="{ width: slideProgress.percentage + '%' }"
                ></div>
              </div>
            </div>

            <!-- Slide Title -->
            <h1 class="text-5xl font-bold mb-2">{{ slides[currentSlide].title }}</h1>
            <p v-if="slides[currentSlide].subtitle" class="text-xl text-cyan-400 mb-8">
              {{ slides[currentSlide].subtitle }}
            </p>

            <!-- Slide Content -->
            <p class="text-lg text-gray-200 mb-8 leading-relaxed">
              {{ slides[currentSlide].content }}
            </p>

            <!-- Demo Component -->
            <div v-if="slides[currentSlide].demoComponent" class="mb-8 p-6 bg-white/5 border border-white/10 rounded-lg">
              <p v-if="slides[currentSlide].isLiveDemo" class="text-xs text-amber-400 mb-4 font-semibold">
                ⚡ LIVE DEMO COMPONENT
              </p>
              <component :is="slides[currentSlide].demoComponent" />
            </div>

            <!-- Presentation Tips -->
            <div class="text-sm text-gray-400 mt-8 p-4 bg-white/5 rounded border border-white/10">
              <p class="font-semibold text-gray-300 mb-2">Presentation Notes:</p>
              <ul class="space-y-1 text-xs">
                <li>• Use arrow keys or buttons to navigate slides</li>
                <li>• Click on slide numbers to jump to any slide</li>
                <li>• Press ESC or click X to exit presentation mode</li>
                <li>• Components are interactive - test features during demo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls Footer -->
      <div class="bg-black/80 border-t border-white/10 px-8 py-6">
        <div class="flex items-center justify-between">
          <!-- Navigation Buttons -->
          <div class="flex items-center gap-4">
            <button
              @click="prevSlide"
              :disabled="currentSlide === 0"
              class="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronLeft class="h-5 w-5" />
            </button>
            <button
              @click="nextSlide"
              :disabled="currentSlide === slides.length - 1"
              class="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors"
            >
              <ChevronRight class="h-5 w-5" />
            </button>
          </div>

          <!-- Slide Thumbnails -->
          <div class="flex gap-2 flex-1 mx-8 overflow-x-auto">
            <button
              v-for="(slide, index) in slides"
              :key="slide.id"
              @click="goToSlide(index)"
              :class="[
                'px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
                index === currentSlide
                  ? 'bg-cyan-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              ]"
            >
              {{ index + 1 }}. {{ slide.title }}
            </button>
          </div>

          <!-- Timer/Exit -->
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-400">
              {{ slideProgress.current }} / {{ slideProgress.total }}
            </span>
            <button
              @click="close"
              class="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium transition-colors"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
::-webkit-scrollbar {
  height: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
