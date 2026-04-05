"use client";

import { Search, Bell, User, ChevronDown, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const pageTitles: Record<string, { title: string; description: string }> = {
  "/": { title: "홈", description: "입시 정보를 한눈에 확인하세요" },
  "/news": { title: "입시뉴스", description: "최신 입시 뉴스와 기사" },
  "/info": { title: "입시정보", description: "영상, 일정, 자료 모음" },
  "/chat": { title: "입시Chat", description: "AI 입시 상담" },
  "/community": { title: "커뮤니티", description: "입시 이야기를 나눠보세요" },
  "/sites": { title: "입시사이트", description: "유용한 입시 사이트 모음" },
  "/academy": { title: "학원정보", description: "학원·인강·컨설팅 정보" },
  "/admin": { title: "관리자", description: "콘텐츠 및 사이트 관리" },
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pageInfo = pageTitles[pathname] || pageTitles["/"];
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowDropdown(false);
    router.refresh();
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "사용자";
  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header
      className="sticky top-0 z-30 h-16 glass border-b border-border flex items-center justify-between px-6 gap-4"
      style={{ boxShadow: "var(--shadow-header)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="hidden lg:block">
          <h1 className="text-sm font-semibold text-foreground leading-tight">{pageInfo.title}</h1>
          <p className="text-[11px] text-muted-light">{pageInfo.description}</p>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-lg mx-auto">
        <div className={`relative transition-all duration-200 ${searchFocused ? "scale-[1.02]" : ""}`}>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light" />
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className={`w-full pl-10 pr-20 py-2.5 bg-surface-secondary border rounded-xl text-sm placeholder:text-muted-light transition-all duration-200 ${
              searchFocused
                ? "border-primary-300 ring-2 ring-primary-100 bg-surface shadow-lg shadow-primary-500/5"
                : "border-transparent hover:border-border hover:bg-surface"
            } focus:outline-none`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 pointer-events-none">
            <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] text-muted font-mono">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] text-muted font-mono">K</kbd>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="relative p-2.5 rounded-xl text-muted hover:bg-surface-secondary hover:text-foreground transition-all duration-200">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full animate-pulse-dot ring-2 ring-white" />
        </button>

        <div className="w-px h-8 bg-border mx-1" />

        {/* User / Login */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-secondary transition-all duration-200 group"
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-8 h-8 rounded-lg object-cover" />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-xs font-bold text-white">{displayName[0]}</span>
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium text-muted group-hover:text-foreground transition-colors max-w-[100px] truncate">
                {displayName}
              </span>
              <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-muted-light" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-xl border border-border shadow-[var(--shadow-dropdown)] py-1.5 animate-fade-in">
                <div className="px-3 py-2 border-b border-border-light">
                  <p className="text-xs font-semibold truncate">{displayName}</p>
                  <p className="text-[10px] text-muted-light truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted hover:bg-surface-hover hover:text-foreground transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-surface-secondary transition-all duration-200 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-sm font-medium text-muted group-hover:text-foreground transition-colors">
              로그인
            </span>
          </Link>
        )}
      </div>
    </header>
  );
}
