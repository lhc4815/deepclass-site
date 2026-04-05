"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper,
  BookOpen,
  MessageCircle,
  MessageSquare,
  School,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  Sparkles,
  LogIn,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    label: "홈",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "입시뉴스",
    href: "/news",
    icon: Newspaper,
  },
  {
    label: "입시정보",
    href: "/info",
    icon: BookOpen,
  },
  {
    label: "입시Chat",
    href: "/chat",
    icon: MessageCircle,
    badge: "AI",
  },
  {
    label: "커뮤니티",
    href: "/community",
    icon: MessageSquare,
    badge: "NEW",
  },
  {
    label: "학원정보",
    href: "/academy",
    icon: School,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen bg-sidebar flex flex-col transition-all duration-300 ease-in-out ${
          collapsed ? "w-[68px]" : "w-[250px]"
        }`}
        style={{ boxShadow: "var(--shadow-sidebar)" }}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-sidebar-border ${collapsed ? "px-3 justify-center" : "px-5"}`}>
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-900/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[15px] font-bold text-white tracking-tight">
                  딥클래스
                </span>
                <span className="text-[10px] text-sidebar-text tracking-widest uppercase">
                  DeepClass
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Section label */}
        {!collapsed && (
          <div className="px-5 pt-5 pb-2">
            <span className="text-[10px] font-semibold text-sidebar-text/50 uppercase tracking-widest">
              메뉴
            </span>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 ${collapsed ? "px-2 pt-4" : "px-3"} space-y-0.5 overflow-y-auto`}>
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
                  active
                    ? "bg-sidebar-active text-sidebar-text-active shadow-lg shadow-black/10"
                    : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active"
                }`}
                title={collapsed ? item.label : undefined}
              >
                {/* Active indicator */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary-400 rounded-r-full" />
                )}
                <item.icon
                  className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${
                    active ? "text-primary-400" : "text-sidebar-text group-hover:text-sidebar-text-active"
                  }`}
                />
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-1.5 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-[9px] font-bold text-white rounded-md">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className={`${collapsed ? "px-2" : "px-3"} py-3 border-t border-sidebar-border space-y-0.5`}>
          {/* Admin */}
          <Link
            href="/admin"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group ${
              isActive("/admin")
                ? "bg-sidebar-active text-sidebar-text-active"
                : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active"
            }`}
            title={collapsed ? "관리자" : undefined}
          >
            <Settings
              className={`w-[18px] h-[18px] flex-shrink-0 ${
                isActive("/admin") ? "text-primary-400" : "text-sidebar-text group-hover:text-sidebar-text-active"
              }`}
            />
            {!collapsed && <span>관리자</span>}
          </Link>

          {/* Collapse */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-text-active transition-all duration-200 w-full"
          >
            {collapsed ? (
              <ChevronRight className="w-[18px] h-[18px] flex-shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-[18px] h-[18px] flex-shrink-0" />
                <span>사이드바 접기</span>
              </>
            )}
          </button>

          {/* User area */}
          {!collapsed && (
            <div className="mt-2 mx-1 p-3 rounded-xl bg-sidebar-hover/50 border border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                  <LogIn className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-sidebar-text-active">로그인하기</p>
                  <p className="text-[10px] text-sidebar-text">더 많은 기능을 이용하세요</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Sidebar spacer for content */}
      <div className={`transition-all duration-300 ${collapsed ? "w-[68px]" : "w-[250px]"} flex-shrink-0`} />
    </>
  );
}
