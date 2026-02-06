import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Assalam o Alaikum! I'm your AI assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv-1",
      title: "Welcome Chat",
      lastMessage: "Assalam o Alaikum! I'm your AI assistant...",
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: "conv-2",
      title: "Task Management Tips",
      lastMessage: "Here are some tips for organizing tasks...",
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: "conv-3",
      title: "Daily Planning",
      lastMessage: "To plan your day effectively...",
      timestamp: new Date(Date.now() - 172800000),
    },
  ]);
  const [selectedConversation, setSelectedConversation] = useState("conv-1");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response after delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const getAIResponse = (input: string) => {
    // Simple response logic - in a real app this would connect to an AI service
    if (input.toLowerCase().includes("task") || input.toLowerCase().includes("todo")) {
      return "Main tumhari tasks ko manage karne mein madad kar sakta hun! Tum koi specific task ke barein mein pochna chahte ho?";
    } else if (input.toLowerCase().includes("assalam") || input.toLowerCase().includes("hello") || input.toLowerCase().includes("hi")) {
      return "Walaikum Assalam! Aaj main tumhari kis tarhan madad kar sakta hun?";
    } else if (input.toLowerCase().includes("madad") || input.toLowerCase().includes("help")) {
      return "Main yahan tumhari madad ke liye hun! Tum mujhse tasks manage karne, productivity tips pane ya koi bhi kaam se related sawal kar saktay ho.";
    } else {
      return "Tumhare message ke liye shukriya! Main tumhari tasks aur productivity mein madad karne ke liye yahan hun. Main tumhari aur kis tarhan madad kar sakta hun?";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Conversation History Panel */}
      <div className="hidden md:flex md:w-64 lg:w-80 flex-col border-r border-slate-700 bg-slate-800/30 backdrop-blur-xl">
        <div className="p-4 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-slate-700/30 cursor-pointer transition-all duration-200 ${
                selectedConversation === conversation.id
                  ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-l-4 border-l-cyan-500"
                  : "hover:bg-slate-700/40"
              }`}
              onClick={() => setSelectedConversation(conversation.id)}
            >
              <h3 className="font-medium truncate text-slate-200">{conversation.title}</h3>
              <p className="text-sm text-slate-400 truncate">
                {conversation.lastMessage}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {conversation.timestamp.toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-slate-700/50">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20"
            onClick={() => {
              const newConv: Conversation = {
                id: `conv-${Date.now()}`,
                title: "New Conversation",
                lastMessage: "Started new conversation",
                timestamp: new Date(),
              };
              setConversations([newConv, ...conversations]);
              setSelectedConversation(newConv.id);
            }}
          >
            New Chat
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-700/50 flex items-center gap-3 md:hidden bg-slate-800/20 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => document.querySelector('.mobile-chat-sidebar')?.classList.toggle('hidden')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </Button>
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AI Assistant</h2>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/20">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "ai" && (
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-sm ${
                  message.sender === "user"
                    ? "bg-gradient-to-r from-blue-600/80 to-cyan-600/80 text-white rounded-br-md shadow-lg shadow-blue-500/20"
                    : "bg-slate-800/70 text-slate-100 rounded-bl-md border border-slate-700/50 shadow-sm"
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    message.sender === "user" ? "text-blue-100/80" : "text-slate-400"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
              {message.sender === "user" && (
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-500/30">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="bg-slate-800/70 text-slate-100 rounded-2xl rounded-bl-md px-4 py-3 border border-slate-700/50 backdrop-blur-sm shadow-sm">
                <div className="flex space-x-2 py-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-75"></div>
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur-xl">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message in Roman Urdu or English (e.g., Assalam o Alaikum)..."
              className="flex-1 bg-slate-800/60 border-slate-700/50 text-white placeholder:text-slate-400 backdrop-blur-sm focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 shadow-lg shadow-blue-500/20"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            Tip: Type in Roman Urdu (e.g., "Assalam o Alaikum", "Kaisy ho?", "Madad chahiye") or English
          </p>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 hidden mobile-chat-sidebar" onClick={() => document.querySelector('.mobile-chat-sidebar')?.classList.add('hidden')}></div>
    </div>
  );
}