"use client";

import { Search, Bell, User, ChevronDown, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const pageTitles: Record<string, string> = {
  "/": "홈",
  "/news": "입시뉴스",
  "/info": "입시영상",
  "/chat": "입시Chat",
  "/community": "커뮤니티",
  "/sites": "입시정보",
  "/schools": "학교정보",
  "/academy": "학원정보",
  "/admin": "관리자",
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const title = pageTitles[pathname] || "딥클래스";
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
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

  return (
    <header className="sticky top-0 z-30 h-[52px] bg-surface border-b border-border flex items-center justify-between px-5">
      {/* Left - Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-foreground">{title}</span>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-light" />
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="w-full pl-9 pr-3 py-[6px] bg-surface-secondary border border-border rounded text-[13px] placeholder:text-muted-light focus:outline-none focus:border-primary-400 transition-colors"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button className="relative p-1.5 rounded text-muted-light hover:text-foreground hover:bg-surface-secondary transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-danger rounded-full" />
        </button>

        <div className="w-px h-5 bg-border mx-1" />

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-surface-secondary transition-colors"
            >
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary-700">{displayName[0]}</span>
              </div>
              <span className="text-[13px] text-muted max-w-[80px] truncate">{displayName}</span>
              <ChevronDown className="w-3 h-3 text-muted-light" />
            </button>
            {showDropdown && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-surface rounded border border-border shadow-lg py-1 animate-fade-in">
                <div className="px-3 py-2 border-b border-border-light">
                  <p className="text-[12px] font-semibold truncate">{displayName}</p>
                  <p className="text-[11px] text-muted-light truncate">{user.email}</p>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-muted hover:bg-surface-hover transition-colors">
                  <LogOut className="w-3.5 h-3.5" />로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 text-white rounded text-[12px] font-medium hover:bg-primary-700 transition-colors">
            <User className="w-3.5 h-3.5" />로그인
          </Link>
        )}
      </div>
    </header>
  );
}
