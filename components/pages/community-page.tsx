"use client"

import { useState } from "react"
import {
  Heart,
  MessageCircle,
  Share2,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  CloudDrizzle,
  X,
  Edit2,
  Trash2,
  Send,
} from "lucide-react"

interface Post {
  id: string
  author: string
  avatar: string
  date: string
  emotion: "sunny" | "cloudy" | "rainy" | "snowy" | "windy" | "drizzle"
  title: string
  content: string
  likes: number
  comments: number
  tags: string[]
  isOwn?: boolean
}

interface Comment {
  id: string
  author: string
  avatar: string
  date: string
  content: string
  isOwn?: boolean
}

const emotionWeatherMap = {
  sunny: { icon: Sun, label: "맑음", color: "text-yellow-500" },
  cloudy: { icon: Cloud, label: "흐림", color: "text-gray-400" },
  rainy: { icon: CloudRain, label: "비", color: "text-blue-500" },
  snowy: { icon: CloudSnow, label: "눈", color: "text-blue-300" },
  windy: { icon: Wind, label: "바람", color: "text-gray-500" },
  drizzle: { icon: CloudDrizzle, label: "이슬비", color: "text-blue-400" },
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: "행복한마음",
    avatar: "👤",
    date: "2시간 전",
    emotion: "sunny",
    title: "오늘은 정말 좋은 하루였어요",
    content:
      "새로운 도전에 성공했어요! 처음엔 두려웠지만 한 걸음 한 걸음 나아가다 보니 결국 해냈습니다. 모든 사람들이 저를 응원해주었고, 그 응원이 저에게 큰 힘이 되었습니다.",
    likes: 45,
    comments: 12,
    tags: ["성공", "성취감", "감사"],
    isOwn: true,
  },
  {
    id: "2",
    author: "조용한생각",
    avatar: "👤",
    date: "5시간 전",
    emotion: "cloudy",
    title: "마음이 복잡한 날들을 보내며",
    content: "최근 몇 주간 마음이 복잡했습니다. 특별히 나쁜 일이 있는 건 아닌데 뭔가 막혀있는 기분이에요.",
    likes: 28,
    comments: 8,
    tags: ["감정", "생각", "성장"],
    isOwn: false,
  },
  {
    id: "3",
    author: "희망의빛",
    avatar: "👤",
    date: "12시간 전",
    emotion: "rainy",
    title: "힘든 날을 이겨내며",
    content:
      "어제는 정말 힘든 하루였습니다. 예상치 못한 일들이 연달아 일어났어요. 하지만 밤하늘의 별을 보면서 이것도 지나가겠구나 싶었습니다. 모든 날씨가 결국 지나가고, 해는 다시 뜨니까요.",
    likes: 67,
    comments: 19,
    tags: ["극복", "희망", "시간"],
    isOwn: false,
  },
  {
    id: "4",
    author: "감사한맘",
    avatar: "👤",
    date: "1일 전",
    emotion: "sunny",
    title: "주변 사람들에게 감사해요",
    content:
      "오늘 깨달았어요. 내가 혼자가 아니라는 것을요. 내 곁에는 항상 나를 응원해주고 격려해주는 사람들이 있습니다.",
    likes: 89,
    comments: 24,
    tags: ["감사", "관계", "사랑"],
    isOwn: false,
  },
]

const mockComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "c1",
      author: "응원하는사람",
      avatar: "👤",
      date: "1시간 전",
      content: "축하합니다! 당신의 성공이 우리 모두에게 힘이 되었어요!",
      isOwn: false,
    },
    {
      id: "c2",
      author: "나도함께",
      avatar: "👤",
      date: "30분 전",
      content: "정말 멋있어요. 나도 힘내야겠다는 생각이 들었습니다.",
      isOwn: true,
    },
  ],
  "2": [
    {
      id: "c3",
      author: "공감하는마음",
      avatar: "👤",
      date: "4시간 전",
      content: "저도 요즘 그런 느낌이에요. 함께 있다는 생각에 조금 위로가 됩니다.",
      isOwn: false,
    },
  ],
  "3": [
    {
      id: "c4",
      author: "희망공유",
      avatar: "👤",
      date: "11시간 전",
      content: "정말 멋진 글이에요. 모든 것이 지나간다는 말이 정말 위로가 됩니다.",
      isOwn: false,
    },
    {
      id: "c5",
      author: "함께하는",
      avatar: "👤",
      date: "10시간 전",
      content: "당신의 글을 읽으며 저도 힘을 냈습니다. 감사합니다.",
      isOwn: false,
    },
  ],
  "4": [],
}

