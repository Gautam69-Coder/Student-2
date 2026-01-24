
import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ComingSoonPage from "../../Utils/ComingSoon";
// UI imports removed

import { Sparkles, X, Send, Minimize2, PencilLine } from "lucide-react"

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi there! I'm your study assistant. Need help with any concepts today?" },
  ])

  const handleSend = () => {
    if (!message.trim()) return
    setMessages([...messages, { role: "user", content: message }])
    setMessage("")
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I can definitely help with that! Let's break it down properly..." },
      ])
    }, 1000)
  }

  return (
    <>
      {/* Levitating Pencil Bubble */}
      {/* <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
              scale: { duration: 0.2 }
            }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-2xl bg-slate-900 shadow-[0_4px_20px_rgba(15,23,42,0.15)] flex items-center justify-center hover:bg-slate-800 transition-colors"
          >
            <PencilLine className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence> */}

      {/* Minimal Chat Window */}
      {/* <AnimatePresence> */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-8 right-8 z-50 w-96 bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.08)] border-2"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">Study Assistant</h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Online</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-50 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-50 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-5 space-y-4 bg-[#FCFAF8]">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                        ? "bg-slate-900 text-white rounded-br-none"
                        : "bg-white border border-gray-100 text-slate-600 rounded-bl-none"
                      }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-1 px-4 h-10 bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-300 rounded-xl text-sm transition-all"
                />
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors active:scale-[0.98]"
                  onClick={handleSend}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      {/* </AnimatePresence> */}
    </>
  )
}
