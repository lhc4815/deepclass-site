"use client";

import { Send, Bot, User, Sparkles, Target, BookOpen, BarChart3, GraduationCap, ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const suggestedCategories = [
  { icon: Target, title: "지원 전략", color: "text-blue-600 bg-blue-50",
    questions: ["내신 3등급인데 수시로 갈 수 있는 대학은?", "의대 가려면 어떤 전형이 유리해?"] },
  { icon: BookOpen, title: "전형 분석", color: "text-emerald-600 bg-emerald-50",
    questions: ["학생부종합전형 준비 방법을 알려줘", "논술전형 합격 전략은?"] },
  { icon: BarChart3, title: "성적 분석", color: "text-violet-600 bg-violet-50",
    questions: ["수능 영어 1등급 만드는 공부법", "정시 배치표 분석해줘"] },
  { icon: GraduationCap, title: "대학 정보", color: "text-amber-600 bg-amber-50",
    questions: ["서울대 합격을 위한 로드맵", "SKY 대학 입결 비교해줘"] },
];

interface Message { role: "user" | "assistant"; content: string; }

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((p) => [...p, { role: "user", content: msg }, {
      role: "assistant",
      content: "안녕하세요! 딥클래스 AI 입시 상담 서비스는 현재 준비 중입니다. 곧 AI가 여러분의 입시에 대한 맞춤형 상담을 제공할 예정이에요. 빠른 시일 내에 찾아뵙겠습니다!",
    }]);
    setInput("");
  };

  return (
    <div className="max-w-[800px] mx-auto h-[calc(100vh-6rem)] flex flex-col animate-fade-in">
      <div className="flex-1 flex flex-col bg-surface border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border bg-surface-secondary">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-[13px] font-bold flex items-center gap-1.5">
              딥클래스 AI
              <span className="px-1.5 py-0.5 bg-primary-100 text-primary-700 text-[9px] font-bold rounded">BETA</span>
            </h2>
            <p className="text-[10px] text-muted-light">입시 전문 AI 상담</p>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[10px] text-muted-light">온라인</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-center mb-3">
                <Sparkles className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-[15px] font-bold mb-1">무엇이든 물어보세요</h3>
              <p className="text-[12px] text-muted mb-5">입시 전략, 대학 선택, 전형 분석, 공부법 등</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                {suggestedCategories.map((cat) => (
                  <div key={cat.title} className="bg-surface-secondary border border-border-light rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${cat.color}`}>
                        <cat.icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[12px] font-semibold">{cat.title}</span>
                    </div>
                    <div className="space-y-1">
                      {cat.questions.map((q) => (
                        <button key={q} onClick={() => handleSend(q)}
                          className="w-full text-left px-2.5 py-1.5 rounded text-[11px] text-muted hover:bg-surface hover:text-primary-600 transition-colors flex items-center gap-1.5 group">
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
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] px-3 py-2 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary-600 text-white rounded-lg rounded-tr-sm"
                      : "bg-surface-secondary border border-border rounded-lg rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={endRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border bg-surface-secondary">
          <div className="flex items-center gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="입시에 대해 질문해보세요..."
              className="flex-1 px-3 py-2 bg-surface border border-border rounded text-[13px] placeholder:text-muted-light focus:outline-none focus:border-primary-400" />
            <button onClick={() => handleSend()} disabled={!input.trim()}
              className="px-3 py-2 bg-primary-600 text-white rounded text-[12px] font-medium hover:bg-primary-700 transition-colors disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-light mt-1.5 text-center">AI 상담은 참고용이며, 정확한 정보는 대학 공식 사이트를 확인하세요.</p>
        </div>
      </div>
    </div>
  );
}
