"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import ChatWindow from "./ChatWindow";
import Chatbot from "./Chatbot";


const DropdownLike = () => {
  const [selectedComponent, setSelectedComponent] = useState<"ai" | "bot" | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition">
          <Bot className="w-6 h-6" />
        </button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="w-72 rounded-lg shadow-lg bg-white dark:bg-gray-900 dark:text-white p-4">
        <div className="flex flex-col gap-3">
          <button
            className="px-4 py-2 text-left text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            onClick={() => setSelectedComponent("ai")}
          >
            🧠 Chat with AI
          </button>

          <button
            className="px-4 py-2 text-left text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            onClick={() => setSelectedComponent("bot")}
          >
            🤖 Chat with Bot
          </button>

          <DialogClose asChild>
            <button className="mt-2 px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              ❌ Close
            </button>
          </DialogClose>
        </div>
      </DialogContent>

      {/* Selected Component Render */}
      {selectedComponent === "ai" && <ChatWindow />}
      {selectedComponent === "bot" && <Chatbot />}
    </Dialog>
  );
};

export default DropdownLike;
