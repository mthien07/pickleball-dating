import { useState } from "react";
import { MessageCircle, Send, ArrowLeft } from "lucide-react";

interface Match {
  id: number;
  name: string;
  image: string;
  lastMessage: string;
  timestamp: string;
  unread?: boolean;
}

interface Message {
  id: number;
  text: string;
  sent: boolean;
  timestamp: string;
}

interface MessagesViewProps {
  onBack: () => void;
}

const mockMatches: Match[] = [
  {
    id: 1,
    name: "Sarah",
    image: "https://images.unsplash.com/photo-1594318223885-20dc4b889f9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc21pbGV8ZW58MXx8fHwxNzY3Mzc5NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lastMessage: "Hey! How are you?",
    timestamp: "2m ago",
    unread: true,
  },
  {
    id: 2,
    name: "Michael",
    image: "https://images.unsplash.com/photo-1609228579945-4067c8186939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMGNvbmZpZGVudHxlbnwxfHx8fDE3Njc0MDczMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lastMessage: "That sounds great!",
    timestamp: "1h ago",
  },
  {
    id: 3,
    name: "Emily",
    image: "https://images.unsplash.com/photo-1650322981555-28ae2cea48a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMG91dGRvb3IlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzY3NDM3MTE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    lastMessage: "See you tomorrow!",
    timestamp: "3h ago",
  },
];

export function MessagesView({ onBack }: MessagesViewProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hey! How are you?", sent: false, timestamp: "10:30 AM" },
    { id: 2, text: "Hi! I'm doing great, thanks! How about you?", sent: true, timestamp: "10:32 AM" },
    { id: 3, text: "Pretty good! I saw you like hiking too", sent: false, timestamp: "10:33 AM" },
  ]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const newMessage: Message = {
      id: messages.length + 1,
      text: messageText,
      sent: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newMessage]);
    setMessageText("");
  };

  if (selectedMatch) {
    return (
      <div className="flex flex-col h-full bg-[#1a1a1a]">
        {/* Chat header */}
        <div className="flex items-center gap-4 p-4 border-b border-white/10 bg-[#1a1a1a]">
          <button
            onClick={() => setSelectedMatch(null)}
            className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <img
            src={selectedMatch.image}
            alt={selectedMatch.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
          />
          <div className="flex-1">
            <h2 className="text-white">{selectedMatch.name}</h2>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm text-gray-400">Active now</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sent ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                  message.sent
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-white"
                    : "bg-white/5 text-white border border-white/10"
                }`}
              >
                <p>{message.text}</p>
                <p className={`text-xs mt-1 ${message.sent ? "text-white/70" : "text-gray-500"}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-white/10 bg-[#1a1a1a]">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-full outline-none focus:ring-2 focus:ring-red-500 text-white placeholder:text-gray-500"
            />
            <button
              onClick={handleSendMessage}
              className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full flex items-center justify-center hover:from-red-600 hover:to-orange-600 transition-colors shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1a1a1a]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#1a1a1a]">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-xl text-white">Messages</h1>
        <div className="w-10" />
      </div>

      {/* Matches list */}
      <div className="flex-1 overflow-y-auto">
        {mockMatches.map((match) => (
          <button
            key={match.id}
            onClick={() => setSelectedMatch(match)}
            className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/10"
          >
            <div className="relative">
              <img
                src={match.image}
                alt={match.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
              />
              {match.unread && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full border-2 border-[#1a1a1a]" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h3 className={match.unread ? "text-white" : "text-gray-400"}>{match.name}</h3>
              <p className={`text-sm ${match.unread ? "text-gray-300" : "text-gray-500"}`}>
                {match.lastMessage}
              </p>
            </div>
            <span className="text-sm text-gray-500">{match.timestamp}</span>
          </button>
        ))}
      </div>
    </div>
  );
}