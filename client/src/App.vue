<script setup lang="ts">
import { RouterView } from 'vue-router'
import ThesisDemo from '@/components/ThesisDemo.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <RouterView />
    <ThesisDemo />
  </div>
</template>
