"use client";

import { useState, useEffect, useRef } from "react";
import { Send, X, Moon, Sun } from "lucide-react";
import { generateBotResponse } from "./generateBotResponse"; // Import response function

const Chatbot = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // State to toggle chatbot visibility
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);

    // Generate bot response
    const botMessage = generateBotResponse(input);
    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInput(""); 
  };

  // Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  // If chatbot is closed, don't render it
  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-[120px] left-4 w-96 ${darkMode ? "bg-black text-white" : "bg-white text-black"} shadow-lg rounded-lg p-4 border border-gray-700`}>

      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">🤖 ConvoSpace Chatbot</h2>
        <div className="flex gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
          </button>
          {/* Close Button */}
          <button 
            onClick={() => setIsOpen(false)} // Close the chatbot
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <X className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="h-64 overflow-y-auto p-2 rounded-md bg-gray-100 dark:bg-gray-800 flex flex-col space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 max-w-[80%] rounded-md ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-300 text-black self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="mt-2 flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter command (e.g., /create-server)"
          className="flex-1 p-2 border rounded-l-md focus:outline-none dark:text-white"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
