<script setup lang="ts">
import { computed } from 'vue'
import { BookOpen, Lightbulb, Info } from 'lucide-vue-next'
import { useThesisStore } from '../stores/thesisStore'

interface Props {
  componentName: string
  thesisPoints?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  thesisPoints: () => []
})

const thesisStore = useThesisStore()

const explanationMap: Record<string, string> = {
  'PatientProfile': 'This component displays the patient\'s core identity tied to their blockchain wallet. The wallet address proves direct ownership of medical records through NFT-based tokens.',
  'EmergencyToggle': 'Patient controls emergency access through this toggle. When enabled, it generates time-limited QR codes that paramedics can scan, proving selective data sharing while maintaining sovereignty.',
  'MedicalRecordsList': 'Each medical record can be minted as an NFT here. This demonstrates how patients transform health data into immutable blockchain assets they fully control.',
  'BlockchainActivityFeed': 'Shows immutable transaction history on the blockchain. Every access and modification is permanently recorded, providing transparent audit trails that traditional EHRs cannot offer.',
  'HospitalRequestsList': 'Demonstrates the patient-centric authorization model. Unlike traditional systems with implicit access, hospitals must request permission and patients explicitly approve or deny.',
  'EmergencyScenario': 'Simulates a real emergency to show how the system prioritizes life-saving care while maintaining privacy. The 24-hour limited access proves both functionality and security.',
  'SystemArchitectureDiagram': 'Shows how blockchain integrates with traditional medical systems. Patient wallets, NFT minting, and immutable logs form the core of decentralized medical data ownership.',
  'DataFlowDiagram': 'Traces how patient data flows through the system from registration to emergency access. Each step is cryptographically verified, eliminating single points of failure.',
  'ComparisonDiagram': 'Directly contrasts traditional centralized EHRs with blockchain-based systems. MediChain-PH addresses all major criticisms: ownership, control, auditability, and portability.'
}

const currentExplanation = computed(() => {
  return explanationMap[props.componentName] || `This component supports the thesis by demonstrating blockchain-based healthcare data management.`
})
</script>

<template>
  <div v-if="thesisStore.isThesisMode && thesisStore.showExplanations" class="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
    <div class="flex items-start gap-3">
      <Lightbulb class="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
      <div>
        <h4 class="font-semibold text-sm text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-1">
          <BookOpen class="h-4 w-4" />
          Thesis Explanation: {{ componentName }}
        </h4>
        <p class="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
          {{ currentExplanation }}
        </p>
        <div v-if="thesisPoints.length > 0" class="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
          <p class="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Key Points:</p>
          <ul class="text-xs text-blue-700 dark:text-blue-300 list-disc list-inside space-y-0.5">
            <li v-for="point in thesisPoints" :key="point">{{ point }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
