import React, { useState } from "react";
import { UserProfile } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Menu, X, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Mock conversation data
const CONVERSATIONS = [
  {
    id: "conv1",
    with: {
      id: "user2",
      name: "Priya Sharma",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    },
    lastMessage: "Hi there! Is your product still available?",
    timestamp: "10:30 AM",
    unread: true,
  },
  {
    id: "conv2",
    with: {
      id: "user3",
      name: "Rahul Verma",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    },
    lastMessage: "Thank you for your quick response!",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "conv3",
    with: {
      id: "user4",
      name: "Anjali Patel",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    },
    lastMessage: "Can we schedule a delivery for tomorrow?",
    timestamp: "Wed",
    unread: true,
  },
];

// Mock message data
const MESSAGES = [
  {
    id: "msg1",
    conversationId: "conv1",
    senderId: "user2",
    text: "Hi there! Is your product still available?",
    timestamp: "10:30 AM",
  },
  {
    id: "msg2",
    conversationId: "conv1",
    senderId: "user1", // Current user
    text: "Yes, it's still available. Are you interested in purchasing?",
    timestamp: "10:32 AM",
  },
  {
    id: "msg3",
    conversationId: "conv1",
    senderId: "user2",
    text: "Great! I'd like to know if you can deliver it by Friday?",
    timestamp: "10:35 AM",
  },
];

const Messages: React.FC = () => {
  const navigate = useNavigate();
  const [activeConversation, setActiveConversation] = useState<typeof CONVERSATIONS[0] | null>(null);
  const [messageText, setMessageText] = useState("");
  const [currentMessages, setCurrentMessages] = useState(MESSAGES);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true); // Start with menu open on mobile
  
  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return;
    
    const newMessage = {
      id: `msg${currentMessages.length + 1}`,
      conversationId: activeConversation.id,
      senderId: "user1",
      text: messageText,
      timestamp: "Just now",
    };
    
    setCurrentMessages([...currentMessages, newMessage]);
    setMessageText("");
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully."
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto section-padding">
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            {activeConversation && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => {
                  setActiveConversation(null);
                  setIsMobileMenuOpen(true);
                }}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
        </div>
        
        <div className="flex h-[calc(100vh-120px)] bg-white rounded-2xl shadow-sm overflow-hidden border border-gantry-gray/20">
          {/* Conversation List */}
          <div className={`
            fixed md:relative
            inset-0 z-50 md:z-auto
            w-full md:w-1/3
            bg-white md:bg-transparent
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
            <div className="p-4 border-b border-gantry-gray/20 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Input 
                placeholder="Search conversations..." 
                className="flex-1"
              />
            </div>
            
            <div className="overflow-y-auto h-[calc(100%-73px)]">
              {CONVERSATIONS.map((conversation) => (
                <div 
                  key={conversation.id}
                  className={`p-4 border-b border-gantry-gray/10 flex items-center cursor-pointer hover:bg-gantry-gray-light transition-colors ${
                    activeConversation?.id === conversation.id ? "bg-gantry-gray-light" : ""
                  }`}
                  onClick={() => {
                    setActiveConversation(conversation);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                    <img 
                      src={conversation.with.avatarUrl} 
                      alt={conversation.with.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{conversation.with.name}</p>
                      <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      {conversation.unread && (
                        <span className="w-2 h-2 bg-gantry-purple rounded-full"></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Message Area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 border-b border-gantry-gray/20 flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden mr-2"
                    onClick={() => setIsMobileMenuOpen(true)}
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={activeConversation.with.avatarUrl} 
                      alt={activeConversation.with.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{activeConversation.with.name}</p>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.senderId === "user1" ? "justify-end" : "justify-start"}`}
                    >
                      <div 
                        className={`max-w-[85%] md:max-w-[70%] px-4 py-2 rounded-2xl ${
                          message.senderId === "user1" 
                            ? "bg-gantry-purple text-white rounded-br-none" 
                            : "bg-gantry-gray-light text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === "user1" ? "text-gantry-purple-light" : "text-gray-500"
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-gantry-gray/20">
                  <div className="flex items-end">
                    <Textarea 
                      placeholder="Type a message..." 
                      className="flex-1 resize-none"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="ml-2 h-10" 
                      onClick={handleSendMessage}
                      variant="default"
                    >
                      <Send className="w-4 h-4" />
                      <span className="sr-only">Send</span>
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 text-center">
                <div>
                  <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
