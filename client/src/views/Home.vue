<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Shield, Heart, QrCode, ArrowRight } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen">
    <header class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div class="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <Heart class="h-6 w-6 text-primary" />
          <span class="font-bold text-lg">MediChain-PH</span>
        </div>
        <nav class="flex items-center gap-2">
          <RouterLink 
            to="/login" 
            class="px-4 py-2 text-sm font-medium hover-elevate rounded-md"
            data-testid="link-login"
          >
            Login
          </RouterLink>
          <RouterLink 
            to="/register" 
            class="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover-elevate"
            data-testid="link-register"
          >
            Sign Up
          </RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <section class="py-20 md:py-32">
        <div class="container mx-auto px-4 text-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-6">
            <span class="w-2 h-2 rounded-full bg-green-500"></span>
            Thesis Demo Version
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Own Your <span class="text-primary">Health Data</span>
          </h1>
          
          <p class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Secure medical records for Filipinos. Portable, private, and always under your control.
          </p>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <RouterLink 
              to="/register" 
              class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover-elevate"
              data-testid="button-get-started"
            >
              Get Started
              <ArrowRight class="h-4 w-4" />
            </RouterLink>
            <RouterLink 
              to="/emergency" 
              class="inline-flex items-center justify-center gap-2 px-6 py-3 border border-input bg-background rounded-md font-medium hover-elevate"
              data-testid="button-emergency-access"
            >
              <QrCode class="h-4 w-4" />
              Emergency Access
            </RouterLink>
          </div>
        </div>
      </section>

      <section class="py-16 bg-muted/50">
        <div class="container mx-auto px-4">
          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center p-6">
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield class="h-6 w-6 text-primary" />
              </div>
              <h3 class="font-semibold text-lg mb-2">Secure Storage</h3>
              <p class="text-muted-foreground text-sm">Your medical records are encrypted and stored securely.</p>
            </div>
            <div class="text-center p-6">
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart class="h-6 w-6 text-primary" />
              </div>
              <h3 class="font-semibold text-lg mb-2">Patient Control</h3>
              <p class="text-muted-foreground text-sm">You decide who can access your health information.</p>
            </div>
            <div class="text-center p-6">
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <QrCode class="h-6 w-6 text-primary" />
              </div>
              <h3 class="font-semibold text-lg mb-2">Emergency Access</h3>
              <p class="text-muted-foreground text-sm">First responders can access critical info via QR code.</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="border-t py-8">
      <div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>MediChain-PH - Thesis Project Demo</p>
      </div>
    </footer>
  </div>
</template>
