"use client"

import Navigation from "@/components/navigation"
import CommunityPage from "@/components/pages/community-page"

export default function Community() {
  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <main className="flex-1 flex flex-col overflow-hidden">
        <CommunityPage />
      </main>
    </div>
  )
}
