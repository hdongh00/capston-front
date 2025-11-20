"use client"

import Navigation from "@/components/navigation"
import ProfilePage from "@/components/pages/profile-page"

export default function Profile() {
  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ProfilePage />
      </main>
    </div>
  )
}
