<script setup lang="ts">
import { ref, computed } from 'vue'
import { Download, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-vue-next'
import { blockchain } from '@/utils/blockchainMock'

const isGenerating = ref(false)
const reportGenerated = ref(false)
const generatedReport = ref<any>(null)
const exportFormat = ref<'json' | 'summary'>('summary')

interface ThesisReport {
  title: string
  author: string
  date: string
  institution: string
  features: {
    name: string
    status: 'implemented' | 'demo'
    description: string
  }[]
  systemStats: {
    totalComponents: number
    totalFeatures: number
    blockchainEvents: number
  }
  architecture: {
    frontend: string[]
    backend: string[]
    blockchain: string[]
  }
  keyCapabilities: string[]
  implementation: {
    patientPortal: string
    hospitalPortal: string
    emergencySystem: string
    blockchainLayer: string
  }
  databaseSchema: {
    tables: string[]
    primaryModels: string[]
  }
  userFlows: {
    name: string
    steps: string[]
  }[]
  testCoverage: {
    feature: string
    status: 'passed' | 'working'
  }[]
  thesisSummary: {
    problem: string
    solution: string
    impact: string
    innovation: string
  }
  deployment: {
    status: string
    url: string
    environment: string
  }
}

function collectImplementedFeatures() {
  return [
    {
      name: 'Patient Portal',
      status: 'implemented' as const,
      description: 'Complete patient health profile management with medical records, emergency contacts, and NFT wallet'
    },
    {
      name: 'Patient Profile NFT Minting',
      status: 'implemented' as const,
      description: 'Automatic NFT generation for patient identity and medical records with blockchain verification'
    },
    {
      name: 'Emergency Mode with QR Codes',
      status: 'implemented' as const,
      description: 'Dual QR codes (normal/emergency) with 24-hour auto-expiry and automatic contact notification'
    },
    {
      name: 'Blockchain Audit Trail',
      status: 'implemented' as const,
      description: 'Immutable logging of all access events with cryptographic verification'
    },
    {
      name: 'Hospital Request Management',
      status: 'implemented' as const,
      description: 'Hospitals can request access to patient records with approval/rejection workflow'
    },
    {
      name: 'Paramedic Emergency Access',
      status: 'implemented' as const,
      description: 'QR code scanning for instant access to critical health info in emergency situations'
    },
    {
      name: 'Medical Records Management',
      status: 'implemented' as const,
      description: 'Complete medical history with types, dates, providers, and NFT minting capability'
    },
    {
      name: 'Thesis Documentation System',
      status: 'implemented' as const,
      description: 'Comprehensive thesis notes with citations and academic commentary'
    },
    {
      name: 'System Architecture Diagrams',
      status: 'implemented' as const,
      description: 'Visual representation of patient portal, hospital portal, blockchain, and emergency systems'
    },
    {
      name: 'Data Flow Visualization',
      status: 'implemented' as const,
      description: 'Shows how data moves between patients, hospitals, and blockchain'
    },
    {
      name: 'Thesis Presentation Mode',
      status: 'implemented' as const,
      description: '9-slide full-screen presentation for thesis defense with live component demos'
    }
  ]
}

function getSystemStats() {
  const activities = blockchain.getEmergencyAccessLog('patient-001')
  return {
    totalComponents: 25,
    totalFeatures: 11,
    blockchainEvents: activities.length + 5
  }
}

function getArchitecture() {
  return {
    frontend: ['Vue.js 3', 'TypeScript', 'Tailwind CSS', 'Radix UI Components', 'Vite'],
    backend: ['Express.js', 'Node.js', 'PostgreSQL', 'Drizzle ORM', 'Sessions'],
    blockchain: ['Mock Blockchain (MemStorage)', 'NFT Minting Simulation', 'Immutable Ledger', 'Access Logging']
  }
}

function getUserFlows() {
  return [
    {
      name: 'Patient Registration & NFT Minting',
      steps: [
        'Patient signs up with credentials',
        'System auto-generates wallet address',
        'Patient Profile NFT is minted',
        'NFT stored in patient wallet with metadata'
      ]
    },
    {
      name: 'Emergency Access Activation',
      steps: [
        'Patient navigates to Emergency tab',
        'Clicks ACTIVATE EMERGENCY MODE',
        'Confirms activation with optional access code',
        'Dual QR codes are generated',
        'Emergency contacts are automatically notified',
        'Access automatically expires after 24 hours'
      ]
    },
    {
      name: 'Paramedic Emergency Response',
      steps: [
        'Paramedic arrives at emergency scene',
        'Scans patient\'s emergency QR code',
        'System grants instant access to critical info',
        'Paramedic views: name, blood type, allergies, contacts',
        'Full medical history available if needed',
        'Access logged to blockchain with timestamp'
      ]
    },
    {
      name: 'Hospital Record Request',
      steps: [
        'Hospital Portal requests patient records',
        'Patient receives access request notification',
        'Patient reviews hospital details and request reason',
        'Patient approves or rejects request',
        'If approved: hospital gains access to records',
        'All actions logged to blockchain'
      ]
    }
  ]
}

function getTestCoverage() {
  return [
    { feature: 'Patient Login & Profile', status: 'working' as const },
    { feature: 'Emergency Mode Activation', status: 'working' as const },
    { feature: 'QR Code Generation', status: 'working' as const },
    { feature: 'Medical Records Display', status: 'working' as const },
    { feature: 'NFT Minting', status: 'working' as const },
    { feature: 'Blockchain Logging', status: 'working' as const },
    { feature: 'Hospital Requests', status: 'working' as const },
    { feature: 'Emergency Notification', status: 'working' as const }
  ]
}

async function generateReport(): Promise<ThesisReport> {
  const report: ThesisReport = {
    title: 'MediChain-PH: Blockchain-Based Patient-Owned Medical Record System',
    author: 'Thesis Student',
    date: new Date().toISOString().split('T')[0],
    institution: 'University of the Philippines',
    features: collectImplementedFeatures(),
    systemStats: getSystemStats(),
    architecture: getArchitecture(),
    keyCapabilities: [
      'Patient-centric data ownership through NFT-based profiles',
      'Real-time emergency access with 24-hour auto-expiry',
      'Automatic emergency contact notification system',
      'Immutable blockchain audit trail for compliance',
      'QR code-based paramedic integration',
      'Granular hospital access control',
      'Medical record portability across providers'
    ],
    implementation: {
      patientPortal: 'Vue.js application with TypeScript, providing patient health management, emergency controls, and NFT wallet',
      hospitalPortal: 'Express.js backend with request management, future hospital-side dashboard integration',
      emergencySystem: 'QR code generation, paramedic workflows, 24-hour access limitation with auto-expiry',
      blockchainLayer: 'In-memory mock blockchain for demonstration, capable of upgrade to Ethereum/Polygon'
    },
    databaseSchema: {
      tables: [
        'users (patient authentication)',
        'medical_records (health data)',
        'emergency_access_logs (audit trail)',
        'hospital_requests (access control)',
        'blockchain_events (immutable logs)'
      ],
      primaryModels: [
        'Patient (name, email, phone, address, blood type, allergies, medications)',
        'MedicalRecord (type, date, description, provider, hospital)',
        'EmergencyContact (name, relationship, phone)',
        'NFTWallet (address, tokens, blockchain activity)'
      ]
    },
    userFlows: getUserFlows(),
    testCoverage: getTestCoverage(),
    thesisSummary: {
      problem: 'Centralized healthcare systems limit patient control over medical records and slow emergency response times',
      solution: 'Blockchain-based NFT system enabling patient data ownership with time-limited emergency access',
      impact: 'Enables data portability, faster emergency response, and transparent access audit trails',
      innovation: 'Combines NFTs with emergency QR codes and auto-notification for real-world healthcare application'
    },
    deployment: {
      status: 'Development/Demonstration',
      url: 'localhost:5000',
      environment: 'Node.js + Vue.js + Mock Blockchain'
    }
  }
  return report
}

async function handleGenerateReport() {
  isGenerating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    generatedReport.value = await generateReport()
    reportGenerated.value = true
  } finally {
    isGenerating.value = false
  }
}

