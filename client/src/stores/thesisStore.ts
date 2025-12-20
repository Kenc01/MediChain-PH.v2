import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ThesisScenario {
  id: string
  name: string
  description: string
}

export const useThesisStore = defineStore('thesis', () => {
  const isThesisMode = ref(false)
  const showExplanations = ref(true)
  const currentScenario = ref<ThesisScenario | null>(null)

  const scenarios: ThesisScenario[] = [
    {
      id: 'patient-ownership',
      name: 'Patient Data Ownership',
      description: 'Shows how patients control their NFT-based medical records'
    },
    {
      id: 'emergency-access',
      name: 'Emergency Access Control',
      description: 'Demonstrates time-limited emergency QR code access'
    },
    {
      id: 'hospital-authorization',
      name: 'Hospital Authorization',
      description: 'Patient-centric approval model for hospital access'
    },
    {
      id: 'blockchain-audit',
      name: 'Immutable Audit Trail',
      description: 'Shows transparent blockchain activity logging'
    }
  ]

  const thesisMode = computed(() => isThesisMode.value)

  function toggleThesisMode() {
    isThesisMode.value = !isThesisMode.value
  }

  function setScenario(scenario: ThesisScenario | null) {
    currentScenario.value = scenario
  }

  function toggleExplanations() {
    showExplanations.value = !showExplanations.value
  }

  return {
    isThesisMode,
    thesisMode,
    showExplanations,
    currentScenario,
    scenarios,
    toggleThesisMode,
    setScenario,
    toggleExplanations,
  }
})
