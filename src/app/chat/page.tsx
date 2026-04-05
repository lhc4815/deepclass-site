"use client";

import {
  Send,
  Bot,
  User,
  Sparkles,
  GraduationCap,
  BookOpen,
  Target,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

const suggestedCategories = [
  {
    icon: Target,
    title: "지원 전략",
    questions: [
      "내신 3등급인데 수시로 갈 수 있는 대학은?",
      "의대 가려면 어떤 전형이 유리해?",
    ],
    color: "from-blue-500 to-blue-600",
    lightColor: "bg-blue-50 text-blue-600",
  },
  {
    icon: BookOpen,
    title: "전형 분석",
    questions: [
      "학생부종합전형 준비 방법을 알려줘",
      "논술전형 합격 전략은?",
    ],
    color: "from-emerald-500 to-emerald-600",
    lightColor: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: BarChart3,
    title: "성적 분석",
    questions: [
      "수능 영어 1등급 만드는 공부법",
      "정시 배치표 분석해줘",
    ],
    color: "from-violet-500 to-purple-600",
    lightColor: "bg-violet-50 text-violet-600",
  },
  {
    icon: GraduationCap,
    title: "대학 정보",
    questions: [
      "서울대 합격을 위한 로드맵",
      "SKY 대학 입결 비교해줘",
    ],
    color: "from-amber-500 to-orange-600",
    lightColor: "bg-amber-50 text-amber-600",
  },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMessage: Message = { role: "user", content: msg };
    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        role: "assistant",
        content:
          "안녕하세요! 딥클래스 AI 입시 상담 서비스는 현재 준비 중입니다. 곧 AI가 여러분의 입시에 대한 맞춤형 상담을 제공할 예정이에요. 빠른 시일 내에 찾아뵙겠습니다! 🎓",
      },
    ]);
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-7rem)] flex flex-col animate-fade-in">
      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-surface rounded-2xl border border-border overflow-hidden shadow-[var(--shadow-card)]">
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border bg-gradient-to-r from-surface to-surface-secondary">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-1.5">
              딥클래스 AI
              <span className="px-1.5 py-0.5 bg-gradient-to-r from-violet-500 to-pink-500 text-[9px] font-bold text-white rounded-md">
                BETA
              </span>
            </h2>
            <p className="text-[11px] text-muted-light">입시 전문 AI 상담</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-dot" />
            <span className="text-[11px] text-muted-light">온라인</span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              {/* Empty state */}
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-violet-100 rounded-3xl flex items-center justify-center mb-5 shadow-inner">
                <Sparkles className="w-9 h-9 text-primary-600" />
              </div>
              <h2 className="text-lg font-bold mb-1">
                무엇이든 물어보세요
              </h2>
              <p className="text-sm text-muted mb-8 text-center max-w-md">
                입시 전략, 대학 선택, 전형 분석, 공부법 등<br />
                입시에 관한 모든 질문에 AI가 답변해드립니다.
              </p>

              {/* Suggested categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                {suggestedCategories.map((cat) => (
                  <div
                    key={cat.title}
                    className="bg-background rounded-xl border border-border-light p-4 space-y-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cat.lightColor}`}>
                        <cat.icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold">{cat.title}</span>
                    </div>
                    <div className="space-y-1.5">
                      {cat.questions.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSend(q)}
                          className="w-full text-left px-3 py-2 rounded-lg text-[12px] text-muted hover:bg-surface hover:text-primary-600 transition-all duration-200 flex items-center gap-2 group"
                        >
                          <ArrowRight className="w-3 h-3 text-muted-light group-hover:text-primary-500 flex-shrink-0" />
                          <span className="line-clamp-1">{q}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 animate-fade-in ${
                    msg.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-3 text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-2xl rounded-tr-md shadow-lg shadow-primary-600/15"
                        : "bg-surface-secondary border border-border-light rounded-2xl rounded-tl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-gradient-to-r from-surface to-surface-secondary">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="입시에 대해 질문해보세요..."
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-300 transition-all"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-3 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg shadow-primary-600/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-light mt-2 text-center">
            AI 상담은 참고용이며, 정확한 입시 정보는 대학 공식 사이트를 확인하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
