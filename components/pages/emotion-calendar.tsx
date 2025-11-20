"use client"

import { useState } from "react"
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  CloudDrizzle,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp,
  Share2,
  Wand2,
} from "lucide-react"

interface EmotionEntry {
  date: string
  emotion: "sunny" | "cloudy" | "rainy" | "snowy" | "windy" | "drizzle"
  diary: string
  conversationSummary: string
}

const emotionWeatherMap = {
  sunny: { icon: Sun, label: "맑음", color: "text-yellow-500" },
  cloudy: { icon: Cloud, label: "흐림", color: "text-gray-400" },
  rainy: { icon: CloudRain, label: "비", color: "text-blue-500" },
  snowy: { icon: CloudSnow, label: "눈", color: "text-blue-300" },
  windy: { icon: Wind, label: "바람", color: "text-gray-500" },
  drizzle: { icon: CloudDrizzle, label: "이슬비", color: "text-blue-400" },
}

const mockEmotionData: EmotionEntry[] = [
  {
    date: "2025-11-01",
    emotion: "sunny",
    diary:
      "오늘은 정말 좋은 하루였어. 새로운 프로젝트를 시작했고, 팀원들의 반응이 긍정적이었다. 이런 기분이 계속되었으면 좋겠다.",
    conversationSummary:
      "새로운 도전에 대한 기대감과 성취감을 느끼셨군요. 그 긍정적인 에너지를 계속 유지하면서도 균형을 잡는 것이 중요합니다.",
  },
  {
    date: "2025-11-02",
    emotion: "cloudy",
    diary:
      "뭔가 마음이 복잡한 날. 특별히 나쁜 일이 있는 건 아닌데, 마음이 가라앉은 기분. 조용히 혼자 시간을 가져봐야겠다.",
    conversationSummary: "감정의 변화는 자연스러운 일입니다. 이런 시간을 통해 자신을 더 잘 이해할 수 있습니다.",
  },
  {
    date: "2025-11-04",
    emotion: "rainy",
    diary:
      "스트레스가 많은 날이었다. 일이 예상과 다르게 진행되었고, 사람들과의 관계에서도 어색함을 느꼈다. 빨리 이 기분이 지나가면 좋겠다.",
    conversationSummary:
      "어려운 상황이셨네요. 하지만 이런 경험들도 우리를 성장하게 합니다. 자신을 너무 책망하지 마세요.",
  },
  {
    date: "2025-11-07",
    emotion: "sunny",
    diary: "정말 오랜만에 기분이 좋은 날. 친구들을 만나 웃고 떠들었다. 이렇게 즐거운 시간이 있다는 것이 참 소중하다.",
    conversationSummary: "소중한 순간들을 느끼실 수 있다는 것이 정말 좋습니다. 이런 긍정적인 감정을 계속 느껴가세요.",
  },
]

export default function EmotionCalendar() {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedEntry, setSelectedEntry] = useState<EmotionEntry | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)
  const [generatedDiary, setGeneratedDiary] = useState<string | null>(null)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getEmotionForDate = (day: number): EmotionEntry | undefined => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return mockEmotionData.find((entry) => entry.date === dateString)
  }

  const handleGenerateDiary = () => {
    if (!selectedEntry) return
    const generatedText = `[AI 자동 생성 일기]\n\n${selectedEntry.diary}\n\n이 날씨의 감정 상태에서 당신은 많은 생각과 경험을 나누었습니다. 오늘의 경험이 당신의 성장에 도움이 되기를 바랍니다.`
    setGeneratedDiary(generatedText)
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4 shadow-sm">
        <h2 className="font-semibold text-foreground text-lg">감정 기록</h2>
        <p className="text-xs text-muted-foreground mt-1">날씨로 표현된 당신의 감정을 확인하세요</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-sm">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={previousMonth} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="font-semibold text-lg">
                {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
              </h3>
              <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const emotion = day ? getEmotionForDate(day) : null
                const WeatherIcon = emotion ? emotionWeatherMap[emotion.emotion].icon : null

                return (
                  <button
                    key={index}
                    onClick={() => emotion && setSelectedEntry(emotion)}
                    disabled={!emotion}
                    className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                      day
                        ? emotion
                          ? "bg-primary/10 hover:bg-primary/20 cursor-pointer border border-primary/30"
                          : "bg-muted text-muted-foreground"
                        : "bg-transparent"
                    }`}
                  >
                    {day && (
                      <div className="flex flex-col items-center">
                        {emotion && WeatherIcon && (
                          <WeatherIcon className={`w-6 h-6 ${emotion && emotionWeatherMap[emotion.emotion].color}`} />
                        )}
                        {!emotion && <span className="text-sm text-muted-foreground">{day}</span>}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm font-medium mb-3 text-foreground">감정 날씨</p>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(emotionWeatherMap).map(([key, { icon: Icon, label }]) => (
                  <div key={key} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emotion Report */}
          <div className="lg:col-span-1 space-y-4">
            {/* Report Card */}
            <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">감정 변화</h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-foreground">이번 달 기록 횟수</span>
                  <span className="font-semibold text-primary">{mockEmotionData.length}회</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-foreground">가장 많은 감정</span>
                  <span className="font-semibold text-primary">맑음</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-foreground">감정 변동성</span>
                  <span className="font-semibold text-primary">중간</span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium">
                상세 리포트 보기
              </button>
            </div>

            {/* Selected Entry */}
            {selectedEntry && (
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-primary/20 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-foreground">오늘의 일기</h4>
                  <button
                    onClick={() => {
                      setSelectedEntry(null)
                      setGeneratedDiary(null)
                    }}
                    className="p-1 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground mb-3">
                  {new Date(selectedEntry.date).toLocaleDateString("ko-KR")}
                </p>

                <div className="mb-4">
                  <p className="text-sm text-foreground leading-relaxed mb-4">{selectedEntry.diary}</p>

                  <div className="p-3 bg-card rounded-lg border border-border">
                    <p className="text-xs font-medium text-primary mb-2">상담사 코멘트</p>
                    <p className="text-sm text-foreground leading-relaxed">{selectedEntry.conversationSummary}</p>
                  </div>
                </div>

                {!generatedDiary ? (
                  <button
                    onClick={handleGenerateDiary}
                    className="w-full mt-4 px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" />
                    일기 자동 생성
                  </button>
                ) : (
                  <div className="space-y-2 mt-4">
                    <div className="p-3 bg-card rounded-lg border border-border max-h-24 overflow-y-auto">
                      <p className="text-xs text-muted-foreground mb-1 font-medium">생성된 일기:</p>
                      <p className="text-sm text-foreground whitespace-pre-wrap">{generatedDiary}</p>
                    </div>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      커뮤니티에 공유하기
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">커뮤니티에 공유</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">공유할 일기:</p>
                <div className="p-3 bg-muted rounded-lg border border-border max-h-24 overflow-y-auto">
                  <p className="text-sm text-foreground whitespace-pre-wrap">{generatedDiary}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">제목 (선택사항)</label>
                <input
                  type="text"
                  placeholder="커뮤니티에서 보여질 제목을 입력하세요"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">태그 (선택사항)</label>
                <input
                  type="text"
                  placeholder="예: 감사, 성취, 희망 (쉼표로 구분)"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border flex gap-2 justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors font-medium text-sm"
              >
                취소
              </button>
              <button
                onClick={() => {
                  setShowShareModal(false)
                  setGeneratedDiary(null)
                }}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium text-sm"
              >
                공유하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
