import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface HospitalProfile {
  id: string
  username: string
  hospitalName: string
  address: string
  contactNumber: string
}

export const useHospitalStore = defineStore('hospital', () => {
  const currentHospital = ref<HospitalProfile | null>(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => {
    return currentHospital.value !== null
  })

  function setHospital(hospital: HospitalProfile) {
    currentHospital.value = hospital
    localStorage.setItem('hospital', JSON.stringify(hospital))
  }

  function clearHospital() {
    currentHospital.value = null
    localStorage.removeItem('hospital')
  }

  function restoreHospitalSession() {
    const stored = localStorage.getItem('hospital')
    if (stored) {
      try {
        currentHospital.value = JSON.parse(stored)
      } catch {
        localStorage.removeItem('hospital')
      }
    }
  }

  return {
    currentHospital,
    isLoading,
    isAuthenticated,
    setHospital,
    clearHospital,
    restoreHospitalSession,
  }
})
