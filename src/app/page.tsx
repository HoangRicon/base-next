'use client'

import React from 'react'
import { ThemeProvider } from '@/contexts/theme-context'
import { ComponentShowcase } from '@/components/demo/component-showcase'
import { Toaster } from '@/components/ui/sonner'

export default function HomePage() {
  return (
    <ThemeProvider defaultTheme={{ mode: 'system', variant: 'default' }}>
      <div className="min-h-screen bg-background text-foreground">
        <ComponentShowcase />
        <Toaster />
      </div>
    </ThemeProvider>
  )
}