const sortOptions = ["최신순", "인기순", "댓글순"]

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [sortBy, setSortBy] = useState("최신순")
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [showDetailView, setShowDetailView] = useState(false)
  const [commentText, setCommentText] = useState("")

  const handleLike = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter((post) => post.id !== postId))
    setShowDetailView(false)
    setSelectedPostId(null)
  }

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..."
    }
    return text
  }

  const selectedPost = selectedPostId ? posts.find((post) => post.id === selectedPostId) : null
  const selectedComments = selectedPostId ? mockComments[selectedPostId] || [] : []

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground text-lg">일기 커뮤니티</h2>
          <p className="text-xs text-muted-foreground mt-1">당신의 이야기를 나누고 서로를 응원해주세요</p>
        </div>
      </div>

      {/* Sort Options */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="flex gap-2">
          {sortOptions.map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                sortBy === option ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List or Detail View */}
      {!showDetailView ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {posts.map((post) => {
              const WeatherIcon = emotionWeatherMap[post.emotion].icon
              const weatherColor = emotionWeatherMap[post.emotion].color
              const weatherLabel = emotionWeatherMap[post.emotion].label
              const truncatedContent = truncateText(post.content)

              return (
                <div
                  key={post.id}
                  onClick={() => {
                    setSelectedPostId(post.id)
                    setShowDetailView(true)
                  }}
                  className="bg-card rounded-2xl border border-border hover:border-primary/50 transition-all shadow-sm overflow-hidden cursor-pointer"
                >
                  {/* Post Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-start gap-3 justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-lg">{post.avatar}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-sm text-foreground">{post.author}</span>
                            <span className="text-xs text-muted-foreground">{post.date}</span>
                            <div className="flex items-center gap-1 text-xs">
                              <WeatherIcon className={`w-3 h-3 ${weatherColor}`} />
                              <span className="text-muted-foreground">{weatherLabel}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {post.isOwn && (
                        <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button className="p-1 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-foreground text-base leading-relaxed">{post.title}</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed">{truncatedContent}</p>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Footer */}
                  <div className="px-4 py-3 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(post.id)
                        }}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto">
            {selectedPost && (
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-border flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{selectedPost.avatar}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-foreground">{selectedPost.author}</span>
                        <span className="text-sm text-muted-foreground">{selectedPost.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">감정 상태:</span>
                        {emotionWeatherMap[selectedPost.emotion] && (
                          <>
                            <span className="text-sm text-muted-foreground">
                              {emotionWeatherMap[selectedPost.emotion].label}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDetailView(false)}
                    className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">{selectedPost.title}</h2>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
                  </div>

                  {/* Tags */}
                  {selectedPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                      {selectedPost.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
                  <div className="flex gap-6">
                    <button
                      onClick={() => handleLike(selectedPost.id)}
                      className="flex items-center gap-2 hover:text-primary transition-colors text-muted-foreground"
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-sm">{selectedPost.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-primary transition-colors text-muted-foreground">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{selectedComments.length}</span>
                    </button>
                  </div>
                  <button className="flex items-center gap-2 hover:text-primary transition-colors text-muted-foreground">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Action Buttons for Own Post */}
                {selectedPost.isOwn && (
                  <div className="px-6 py-3 border-t border-border flex gap-2 justify-end">
                    <button className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors font-medium text-sm flex items-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      수정하기
                    </button>
                    <button
                      onClick={() => {
                        handleDeletePost(selectedPost.id)
                      }}
                      className="px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제하기
                    </button>
                  </div>
                )}

                {/* Comments Section */}
                <div className="border-t border-border">
                  {/* Comments List */}
                  {selectedComments.length > 0 && (
                    <div className="p-6 space-y-4 bg-muted/20">
                      <h3 className="font-semibold text-foreground mb-4">댓글 ({selectedComments.length})</h3>
                      {selectedComments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 pb-4 border-b border-border last:border-b-0">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">{comment.avatar}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-foreground">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">{comment.date}</span>
                            </div>
                            <p className="text-sm text-foreground/80">{comment.content}</p>
                            {comment.isOwn && (
                              <div className="flex gap-2 mt-2">
                                <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                                  수정
                                </button>
                                <button className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Input */}
                  <div className="p-4 border-t border-border bg-muted/10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="댓글을 작성해주세요..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
