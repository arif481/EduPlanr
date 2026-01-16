/**
 * AI Tutor Page
 * GPT-powered chat interface for study assistance
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  SparklesIcon,
  AcademicCapIcon,
  BookOpenIcon,
  LightBulbIcon,
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  TrashIcon,
  ChevronDownIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { Card, Button, Badge, Avatar, Loading } from '@/components/ui';
import { cn, formatSmartDate } from '@/lib/utils';
import { sendTutorMessage } from '@/services/tutorApiClient';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  prompt: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'explain',
    label: 'Explain Concept',
    icon: LightBulbIcon,
    prompt: 'Explain the following concept in simple terms: ',
    color: 'from-neon-yellow to-neon-orange',
  },
  {
    id: 'quiz',
    label: 'Generate Quiz',
    icon: ClipboardDocumentListIcon,
    prompt: 'Create 5 practice questions about: ',
    color: 'from-neon-cyan to-neon-blue',
  },
  {
    id: 'summarize',
    label: 'Summarize Notes',
    icon: DocumentTextIcon,
    prompt: 'Please summarize the following notes in bullet points: ',
    color: 'from-neon-green to-neon-cyan',
  },
  {
    id: 'flashcards',
    label: 'Create Flashcards',
    icon: BookOpenIcon,
    prompt: 'Create 5 flashcards (question and answer pairs) for: ',
    color: 'from-neon-purple to-neon-pink',
  },
];

// Mock conversation history
const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: `# Welcome to EduPlanr AI Tutor! 🎓

I'm your personal AI study assistant. I can help you with:

- **Explaining concepts** in simple terms
- **Generating practice questions** and quizzes
- **Summarizing notes** and study materials
- **Creating flashcards** for memorization
- **Answering questions** about any subject

What would you like to learn about today?`,
    timestamp: new Date(),
  },
];

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle send message
  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setSelectedAction(null);
    setIsLoading(true);

    try {
      // Call Firebase Function for real AI response
      const aiResponse = await sendTutorMessage(
        messages.map((m) => ({ ...m, timestamp: m.timestamp })),
        messageContent
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Tutor error:', error);
      // Fallback to mock response if API fails
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(messageContent),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock AI response
  const generateMockResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('quiz') || lowerMessage.includes('question')) {
      return `## Practice Questions 📝

Here are some practice questions based on your topic:

1. **Question 1**: What is the fundamental principle behind this concept?
   - A) Option A
   - B) Option B
   - C) Option C
   - D) Option D

2. **Question 2**: How would you apply this concept in a real-world scenario?

3. **Question 3**: What are the key differences between related concepts?

4. **Question 4**: Explain the step-by-step process involved.

5. **Question 5**: What are common mistakes to avoid?

---
*Need hints or want to check your answers? Just ask!*`;
    }

    if (lowerMessage.includes('flashcard')) {
      return `## Flashcards Created! 🎴

| Front | Back |
|-------|------|
| What is the main concept? | A brief explanation of the core idea |
| Key formula or equation? | The mathematical representation |
| Real-world application? | How this is used in practice |
| Common mistake? | What to watch out for |
| Related concept? | How it connects to other topics |

---
*Would you like me to create more flashcards or focus on a specific area?*`;
    }

    if (lowerMessage.includes('summarize') || lowerMessage.includes('summary')) {
      return `## Summary 📋

Here's a concise summary of the key points:

### Main Ideas
- **Point 1**: Core concept explanation
- **Point 2**: Important details to remember
- **Point 3**: Practical applications

### Key Takeaways
1. First major insight
2. Second major insight
3. Third major insight

### Next Steps
- Review related materials
- Practice with examples
- Test your understanding

---
*Want me to expand on any of these points?*`;
    }

    if (lowerMessage.includes('explain')) {
      return `## Explanation 💡

Let me break this down for you:

### What is it?
This concept refers to a fundamental principle in the subject area. Think of it like building blocks - each piece connects to form a larger understanding.

### How does it work?
1. **Step 1**: The initial process begins with...
2. **Step 2**: This leads to...
3. **Step 3**: Finally, the result is...

### Why is it important?
Understanding this concept helps you:
- Solve related problems more efficiently
- Connect ideas across different topics
- Build a strong foundation for advanced topics

### Example
Imagine you're trying to... [concrete example with relatable scenario]

---
*Does this explanation help? Feel free to ask follow-up questions!*`;
    }

    // Default response
    return `## Great question! 🤔

Based on what you've asked, here's what I can tell you:

This is an interesting topic with several important aspects to consider:

1. **Understanding the basics**: Start with the fundamental concepts
2. **Building connections**: See how this relates to what you already know
3. **Practical application**: Look for real-world examples

### Here's a helpful tip:
When studying this topic, try to create your own examples. This helps reinforce your understanding and makes the material more memorable.

### Want to go deeper?
- I can generate practice questions to test your knowledge
- I can create flashcards for quick revision
- I can explain specific aspects in more detail

*Just let me know what would be most helpful!*`;
  };

  // Handle quick action
  const handleQuickAction = (action: QuickAction) => {
    setSelectedAction(action);
    setInputValue(action.prompt);
    inputRef.current?.focus();
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages(initialMessages);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-pink/20">
            <SparklesIcon className="w-6 h-6 text-neon-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-display">AI Tutor</h1>
            <p className="text-sm text-gray-400">Powered by GPT-4</p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          leftIcon={<TrashIcon className="w-4 h-4" />}
          onClick={clearConversation}
        >
          Clear Chat
        </Button>
      </motion.div>

      {/* Chat container */}
      <div className="flex-1 flex flex-col bg-dark-800/50 rounded-2xl border border-dark-600/50 overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {message.role === 'assistant' ? (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
                      <SparklesIcon className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <Avatar name="User" size="md" />
                  )}
                </div>

                {/* Message content */}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    message.role === 'assistant'
                      ? 'bg-dark-700/50 border border-dark-600/50'
                      : 'bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan/30'
                  )}
                >
                  <div
                    className="prose prose-invert prose-sm max-w-none prose-neon"
                    dangerouslySetInnerHTML={{
                      __html: message.content
                        .replace(/\n/g, '<br>')
                        .replace(/#{3} (.*)/g, '<h3>$1</h3>')
                        .replace(/#{2} (.*)/g, '<h2>$1</h2>')
                        .replace(/#{1} (.*)/g, '<h1>$1</h1>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/- (.*)/g, '<li>$1</li>')
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formatSmartDate(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div className="bg-dark-700/50 border border-dark-600/50 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loading size="sm" />
                  <span className="text-gray-400">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions */}
        <div className="p-3 border-t border-dark-600/50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={() => handleQuickAction(action)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl whitespace-nowrap transition-all',
                    'bg-dark-700/50 hover:bg-dark-600/50 border border-dark-600/50',
                    selectedAction?.id === action.id && 'border-neon-cyan/50 bg-neon-cyan/10'
                  )}
                >
                  <div className={cn('p-1.5 rounded-lg bg-gradient-to-r', action.color)}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-300">{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-dark-600/50">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about your studies..."
                className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:border-neon-cyan/50 transition-all resize-none"
                rows={2}
                disabled={isLoading}
              />
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isLoading}
              className="self-end"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
