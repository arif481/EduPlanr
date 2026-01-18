/**
 * AI Smart Tutor Page
 * Interactive chat interface for study assistance
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  TrashIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';
import { Card, Button, Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store';
import { sendTutorMessage } from '@/services/tutorApiClient';
import { ChatMessage } from '@/types';
import toast from 'react-hot-toast';

// Mock response generator for fallback/demo mode
const generateMockResponse = (input: string): string => {
  const lowercaseInput = input.toLowerCase();

  if (lowercaseInput.includes('plan') || lowercaseInput.includes('schedule')) {
    return "I can help you create a study plan! Based on your subjects, I'd recommend creating dedicated time blocks for each. try to alternate between difficult and easier subjects to maintain focus. Would you like me to suggest a specific schedule?";
  }
  if (lowercaseInput.includes('math') || lowercaseInput.includes('calculus')) {
    return "Mathematics often requires practice. For Calculus, try breaking down the problem into smaller steps. Are you working on derivatives or integrals? I can provide some practice problems if you like.";
  }
  if (lowercaseInput.includes('tired') || lowercaseInput.includes('break')) {
    return "It sounds like you might need a break. The Pomodoro technique (25 min study, 5 min break) is great for maintaining energy. Why not take a short walk or stretch?";
  }
  if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
    return "Hello! I'm your Smart Tutor. I'm here to help you study more effectively. What subject are you working on today?";
  }

  return "That's an interesting point. Could you tell me more about what you're studying specifically? I can help explain concepts, summarize notes, or create flashcards for you.";
};

export default function TutorPage() {
  const { user, profile } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi ${profile?.displayName?.split(' ')[0] || 'there'}! I'm your AI Smart Tutor. I can help you understand complex topics, create study plans, or just keep you motivated. What are we studying today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Small artificial delay for better UX if response is too fast
      const [aiResponse] = await Promise.all([
        sendTutorMessage(messages, userMessage.content).catch(() => null), // Catch error to allow fallback
        new Promise(resolve => setTimeout(resolve, 600))
      ]);

      if (aiResponse) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
          },
        ]);
      } else {
        // Fallback to mock if API fails (e.g. no API key)
        console.warn('AI API failed, using fallback response');
        const mockResponse = generateMockResponse(userMessage.content);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: mockResponse,
            timestamp: new Date(),
          },
        ]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Clear conversation history?')) {
      setMessages([
        {
          id: 'welcome-new',
          role: 'assistant',
          content: 'Chat cleared. How can I help you now?',
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white font-display flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-neon-purple" />
            Smart Tutor
          </h1>
          <p className="text-gray-400 mt-1">Your personal AI study assistant</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClearChat} leftIcon={<TrashIcon className="w-4 h-4" />}>
          Clear Chat
        </Button>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden bg-dark-800/50 backdrop-blur-sm border-dark-600/50">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex gap-4 max-w-[85%]',
                  isUser ? 'ml-auto flex-row-reverse' : ''
                )}
              >
                <div className="flex-shrink-0">
                  {isUser ? (
                    <Avatar name={profile?.displayName || 'User'} size="sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-lg shadow-neon-purple/20">
                      <CpuChipIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    'p-4 rounded-2xl text-sm leading-relaxed shadow-lg',
                    isUser
                      ? 'bg-neon-purple text-white rounded-tr-none'
                      : 'bg-dark-700 text-gray-100 rounded-tl-none border border-dark-600'
                  )}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={cn("text-xs mt-2 opacity-50", isUser ? "text-purple-200" : "text-gray-500")}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-[85%]"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center shadow-lg shadow-neon-purple/20">
                  <CpuChipIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="bg-dark-700 p-4 rounded-2xl rounded-tl-none border border-dark-600 flex items-center gap-1">
                <div className="w-2 h-2 bg-neon-purple/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-neon-purple/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-neon-purple/50 rounded-full animate-bounce"></div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-dark-800 border-t border-dark-600">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-3 relative"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your studies..."
              className="flex-1 bg-dark-700/50 border border-dark-500/50 text-white rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/50 transition-all placeholder:text-gray-500"
              disabled={isTyping}
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-neon-purple/20"
            >
              {isTyping ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="w-5 h-5" />
              )}
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-2">
            AI can make mistakes. Consider checking important information.
          </p>
        </div>
      </Card>
    </div>
  );
}
