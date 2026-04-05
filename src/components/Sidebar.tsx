"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper,
  BookOpen,
  Play,
  MessageCircle,
  MessageSquare,
  School,
  Settings,
  GraduationCap,
  LayoutDashboard,
  LogIn,
} from "lucide-react";

const menuItems = [
  { label: "홈", href: "/", icon: LayoutDashboard },
  { label: "입시뉴스", href: "/news", icon: Newspaper },
  { label: "입시영상", href: "/info", icon: Play },
  { label: "입시Chat", href: "/chat", icon: MessageCircle, badge: "AI" },
  { label: "커뮤니티", href: "/community", icon: MessageSquare },
  { label: "입시정보", href: "/sites", icon: BookOpen },
  { label: "학원정보", href: "/academy", icon: School },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[200px] bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center h-[52px] px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-600 rounded flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold text-foreground">딥클래스</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 px-2 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-[7px] rounded text-[13px] transition-colors ${
                active
                  ? "bg-primary-50 text-primary-700 font-semibold"
                  : "text-muted hover:bg-surface-hover hover:text-foreground"
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary-600" : "text-muted-light"}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-1.5 py-0.5 bg-primary-600 text-[9px] font-bold text-white rounded">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-2 border-t border-border">
        <Link
          href="/admin"
          className={`flex items-center gap-2.5 px-3 py-[7px] rounded text-[13px] transition-colors ${
            isActive("/admin") ? "bg-primary-50 text-primary-700 font-semibold" : "text-muted hover:bg-surface-hover"
          }`}
        >
          <Settings className="w-4 h-4 text-muted-light" />
          <span>관리자</span>
        </Link>
      </div>
    </aside>
  );
}
