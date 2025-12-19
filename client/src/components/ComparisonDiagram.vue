<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'

interface Comparison {
  feature: string
  traditional: string
  medichain: string
  advantage: boolean
}

const comparisons: Comparison[] = [
  {
    feature: 'Data Ownership',
    traditional: 'Hospital/EHR vendor owns patient data',
    medichain: 'Patient owns data via blockchain NFT',
    advantage: true
  },
  {
    feature: 'Patient Control',
    traditional: 'Implicit access—patients cannot deny hospital access',
    medichain: 'Explicit control—patients approve/reject each request',
    advantage: true
  },
  {
    feature: 'Emergency Access',
    traditional: 'Doctors have always-on access to all records',
    medichain: 'Time-limited (24h) emergency access via QR code',
    advantage: true
  },
  {
    feature: 'Audit Trail',
    traditional: 'Centralized logs—can be modified by administrators',
    medichain: 'Immutable blockchain ledger—no retroactive modification',
    advantage: true
  },
  {
    feature: 'Data Portability',
    traditional: 'Requires authorization and technical exports',
    medichain: 'Patient directly transfers NFT ownership',
    advantage: true
  },
  {
    feature: 'Privacy Model',
    traditional: 'Trust-based—depends on vendor promises',
    medichain: 'Cryptographically verified—transparent by design',
    advantage: true
  },
  {
    feature: 'Scalability',
    traditional: 'Centralized—single point of failure',
    medichain: 'Distributed—operates on public blockchain',
    advantage: true
  },
  {
    feature: 'System Complexity',
    traditional: 'Simpler implementation',
    medichain: 'Requires blockchain integration',
    advantage: false
  }
]
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold">Traditional EHR vs. MediChain-PH Comparison</h3>
    
    <div class="overflow-x-auto">
      <table class="w-full text-sm border-collapse">
        <thead>
          <tr class="bg-muted">
            <th class="border p-3 text-left font-semibold">Feature</th>
            <th class="border p-3 text-left font-semibold">Traditional EHR System</th>
            <th class="border p-3 text-left font-semibold">MediChain-PH (Blockchain-based)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(comp, idx) in comparisons" :key="idx" class="hover:bg-muted/50">
            <td class="border p-3 font-medium">{{ comp.feature }}</td>
            <td class="border p-3">
              <div class="flex items-start gap-2">
                <X class="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{{ comp.traditional }}</span>
              </div>
            </td>
            <td class="border p-3">
              <div class="flex items-start gap-2">
                <Check :class="['h-4 w-4 flex-shrink-0 mt-0.5', comp.advantage ? 'text-green-500' : 'text-amber-500']" />
                <span :class="{ 'font-semibold text-primary': comp.advantage }">{{ comp.medichain }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div class="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
        <h4 class="font-semibold text-green-900 dark:text-green-100 mb-2">MediChain-PH Advantages</h4>
        <ul class="space-y-2 text-sm text-green-800 dark:text-green-200">
          <li class="flex gap-2">
            <Check class="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Patient retains ownership and control</span>
          </li>
          <li class="flex gap-2">
            <Check class="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Immutable audit trail prevents fraud</span>
          </li>
          <li class="flex gap-2">
            <Check class="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Supports emergency access without full history sharing</span>
          </li>
          <li class="flex gap-2">
            <Check class="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Transparent access governance</span>
          </li>
        </ul>
      </div>

      <div class="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
        <h4 class="font-semibold text-amber-900 dark:text-amber-100 mb-2">Traditional EHR Advantages</h4>
        <ul class="space-y-2 text-sm text-amber-800 dark:text-amber-200">
          <li class="flex gap-2">
            <Check class="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Proven infrastructure and deployment</span>
          </li>
          <li class="flex gap-2">
            <Check class="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Simpler implementation and maintenance</span>
          </li>
          <li class="flex gap-2">
            <Check class="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Integrated with existing healthcare workflows</span>
          </li>
          <li class="flex gap-2">
            <Check class="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>Established security standards (HIPAA)</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
      <p class="text-sm text-blue-900 dark:text-blue-100">
        <span class="font-semibold">Key Thesis Point:</span> MediChain-PH demonstrates that blockchain-based patient data ownership 
        is not only feasible but superior for patient autonomy while maintaining emergency access. This thesis uses a practical 
        demonstration to challenge the status quo of centralized healthcare data control.
      </p>
    </div>
  </div>
</template>
