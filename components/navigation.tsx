"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, BarChart3, Music, User, Share2, Menu, X, LogOut } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contenxts/AuthContext"

export default function Navigation() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(true)
  const {isLoggedIn, logout} = useAuth();
  
  const history = useRouter();
  
  const navItems = [
    { href: "/", label: "홈", icon: Home },
    { href: "/emotion-log", label: "감정 기록", icon: BarChart3 },
    { href: "/mind-care", label: "마음 관리", icon: Music },
    { href: "/profile", label: "프로필", icon: User },
    { href: "/community", label: "일기 커뮤니티", icon: Share2 },
  ]
  const controlAuth = () => {
    isLoggedIn ? logout() : history.push("/login");
  }
  return (
    <nav
      className={`${isExpanded ? "w-64" : "w-20"} bg-card border-r border-border flex flex-col transition-all duration-300 shadow-sm`}
    >
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        {isExpanded && (
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              마음 속도
            </h1>
            <p className="text-xs text-muted-foreground mt-1">AI 감정 상담</p>
          </div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
        >
          {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all justify-center ${isExpanded ? "justify-start" : ""} ${isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    }`}
                  title={!isExpanded ? item.label : ""}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isExpanded && <span className="text-sm">{item.label}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Footer - 로그인/로그아웃 상태에 따라 버튼 변경 */}
      <div className="p-4 border-t border-border">
          <button
            onClick={controlAuth}
            className={`w-full px-4 py-2 text-sm rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${isLoggedIn
                ? "bg-primary/10 hover:bg-primary/20 text-primary"
                : "bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              } ${!isExpanded ? "p-2" : ""}`}
          >
            {isLoggedIn ? (
              <>
                <LogOut className="w-4 h-4" />
                {isExpanded && "로그아웃"}
              </>
            ) : (
              <>{isExpanded ? "로그인" : "로그"}</>
            )}
          </button>
      </div>
    </nav>
  )
}
