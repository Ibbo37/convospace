"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import { useSocket } from "@/components/providers/socket-provider";
import { useTheme } from "next-themes";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  const { theme } = useTheme();
  const iconColor = theme === "light" ? "text-black" : "text-white";

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "What is ConvoSpace?",
      answer:
        "ConvoSpace is a voice, video, and text communication platform for communities.",
    },
    {
      question: "How do I join a server?",
      answer:
        "You can join a server using an invite link shared by the server admin.",
    },
    {
      question: "What are roles and permissions?",
      answer:
        "Roles define what actions users can perform in a server, such as managing channels.",
    },
    {
      question: "How can I create and manage channels in ConvoSpace?",
      answer:
        "Only admins can create channels in ConvoSpace. They can manage permissions, assign roles, and control user access.",
    },
    {
      question: "Is ConvoSpace available on mobile devices?",
      answer:
        "Currently, ConvoSpace is accessible via web browsers, and a mobile-friendly version is planned for future releases.",
    },
    {
      question: "How does ConvoSpace handle security and privacy?",
      answer:
        "ConvoSpace prioritizes user security with encrypted messages, role-based access control, and customizable privacy settings.",
    },
    {
      question: "Can I share files and media in ConvoSpace?",
      answer:
        "Yes, users can share images, videos, and documents within text channels, making collaboration easier.",
    },
    {
      question: "How are roles and permissions managed in ConvoSpace?",
      answer:
        "Admins can assign roles with different permissions, such as managing channels, moderating content, or accessing exclusive features.",
    },
    {
      question: "Does ConvoSpace support real-time notifications?",
      answer:
        "Yes, users receive instant notifications for messages, mentions, and important updates within their channels.",
    },
    {
      question: "Is ConvoSpace free to use?",
      answer:
        "ConvoSpace offers free access with essential features. Advanced features may be available through premium plans in the future.",
    },
];


  return (
    <div className="relative flex items-center space-x-4 p-4 bg-transparent text-white rounded-lg">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={`bg-transparent p-2 hover:text-gray-300 ${iconColor}`}
          >
            <HelpCircle size={24} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md bg-[#2b2d31] text-white shadow-xl rounded-lg p-6 mx-auto border border-gray-700">
          <h2 className="text-lg font-bold mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <ul className="space-y-3 text-sm">
            {faqData.map((faq, index) => (
              <li
                key={index}
                className="border-b border-gray-600 py-2 cursor-pointer hover:bg-[#3a3d42] px-3 rounded-md transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <strong>Q:</strong> {faq.question}
                {openIndex === index && (
                  <p className="mt-2 text-gray-300">
                    <strong>A:</strong> {faq.answer}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>

      <Badge
        variant="outline"
        className="border-none text-white bg-emerald-600"
      >
        Live: Real-time updates
      </Badge>
    </div>
  );
};
