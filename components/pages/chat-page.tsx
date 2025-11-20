"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, MessageCircle, Smile, Lightbulb, Settings2 } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
  emotion?: string
}

const emotionEmojis: { [key: string]: string } = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  anxious: "😰",
  neutral: "😐",
  grateful: "🙏",
  excited: "🤩",
}

const chatbotModes = [
  { id: "polite", label: "존댓말", description: "존댓말로 대화합니다" },
  { id: "casual", label: "반말", description: "편한 반말로 대화합니다" },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: '안녕하세요! 저는 심리 상담 AI 봇 "마음 친구"입니다. 오늘 기분은 어떠신가요? 무엇이 당신의 마음을 더 편하게 해줄 수 있을까요?',
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedTopics, setSuggestedTopics] = useState<string[]>([
    "오늘 하루를 말해줄래?",
    "최근 스트레스가 있어?",
    "기분이 좋았던 순간이 있어?",
  ])
  const [selectedMode, setSelectedMode] = useState("polite")
  const [showModeSelector, setShowModeSelector] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const detectEmotion = (text: string): string => {
    const sadWords = ["슬프", "외로", "힘들", "피곤", "상처", "우울"]
    const happyWords = ["행복", "기쁨", "즐거", "좋", "신나", "감사"]
    const angryWords = ["화나", "짜증", "화다", "열받", "싫"]

    const textLower = text.toLowerCase()
    if (sadWords.some((word) => textLower.includes(word))) return "슬픈"
    if (happyWords.some((word) => textLower.includes(word))) return "행복한"
    if (angryWords.some((word) => textLower.includes(word))) return "화난"
    return "중립적인"
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const emotion = detectEmotion(input)
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
      emotion,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "당신의 감정을 나누어주셔서 감사합니다. 그 상황이 정말 힘들었을 것 같네요. 더 자세히 이야기해 주실 수 있을까요?",
        "그렇군요. 그런 감정을 느끼시는 것은 자연스러운 일입니다. 그 감정들과 더 자세히 대면해 볼까요?",
        "좋은 일이 있었네요! 당신이 행복해하시는 모습을 상상하니 저도 함께 기쁩니다. 그 순간에 대해 더 말씀해 주시겠어요?",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleSuggestedTopic = (topic: string) => {
    setInput(topic)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-primary/10 rounded-lg">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">마음 친구와의 상담</h2>
            <p className="text-xs text-muted-foreground">항상 당신의 말을 경청합니다</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowModeSelector(!showModeSelector)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="챗봇 모드 선택"
          >
            <Settings2 className="w-5 h-5 text-primary" />
          </button>

          {showModeSelector && (
            <div className="absolute right-0 top-12 bg-card border border-border rounded-lg shadow-lg p-3 w-48 z-50">
              <p className="text-xs font-medium text-muted-foreground mb-2">챗봇 모드 선택</p>
              {chatbotModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setSelectedMode(mode.id)
                    setShowModeSelector(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm mb-1 ${
                    selectedMode === mode.id
                      ? "bg-primary/20 text-primary font-medium"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <p className="font-medium">{mode.label}</p>
                  <p className="text-xs text-muted-foreground">{mode.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 1 && (
          <div className="mt-8 space-y-4">
            <div className="text-center mb-6">
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-3">
                <Smile className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">당신의 감정을 나누어주세요</h3>
              <p className="text-sm text-muted-foreground">편안한 환경에서 당신의 마음을 이야기할 수 있습니다</p>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              {suggestedTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedTopic(topic)}
                  className="w-full p-3 text-left bg-card border border-border hover:border-primary/50 hover:bg-primary/5 rounded-lg transition-all text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{topic}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none shadow-sm"
                  : "bg-card border border-border text-foreground rounded-bl-none shadow-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p
                className={`text-xs mt-2 ${
                  message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}
              >
                {message.timestamp.toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-4 shadow-lg">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="당신의 마음을 나누어주세요..."
            className="flex-1 px-4 py-3 bg-muted border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
