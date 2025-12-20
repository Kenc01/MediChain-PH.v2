<script setup lang="ts">
import { ref, computed } from 'vue'
import { Database, Lock, Zap, CheckCircle } from 'lucide-vue-next'
import { blockchain } from '@/utils/blockchainMock'

const props = defineProps<{
  userId?: string
}>()

const stats = computed(() => {
  const activities = props.userId ? blockchain.getEmergencyAccessLog(props.userId || '') : []
  return {
    totalNFTs: 1,
    totalTransactions: activities.length + 2,
    blockHeight: 10000 + Math.floor(Math.random() * 1000),
    gasAverage: '0.0034 ETH'
  }
})
</script>

<template>
  <div class="space-y-4">
    <h3 class="font-semibold text-lg flex items-center gap-2">
      <Database class="h-5 w-5" />
      Blockchain Status
    </h3>
    
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <Zap class="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <p class="text-xs text-muted-foreground">Total NFTs</p>
        </div>
        <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">{{ stats.totalNFTs }}</p>
      </div>

      <div class="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <CheckCircle class="h-4 w-4 text-purple-600 dark:text-purple-400" />
          <p class="text-xs text-muted-foreground">Transactions</p>
        </div>
        <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">{{ stats.totalTransactions }}</p>
      </div>

      <div class="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <Lock class="h-4 w-4 text-green-600 dark:text-green-400" />
          <p class="text-xs text-muted-foreground">Block Height</p>
        </div>
        <p class="text-2xl font-bold text-green-600 dark:text-green-400">{{ stats.blockHeight }}</p>
      </div>

      <div class="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <Zap class="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <p class="text-xs text-muted-foreground">Avg Gas</p>
        </div>
        <p class="text-sm font-bold text-amber-600 dark:text-amber-400">{{ stats.gasAverage }}</p>
      </div>
    </div>
  </div>
</template>
