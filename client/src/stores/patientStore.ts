import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { EmergencyContact, MedicalRecord, HospitalVisit } from '../../../shared/schema'

export interface PatientProfile {
  id: string
  nftId: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: Date
  address: string
  bloodType: string
  allergies: string[]
  currentMedications: string[]
  emergencyContacts: EmergencyContact[]
  recentRecords: MedicalRecord[]
  hospitalHistory: HospitalVisit[]
}

export const usePatientStore = defineStore('patient', () => {
  const currentPatient = ref<PatientProfile | null>(null)
  const isEmergencyMode = ref(false)
  const emergencyModeExpiry = ref<Date | null>(null)
  const emergencyCode = ref<string>('')
  const isLoading = ref(false)

  const criticalInfo = computed(() => {
    if (!currentPatient.value) return null
    return {
      bloodType: currentPatient.value.bloodType,
      allergies: currentPatient.value.allergies,
      medications: currentPatient.value.currentMedications,
      emergencyContacts: currentPatient.value.emergencyContacts,
    }
  })

  const recentRecords = computed(() => {
    if (!currentPatient.value) return []
    return currentPatient.value.recentRecords.slice(0, 5)
  })

  const emergencyTimeRemaining = computed(() => {
    if (!emergencyModeExpiry.value || !isEmergencyMode.value) return null
    const now = new Date()
    const diff = emergencyModeExpiry.value.getTime() - now.getTime()
    if (diff <= 0) return null
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return { hours, minutes, totalMs: diff }
  })

  function toggleEmergency(code?: string) {
    if (isEmergencyMode.value) {
      isEmergencyMode.value = false
      emergencyModeExpiry.value = null
      emergencyCode.value = ''
      localStorage.removeItem('emergencyMode')
    } else {
      isEmergencyMode.value = true
      const expiry = new Date()
      expiry.setHours(expiry.getHours() + 24)
      emergencyModeExpiry.value = expiry
      emergencyCode.value = code || generateEmergencyCode()
      localStorage.setItem('emergencyMode', JSON.stringify({
        active: true,
        expiry: expiry.toISOString(),
        code: emergencyCode.value
      }))
    }
  }

  function generateEmergencyCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  function setPatient(patient: PatientProfile) {
    currentPatient.value = patient
  }

  function clearPatient() {
    currentPatient.value = null
    isEmergencyMode.value = false
    emergencyModeExpiry.value = null
  }

  function addRecord(record: MedicalRecord) {
    if (currentPatient.value) {
      currentPatient.value.recentRecords.unshift(record)
    }
  }

  function restoreEmergencyState() {
    const stored = localStorage.getItem('emergencyMode')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        const expiry = new Date(data.expiry)
        if (expiry > new Date()) {
          isEmergencyMode.value = true
          emergencyModeExpiry.value = expiry
          emergencyCode.value = data.code
        } else {
          localStorage.removeItem('emergencyMode')
        }
      } catch {
        localStorage.removeItem('emergencyMode')
      }
    }
  }

  return {
    currentPatient,
    isEmergencyMode,
    emergencyModeExpiry,
    emergencyCode,
    isLoading,
    criticalInfo,
    recentRecords,
    emergencyTimeRemaining,
    toggleEmergency,
    setPatient,
    clearPatient,
    addRecord,
    restoreEmergencyState,
  }
})
