import Navigation from "@/components/navigation"
import ChatPage from "@/components/pages/chat-page"

export default function Home() {
  return (
    <div className="flex h-screen bg-background">
      <Navigation />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatPage />
      </main>
    </div>
  )
}
