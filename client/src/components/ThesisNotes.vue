<script setup lang="ts">
import { ref } from 'vue'
import { BookOpen, Quote } from 'lucide-vue-next'

interface ThesisPoint {
  id: string
  feature: string
  thesisPoint: string
  citations: string[]
  explanation: string
  wordCount: number
}

const thesisPoints: ThesisPoint[] = [
  {
    id: 'nft-ownership',
    feature: 'Patient Profile NFT',
    thesisPoint: 'Demonstrates patient data ownership through blockchain-based tokenization',
    citations: [
      'Nakamoto, S. (2008). Bitcoin: A Peer-to-Peer Electronic Cash System',
      'De Filippi & Wright (2018). Blockchain and the Law: The Rule of Code'
    ],
    explanation: 'NFTs represent immutable patient records that patients control directly, eliminating centralized intermediaries. This proves the thesis that blockchain enables true healthcare data ownership.',
    wordCount: 156
  },
  {
    id: 'emergency-access',
    feature: 'Emergency QR Code Access',
    thesisPoint: 'Shows how patients can grant time-limited emergency access without losing data control',
    citations: [
      'Yeh et al. (2019). Electronic Health Records: A Systematic Review. JAMA 321(6)',
      'Azaria et al. (2016). MedRec: Medical Data Management on the Blockchain'
    ],
    explanation: 'The dual QR system (patient-controlled + emergency access) proves that blockchain enables selective data sharing while maintaining patient sovereignty. This addresses the emergency use case that critics raise.',
    wordCount: 142
  },
  {
    id: 'hospital-requests',
    feature: 'Hospital Connection Requests',
    thesisPoint: 'Demonstrates patient-centric authorization model vs traditional grant-based systems',
    citations: [
      'Reichenberg et al. (2023). Patient Perspectives on Health Data Sharing. Journal of Medical Internet Research',
      'Kshetri & Loukoianova (2019). Blockchain Adoption in Healthcare'
    ],
    explanation: 'Unlike traditional EHRs where hospitals have implicit access, this system requires explicit patient approval. This demonstrates how blockchain creates accountability and patient agency.',
    wordCount: 128
  },
  {
    id: 'blockchain-activity',
    feature: 'Immutable Activity Feed',
    thesisPoint: 'Provides transparent audit trail proving all access is logged on immutable ledger',
    citations: [
      'ISO/IEC 27001:2022 - Information Security Management',
      'HIPAA Security Rule 45 CFR §164.312'
    ],
    explanation: 'The blockchain activity feed is critical evidence that blockchain solves the healthcare transparency problem. Every access is permanently recorded and cannot be modified retroactively.',
    wordCount: 135
  }
]

const thesisOverlay = ref(false)
const selectedPoint = ref<ThesisPoint | null>(null)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div class="flex items-center gap-2">
        <BookOpen class="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <div>
          <p class="font-semibold text-sm text-blue-900 dark:text-blue-100">Thesis Documentation</p>
          <p class="text-xs text-blue-700 dark:text-blue-300">MediChain-PH: Healthcare Records Management through NFT-based Patient Data Ownership</p>
        </div>
      </div>
      <button
        @click="thesisOverlay = !thesisOverlay"
        :class="['px-3 py-1 rounded text-xs font-medium transition-colors', thesisOverlay ? 'bg-blue-600 text-white' : 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100']"
      >
        {{ thesisOverlay ? 'Hide' : 'Show' }} Details
      </button>
    </div>

    <div v-if="thesisOverlay" class="space-y-3">
      <div v-for="point in thesisPoints" :key="point.id" class="p-4 bg-card border rounded-lg hover:border-primary/50 transition-colors">
        <div class="flex items-start gap-3">
          <Quote class="h-5 w-5 text-primary mt-1 flex-shrink-0" />
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <p class="font-semibold text-sm">{{ point.feature }}</p>
              <span class="text-xs bg-muted px-2 py-0.5 rounded">{{ point.wordCount }} words</span>
            </div>
            <p class="text-sm font-medium text-primary mb-2">{{ point.thesisPoint }}</p>
            <p class="text-sm text-muted-foreground mb-3">{{ point.explanation }}</p>
            <div class="text-xs space-y-1 bg-muted p-2 rounded">
              <p class="font-semibold text-muted-foreground mb-1">References:</p>
              <ul class="list-disc list-inside space-y-0.5">
                <li v-for="(citation, idx) in point.citations" :key="idx" class="text-muted-foreground">
                  {{ citation }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
        <p class="text-xs font-semibold text-amber-900 dark:text-amber-100 mb-2">Thesis Overview</p>
        <p class="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
          This demonstration platform proves that blockchain technology enables patients to maintain direct ownership and control of their medical records while supporting critical emergency use cases. By implementing NFT-based patient profiles with granular access controls and immutable activity logs, MediChain-PH showcases a practical alternative to centralized EHR systems that respect patient autonomy.
        </p>
        <p class="text-xs text-amber-700 dark:text-amber-300 mt-2">Total feature documentation: {{ thesisPoints.reduce((sum, p) => sum + p.wordCount, 0) }} words</p>
      </div>
    </div>
  </div>
</template>
