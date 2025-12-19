<script setup lang="ts">
import { ref } from 'vue'
import { ZoomIn, ZoomOut } from 'lucide-vue-next'

const scale = ref(1)

const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.2, 2)
}

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.2, 0.6)
}

const resetZoom = () => {
  scale.value = 1
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="font-semibold">System Architecture</h3>
      <div class="flex gap-2">
        <button @click="zoomOut" class="p-2 hover:bg-muted rounded transition-colors">
          <ZoomOut class="h-4 w-4" />
        </button>
        <button @click="resetZoom" class="px-2 py-1 text-xs hover:bg-muted rounded transition-colors">
          {{ Math.round(scale * 100) }}%
        </button>
        <button @click="zoomIn" class="p-2 hover:bg-muted rounded transition-colors">
          <ZoomIn class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-950 border rounded-lg overflow-auto" style="height: 500px">
      <svg
        viewBox="0 0 1200 700"
        :style="{ transform: `scale(${scale})`, transformOrigin: 'top left', width: `${100 / scale}%`, height: `${700 / scale}px` }"
        class="w-full"
      >
        <!-- Title -->
        <text x="600" y="30" font-size="24" font-weight="bold" text-anchor="middle" fill="#1e293b" class="dark:fill-white">
          MediChain-PH System Architecture
        </text>

        <!-- Patient Layer -->
        <rect x="50" y="100" width="200" height="100" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" rx="8" />
        <text x="150" y="135" font-size="14" font-weight="bold" text-anchor="middle" fill="#0c4a6e">Patient Portal</text>
        <text x="150" y="160" font-size="12" text-anchor="middle" fill="#0c4a6e">Vue.js Frontend</text>
        <text x="150" y="180" font-size="12" text-anchor="middle" fill="#0c4a6e">QR Code Access</text>

        <!-- Blockchain Layer -->
        <rect x="350" y="100" width="200" height="100" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="8" />
        <text x="450" y="135" font-size="14" font-weight="bold" text-anchor="middle" fill="#92400e">Mock Blockchain</text>
        <text x="450" y="160" font-size="12" text-anchor="middle" fill="#92400e">NFT Minting</text>
        <text x="450" y="180" font-size="12" text-anchor="middle" fill="#92400e">Activity Ledger</text>

        <!-- Hospital Layer -->
        <rect x="650" y="100" width="200" height="100" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="8" />
        <text x="750" y="135" font-size="14" font-weight="bold" text-anchor="middle" fill="#15803d">Hospital Portal</text>
        <text x="750" y="160" font-size="12" text-anchor="middle" fill="#15803d">Connection Requests</text>
        <text x="750" y="180" font-size="12" text-anchor="middle" fill="#15803d">Record Access</text>

        <!-- API Layer -->
        <rect x="950" y="100" width="200" height="100" fill="#f3e8ff" stroke="#a855f7" stroke-width="2" rx="8" />
        <text x="1050" y="135" font-size="14" font-weight="bold" text-anchor="middle" fill="#581c87">API Gateway</text>
        <text x="1050" y="160" font-size="12" text-anchor="middle" fill="#581c87">Express.js</text>
        <text x="1050" y="180" font-size="12" text-anchor="middle" fill="#581c87">Authentication</text>

        <!-- Database Layer -->
        <rect x="350" y="350" width="500" height="120" fill="#fce7f3" stroke="#ec4899" stroke-width="2" rx="8" />
        <text x="600" y="375" font-size="14" font-weight="bold" text-anchor="middle" fill="#831843">Storage Layer (In-Memory)</text>
        <text x="480" y="410" font-size="12" text-anchor="middle" fill="#831843">Users</text>
        <text x="600" y="410" font-size="12" text-anchor="middle" fill="#831843">Patient Records</text>
        <text x="750" y="410" font-size="12" text-anchor="middle" fill="#831843">Access Logs</text>
        <text x="600" y="435" font-size="12" text-anchor="middle" fill="#831843">Blockchain Activity | Hospital Requests</text>

        <!-- Arrows -->
        <!-- Patient to API -->
        <line x1="250" y1="150" x2="950" y2="150" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />
        <text x="600" y="140" font-size="11" text-anchor="middle" fill="#475569">HTTP REST API</text>

        <!-- Blockchain to API -->
        <line x1="450" y1="200" x2="600" y2="300" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />
        <text x="450" y="260" font-size="11" text-anchor="middle" fill="#475569">Mock NFT</text>
        <text x="450" y="275" font-size="11" text-anchor="middle" fill="#475569">Operations</text>

        <!-- Hospital to API -->
        <line x1="750" y1="200" x2="750" y2="300" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />
        <text x="790" y="260" font-size="11" text-anchor="middle" fill="#475569">Hospital</text>
        <text x="790" y="275" font-size="11" text-anchor="middle" fill="#475569">Access Control</text>

        <!-- API to Storage -->
        <line x1="1050" y1="200" x2="750" y2="350" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />

        <!-- Key Features Box -->
        <rect x="50" y="530" width="1100" height="150" fill="#f0f9ff" stroke="#0284c7" stroke-width="1" rx="4" />
        <text x="60" y="555" font-size="12" font-weight="bold" fill="#0c4a6e">Key Components:</text>
        
        <text x="70" y="580" font-size="11" font-weight="bold" fill="#0c4a6e">• Patient Ownership:</text>
        <text x="280" y="580" font-size="11" fill="#0c4a6e">Patients control their NFT records via blockchain wallet addresses</text>
        
        <text x="70" y="605" font-size="11" font-weight="bold" fill="#0c4a6e">• Emergency Access:</text>
        <text x="280" y="605" font-size="11" fill="#0c4a6e">Time-limited QR code access with automatic expiration and audit logging</text>
        
        <text x="70" y="630" font-size="11" font-weight="bold" fill="#0c4a6e">• Hospital Integration:</text>
        <text x="280" y="630" font-size="11" fill="#0c4a6e">Permission-based model where hospitals request access patients approve/reject</text>
        
        <text x="70" y="655" font-size="11" font-weight="bold" fill="#0c4a6e">• Immutable Audit Trail:</text>
        <text x="280" y="655" font-size="11" fill="#0c4a6e">All access events logged to blockchain activity feed for transparency</text>

        <!-- Arrow Marker Definition -->
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
          </marker>
        </defs>
      </svg>
    </div>
  </div>
</template>
