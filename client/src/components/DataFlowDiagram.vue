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
      <h3 class="font-semibold">Patient Registration & NFT Minting Data Flow</h3>
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
        <text x="600" y="30" font-size="20" font-weight="bold" text-anchor="middle" fill="#1e293b" class="dark:fill-white">
          NFT Registration & Emergency Access Flow
        </text>

        <!-- Registration Flow -->
        <text x="300" y="70" font-size="14" font-weight="bold" fill="#0c4a6e">Registration Process</text>

        <!-- Step 1: Registration -->
        <rect x="50" y="100" width="150" height="80" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" rx="4" />
        <text x="125" y="135" font-size="12" font-weight="bold" text-anchor="middle" fill="#0c4a6e">1. Patient</text>
        <text x="125" y="160" font-size="11" text-anchor="middle" fill="#0c4a6e">Signs Up</text>

        <!-- Step 2: Wallet Generation -->
        <rect x="250" y="100" width="150" height="80" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="4" />
        <text x="325" y="130" font-size="12" font-weight="bold" text-anchor="middle" fill="#92400e">2. Generate</text>
        <text x="325" y="150" font-size="11" text-anchor="middle" fill="#92400e">Wallet Address</text>
        <text x="325" y="170" font-size="10" text-anchor="middle" fill="#92400e">(0x...)</text>

        <!-- Step 3: NFT Minting -->
        <rect x="450" y="100" width="150" height="80" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="4" />
        <text x="525" y="130" font-size="12" font-weight="bold" text-anchor="middle" fill="#15803d">3. Mint NFT</text>
        <text x="525" y="150" font-size="11" text-anchor="middle" fill="#15803d">Patient Profile</text>
        <text x="525" y="170" font-size="10" text-anchor="middle" fill="#15803d">NFT-XXXXX</text>

        <!-- Step 4: Activity Logged -->
        <rect x="650" y="100" width="150" height="80" fill="#f3e8ff" stroke="#a855f7" stroke-width="2" rx="4" />
        <text x="725" y="130" font-size="12" font-weight="bold" text-anchor="middle" fill="#581c87">4. Log to</text>
        <text x="725" y="150" font-size="11" text-anchor="middle" fill="#581c87">Blockchain</text>
        <text x="725" y="170" font-size="10" text-anchor="middle" fill="#581c87">Activity Feed</text>

        <!-- Step 5: Store -->
        <rect x="850" y="100" width="150" height="80" fill="#fce7f3" stroke="#ec4899" stroke-width="2" rx="4" />
        <text x="925" y="135" font-size="12" font-weight="bold" text-anchor="middle" fill="#831843">5. Store in</text>
        <text x="925" y="160" font-size="11" text-anchor="middle" fill="#831843">Database</text>

        <!-- Flow Arrows -->
        <line x1="200" y1="140" x2="250" y2="140" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />
        <line x1="400" y1="140" x2="450" y2="140" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />
        <line x1="600" y1="140" x2="650" y2="140" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />
        <line x1="800" y1="140" x2="850" y2="140" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />

        <!-- Emergency Access Flow -->
        <text x="300" y="270" font-size="14" font-weight="bold" fill="#0c4a6e">Emergency Access Process</text>

        <!-- Step 1: Patient Enables -->
        <rect x="50" y="300" width="140" height="80" fill="#e0f2fe" stroke="#0284c7" stroke-width="2" rx="4" />
        <text x="120" y="330" font-size="12" font-weight="bold" text-anchor="middle" fill="#0c4a6e">1. Patient</text>
        <text x="120" y="350" font-size="11" text-anchor="middle" fill="#0c4a6e">Enables</text>
        <text x="120" y="370" font-size="11" text-anchor="middle" fill="#0c4a6e">Emergency</text>

        <!-- Step 2: QR Code Gen -->
        <rect x="230" y="300" width="140" height="80" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" rx="4" />
        <text x="300" y="330" font-size="12" font-weight="bold" text-anchor="middle" fill="#92400e">2. Generate</text>
        <text x="300" y="350" font-size="11" text-anchor="middle" fill="#92400e">Emergency QR</text>
        <text x="300" y="370" font-size="11" text-anchor="middle" fill="#92400e">Code (24h)</text>

        <!-- Step 3: Paramedic Scan -->
        <rect x="410" y="300" width="140" height="80" fill="#dcfce7" stroke="#16a34a" stroke-width="2" rx="4" />
        <text x="480" y="330" font-size="12" font-weight="bold" text-anchor="middle" fill="#15803d">3. Paramedic</text>
        <text x="480" y="350" font-size="11" text-anchor="middle" fill="#15803d">Scans QR</text>
        <text x="480" y="370" font-size="11" text-anchor="middle" fill="#15803d">Code</text>

        <!-- Step 4: Grant Access -->
        <rect x="590" y="300" width="140" height="80" fill="#f3e8ff" stroke="#a855f7" stroke-width="2" rx="4" />
        <text x="660" y="330" font-size="12" font-weight="bold" text-anchor="middle" fill="#581c87">4. Grant</text>
        <text x="660" y="350" font-size="11" text-anchor="middle" fill="#581c87">Access for</text>
        <text x="660" y="370" font-size="11" text-anchor="middle" fill="#581c87">24 Hours</text>

        <!-- Step 5: Log & Audit -->
        <rect x="770" y="300" width="140" height="80" fill="#fce7f3" stroke="#ec4899" stroke-width="2" rx="4" />
        <text x="840" y="330" font-size="12" font-weight="bold" text-anchor="middle" fill="#831843">5. Log Access</text>
        <text x="840" y="350" font-size="11" text-anchor="middle" fill="#831843">to Activity</text>
        <text x="840" y="370" font-size="11" text-anchor="middle" fill="#831843">Feed</text>

        <!-- Step 6: Auto-Expire -->
        <rect x="950" y="300" width="140" height="80" fill="#dbeafe" stroke="#0284c7" stroke-width="2" rx="4" />
        <text x="1020" y="330" font-size="12" font-weight="bold" text-anchor="middle" fill="#0c4a6e">6. Access</text>
        <text x="1020" y="350" font-size="11" text-anchor="middle" fill="#0c4a6e">Expires</text>
        <text x="1020" y="370" font-size="11" text-anchor="middle" fill="#0c4a6e">Auto</text>

        <!-- Flow Arrows -->
        <line x1="190" y1="340" x2="230" y2="340" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />
        <line x1="370" y1="340" x2="410" y2="340" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />
        <line x1="550" y1="340" x2="590" y2="340" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />
        <line x1="730" y1="340" x2="770" y2="340" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />
        <line x1="910" y1="340" x2="950" y2="340" stroke="#64748b" stroke-width="2" marker-end="url(#arrowhead)" />

        <!-- Data Elements Box -->
        <rect x="50" y="530" width="1100" height="150" fill="#f0f9ff" stroke="#0284c7" stroke-width="1" rx="4" />
        <text x="60" y="555" font-size="12" font-weight="bold" fill="#0c4a6e">Data Elements & Transformations:</text>
        
        <text x="70" y="580" font-size="11" font-weight="bold" fill="#0c4a6e">Input (Patient Registration):</text>
        <text x="320" y="580" font-size="11" fill="#0c4a6e">Username, Password, Full Name, Blood Type</text>
        
        <text x="70" y="605" font-size="11" font-weight="bold" fill="#0c4a6e">Generated Assets:</text>
        <text x="320" y="605" font-size="11" fill="#0c4a6e">Wallet Address (0x40 hex chars), NFT ID, Token ID, Block Hash</text>
        
        <text x="70" y="630" font-size="11" font-weight="bold" fill="#0c4a6e">Blockchain Events:</text>
        <text x="320" y="630" font-size="11" fill="#0c4a6e">Mint, Emergency Access, Access Expiration (immutable ledger entries)</text>
        
        <text x="70" y="655" font-size="11" font-weight="bold" fill="#0c4a6e">Patient Control:</text>
        <text x="320" y="655" font-size="11" fill="#0c4a6e">Patient owns wallet → Patient approves/rejects hospital requests → Patient grants emergency access</text>

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
