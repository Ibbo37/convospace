"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatWindow() {
  const [messages, setMessages] = useState<{ id: number; role: string; text: string; time: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const timeStamp = new Date().toLocaleTimeString();
    const userMessage = { id: Date.now(), role: "user", text: input, time: timeStamp };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let botText = "";

      const botMessageId = Date.now();
      setMessages((prev) => [...prev, { id: botMessageId, role: "ai", text: "", time: timeStamp }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        botText += decoder.decode(value, { stream: true });

        try {
          const parsedData = JSON.parse(botText);
          botText = parsedData.reply || botText;
        } catch {}

        setMessages((prev) =>
          prev.map((msg) => (msg.id === botMessageId ? { ...msg, text: botText } : msg))
        );
      }
    } catch (error) {
      console.error("Chat API Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-16 left-4 w-96 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"} shadow-lg rounded-lg p-4 border border-gray-700`}>
      
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Chat with AI</h2>
        <div className="flex space-x-2">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="text-xl">{isDarkMode ? "🌞" : "🌙"}</button>
          <button onClick={() => setIsOpen(false)} className="text-xl">❌</button>
        </div>
      </div>

      {/* Chat Messages (Scrollable) */}
      <div ref={chatContainerRef} className="h-80 overflow-y-auto space-y-2 border p-2 rounded-lg">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.role === "user" ? "text-right" : "text-left"}>
            <p className="text-xs text-gray-500">{msg.role === "user" ? "User" : "AI"} • {msg.time}</p>
            <p className={`p-2 rounded-lg inline-block ${msg.role === "user" ? "bg-gray-800 text-white" : "bg-gray-700 text-white"}`}>
              {msg.text}
            </p>
          </div>
        ))}
        {isTyping && <p className="text-gray-500 italic">AI is typing...</p>}
      </div>

      {/* Input Box */}
      <div className="mt-2 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`flex-1 p-2 border rounded-lg bg-white text-black`}
          placeholder="Ask something..."
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded-lg">Send</button>
      </div>
    </div>
  );
}
