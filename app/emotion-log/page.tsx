"use client"

import Navigation from "@/components/navigation"
import EmotionCalendar from "@/components/pages/emotion-calendar"

export default function EmotionLogPage() {
  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <main className="flex-1 flex flex-col overflow-hidden">
        <EmotionCalendar />
      </main>
    </div>
  )
}