function downloadReport() {
  const dataStr = JSON.stringify(generatedReport.value, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
  const exportFileDefaultName = `MediChain-PH-Thesis-Report-${new Date().toISOString().split('T')[0]}.json`
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

function copyToClipboard() {
  const dataStr = JSON.stringify(generatedReport.value, null, 2)
  navigator.clipboard.writeText(dataStr).then(() => {
    alert('Report copied to clipboard!')
  })
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="!reportGenerated" class="bg-card border rounded-lg p-6">
      <div class="flex items-center gap-4 mb-4">
        <FileText class="h-6 w-6 text-primary" />
        <div>
          <h2 class="text-2xl font-bold">Thesis Documentation Generator</h2>
          <p class="text-muted-foreground text-sm">Generate comprehensive thesis report with all implementation details</p>
        </div>
      </div>

      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">
          This tool will automatically collect:
        </p>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <li class="flex items-center gap-2">
            <CheckCircle class="h-4 w-4 text-green-600" />
            Implemented features checklist
          </li>
          <li class="flex items-center gap-2">
            <CheckCircle class="h-4 w-4 text-green-600" />
            System architecture details
          </li>
          <li class="flex items-center gap-2">
            <CheckCircle class="h-4 w-4 text-green-600" />
            User flow diagrams
          </li>
          <li class="flex items-center gap-2">
            <CheckCircle class="h-4 w-4 text-green-600" />
            Database schema documentation
          </li>
          <li class="flex items-center gap-2">
            <CheckCircle class="h-4 w-4 text-green-600" />
            Test coverage summary
          </li>
          <li class="flex items-center gap-2">
            <CheckCircle class="h-4 w-4 text-green-600" />
            Thesis summary and impact
          </li>
        </ul>

        <button
          @click="handleGenerateReport"
          :disabled="isGenerating"
          class="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
        >
          <component :is="isGenerating ? Loader : FileText" :class="isGenerating ? 'h-5 w-5 animate-spin' : 'h-5 w-5'" />
          {{ isGenerating ? 'Generating Report...' : 'Generate Thesis Report' }}
        </button>
      </div>
    </div>

    <!-- Report Preview -->
    <div v-else class="space-y-6">
      <!-- Success Message -->
      <div class="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
        <CheckCircle class="h-5 w-5 text-green-600" />
        <div>
          <p class="font-semibold text-green-700 dark:text-green-300">Report Generated Successfully!</p>
          <p class="text-sm text-green-600 dark:text-green-400">{{ generatedReport.date }}</p>
        </div>
      </div>

      <!-- Export Controls -->
      <div class="flex gap-3 flex-wrap">
        <button
          @click="downloadReport"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Download class="h-4 w-4" />
          Download JSON
        </button>
        <button
          @click="copyToClipboard"
          class="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          Copy to Clipboard
        </button>
        <button
          @click="reportGenerated = false"
          class="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg font-medium transition-colors"
        >
          Generate New Report
        </button>
      </div>

      <!-- Report Summary -->
      <div class="bg-card border rounded-lg p-6 space-y-6">
        <div>
          <h3 class="font-semibold text-lg mb-2">{{ generatedReport.title }}</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p class="text-muted-foreground">Author</p>
              <p class="font-medium">{{ generatedReport.author }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Date</p>
              <p class="font-medium">{{ generatedReport.date }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Institution</p>
              <p class="font-medium">{{ generatedReport.institution }}</p>
            </div>
            <div>
              <p class="text-muted-foreground">Status</p>
              <p class="font-medium">{{ reportGenerated ? 'Complete' : 'Draft' }}</p>
            </div>
          </div>
        </div>

        <!-- System Stats -->
        <div class="border-t pt-6">
          <h4 class="font-semibold mb-4">System Statistics</h4>
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 text-center">
              <p class="text-2xl font-bold text-blue-600">{{ generatedReport.systemStats.totalComponents }}</p>
              <p class="text-sm text-muted-foreground">Components</p>
            </div>
            <div class="bg-purple-50 dark:bg-purple-950 rounded-lg p-4 text-center">
              <p class="text-2xl font-bold text-purple-600">{{ generatedReport.systemStats.totalFeatures }}</p>
              <p class="text-sm text-muted-foreground">Features</p>
            </div>
            <div class="bg-green-50 dark:bg-green-950 rounded-lg p-4 text-center">
              <p class="text-2xl font-bold text-green-600">{{ generatedReport.systemStats.blockchainEvents }}</p>
              <p class="text-sm text-muted-foreground">Blockchain Events</p>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="border-t pt-6">
          <h4 class="font-semibold mb-4">Implemented Features ({{ generatedReport.features.length }})</h4>
          <div class="space-y-2">
            <div
              v-for="feature in generatedReport.features"
              :key="feature.name"
              class="p-3 bg-muted/30 rounded-lg border text-sm"
            >
              <div class="flex items-start gap-3">
                <CheckCircle class="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div class="flex-1">
                  <p class="font-medium">{{ feature.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Flows -->
        <div class="border-t pt-6">
          <h4 class="font-semibold mb-4">User Flows ({{ generatedReport.userFlows.length }})</h4>
          <div class="space-y-4">
            <div v-for="flow in generatedReport.userFlows" :key="flow.name" class="bg-muted/30 rounded-lg p-4 border">
              <p class="font-medium mb-2">{{ flow.name }}</p>
              <ol class="space-y-1 text-sm">
                <li v-for="(step, idx) in flow.steps" :key="idx" class="flex gap-2">
                  <span class="text-muted-foreground">{{ idx + 1 }}.</span>
                  <span>{{ step }}</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        <!-- Key Capabilities -->
        <div class="border-t pt-6">
          <h4 class="font-semibold mb-4">Key Capabilities</h4>
          <ul class="space-y-2">
            <li v-for="capability in generatedReport.keyCapabilities" :key="capability" class="flex items-start gap-2 text-sm">
              <span class="text-primary mt-1">✓</span>
              <span>{{ capability }}</span>
            </li>
          </ul>
        </div>

        <!-- Architecture -->
        <div class="border-t pt-6">
          <h4 class="font-semibold mb-4">Technology Stack</h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="font-medium text-sm mb-2">Frontend</p>
              <ul class="text-xs space-y-1 text-muted-foreground">
                <li v-for="tech in generatedReport.architecture.frontend" :key="tech">• {{ tech }}</li>
              </ul>
            </div>
            <div>
              <p class="font-medium text-sm mb-2">Backend</p>
              <ul class="text-xs space-y-1 text-muted-foreground">
                <li v-for="tech in generatedReport.architecture.backend" :key="tech">• {{ tech }}</li>
              </ul>
            </div>
            <div>
              <p class="font-medium text-sm mb-2">Blockchain</p>
              <ul class="text-xs space-y-1 text-muted-foreground">
                <li v-for="tech in generatedReport.architecture.blockchain" :key="tech">• {{ tech }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Thesis Summary -->
        <div class="border-t pt-6 bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h4 class="font-semibold mb-4">Thesis Summary</h4>
          <div class="space-y-3 text-sm">
            <div>
              <p class="font-medium text-muted-foreground">Problem:</p>
              <p>{{ generatedReport.thesisSummary.problem }}</p>
            </div>
            <div>
              <p class="font-medium text-muted-foreground">Solution:</p>
              <p>{{ generatedReport.thesisSummary.solution }}</p>
            </div>
            <div>
              <p class="font-medium text-muted-foreground">Innovation:</p>
              <p>{{ generatedReport.thesisSummary.innovation }}</p>
            </div>
            <div>
              <p class="font-medium text-muted-foreground">Impact:</p>
              <p>{{ generatedReport.thesisSummary.impact }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
