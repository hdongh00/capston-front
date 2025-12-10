"use client"

import { useEffect, useState } from "react"
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

type ForumResponse = {
  id: number
  userCode: number
  title: string
  content: string
  deleted: boolean
  analysisSummary?: string | null
  emotionName?: string | null
  commentCount?: number | null
  likeCount?: number | null
  createdAt: string
}

type CommentResponse = {
  id: number
  forumId: number
  userCode: number
  content: string
  parentCommentId?: number | null
  deleted: boolean
  createdAt: string
}

const API_BASE_URL = "http://localhost:8080/api"

const emotionWeatherMap = {
  sunny: { icon: Sun, label: "맑음", color: "text-yellow-500" },
  cloudy: { icon: Cloud, label: "흐림", color: "text-gray-400" },
  rainy: { icon: CloudRain, label: "비", color: "text-blue-500" },
  snowy: { icon: CloudSnow, label: "눈", color: "text-blue-300" },
  windy: { icon: Wind, label: "바람", color: "text-gray-500" },
  drizzle: { icon: CloudDrizzle, label: "이슬비", color: "text-blue-400" },
}

const sortOptions = ["최신순", "인기순", "댓글순"]

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [sortBy, setSortBy] = useState("최신순")
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [showDetailView, setShowDetailView] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [selectedComments, setSelectedComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingComments, setLoadingComments] = useState(false)

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "..."
    }
    return text
  }

  const formatDate = (value: string) => {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const mapForumToPost = (forum: ForumResponse): Post => {
    const emotionKey =
      (forum.emotionName as Post["emotion"]) || "sunny"

    return {
      id: String(forum.id),
      author: "익명",
      avatar: "👤",
      date: formatDate(forum.createdAt),
      emotion: emotionKey,
      title: forum.title,
      content: forum.content,
      likes: forum.likeCount ?? 0,
      comments: forum.commentCount ?? 0,
      tags: [],
      isOwn: false,
    }
  }

  const mapCommentToComment = (comment: CommentResponse): Comment => {
    return {
      id: String(comment.id),
      author: "익명",
      avatar: "👤",
      date: formatDate(comment.createdAt),
      content: comment.content,
      isOwn: false,
    }
  }

  const fetchPosts = async (sort?: string) => {
    try {
      setLoading(true)
      const url =
        sort && sort !== "최신순"
          ? `${API_BASE_URL}/board?sort=${encodeURIComponent(sort)}`
          : `${API_BASE_URL}/board`

      const res = await fetch(url)
      if (!res.ok) throw new Error("failed to load forums")
      const data: ForumResponse[] = await res.json()
      const mapped = data.map(mapForumToPost)
      setPosts(mapped)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (postId: string) => {
    try {
      setLoadingComments(true)
      const res = await fetch(`${API_BASE_URL}/board/${postId}/comments`)
      if (!res.ok) throw new Error("failed to load comments")
      const data: CommentResponse[] = await res.json()
      const mapped = data.map(mapCommentToComment)
      setSelectedComments(mapped)
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingComments(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (sortBy === "인기순") {
      fetchPosts("likes")
    } else if (sortBy === "댓글순") {
      fetchPosts("comments")
    } else {
      fetchPosts()
    }
  }, [sortBy])

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    )
  }

  const handleDeletePost = (postId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId))
    setShowDetailView(false)
    setSelectedPostId(null)
    setSelectedComments([])
  }

  const selectedPost = selectedPostId ? posts.find((post) => post.id === selectedPostId) : null

  const sortedPosts = [...posts]

  if (sortBy === "인기순") {
    sortedPosts.sort((a, b) => b.likes - a.likes)
  } else if (sortBy === "댓글순") {
    sortedPosts.sort((a, b) => b.comments - a.comments)
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground text-lg">일기 커뮤니티</h2>
          <p className="text-xs text-muted-foreground mt-1">당신의 이야기를 나누고 서로를 응원해주세요</p>
        </div>
      </div>

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

      {!showDetailView ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {loading && <div className="text-center text-sm text-muted-foreground py-4">불러오는 중...</div>}
            {!loading &&
              sortedPosts.map((post) => {
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
                      fetchComments(post.id)
                    }}
                    className="bg-card rounded-2xl border border-border hover:border-primary/50 transition-all shadow-sm overflow-hidden cursor-pointer"
                  >
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

                    <div className="p-4 space-y-3">
                      <h3 className="font-semibold text-foreground text-base leading-relaxed">{post.title}</h3>
                      <p className="text-sm text-foreground/80 leading-relaxed">{truncatedContent}</p>

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
                    onClick={() => {
                      setShowDetailView(false)
                      setSelectedPostId(null)
                      setSelectedComments([])
                    }}
                    className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-3">{selectedPost.title}</h2>
                    <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
                  </div>

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

                <div className="border-t border-border">
                  {loadingComments && (
                    <div className="p-6 text-sm text-muted-foreground">댓글 불러오는 중...</div>
                  )}
                  {!loadingComments && selectedComments.length > 0 && (
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
