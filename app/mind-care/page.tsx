"use client"

import Navigation from "@/components/navigation"
import MindCareContent from "@/components/pages/mind-care-content"

export default function MindCarePage() {
  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <main className="flex-1 flex flex-col overflow-hidden">
        <MindCareContent />
      </main>
    </div>
  )
}
