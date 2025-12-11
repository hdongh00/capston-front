"use client"

import { MessageCircle, Heart, Leaf } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const history = useRouter();
  const handleKakaoLogin = async () => {
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URL;
    const clientId = process.env.NEXT_PUBLIC_KAKAO_APP_KEY;
    window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
  }

  return (
    <div className="w-full max-w-md">
      {/* Main Card */}
      <div className="bg-card rounded-3xl border border-border p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            마음 속도
          </h1>
          <p className="text-sm text-muted-foreground">AI와 함께 당신의 감정을 나누고 성장해보세요</p>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Heart className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">AI 감정 분석</p>
              <p className="text-xs text-muted-foreground">당신의 감정을 깊이 있게 분석해드립니다</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 bg-secondary/10 rounded-lg flex-shrink-0">
              <Leaf className="w-4 h-4 text-secondary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">심리 상담</p>
              <p className="text-xs text-muted-foreground">전문 상담사와 함께 마음을 돌봐보세요</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">커뮤니티 공유</p>
              <p className="text-xs text-muted-foreground">같은 마음을 가진 사람들과 소통하세요</p>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="space-y-4">
          <img onClick={handleKakaoLogin} className="cursor-pointer" src="kakao-login.png" />
        </div>
        <div className="flex items-center justify-center mt-5 bg bg-gradient-to-br from-primary/20 to-secondary/20 p-3 rounded-2xl cursor-pointer"
        onClick={()=>history.push("/")}>
          홈으로 돌아가기
        </div>

        {/* Info */}
        <p className="text-xs text-center text-muted-foreground mt-6 ">
          로그인하면{" "}
          <Link href="#" className="text-primary hover:underline">
            이용약관
          </Link>
          과{" "}
          <Link href="#" className="text-primary hover:underline">
            개인정보처리방침
          </Link>
          에 동의합니다
        </p>
      </div>
    </div>
  )
}
