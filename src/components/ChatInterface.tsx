'use client';

import { useState, useRef, useEffect } from 'react';
import { User } from '@/types/user';
import { Message } from '@/types/chat';
import { Send, X, Bot } from 'lucide-react';
import { generateAIResponse } from '@/utils/aiChat';

interface ChatInterfaceProps {
  user: User;
  onClose: () => void;
}

export default function ChatInterface({ user, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi! I'm ${user.name}'s AI assistant on RideCircle. ${user.name} commutes from ${user.from} to ${user.to} and is interested in ${user.interests.slice(0, 2).join(' and ')}. How can I help you connect today?`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(input, user, messages);
      if (aiResponse && aiResponse.trim()) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error('Empty response from AI');
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I apologize, but I'm having trouble processing your request right now. ${user.name} commutes from ${user.from} to ${user.to} at ${user.commuteTime}. Would you like to try asking again?`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 h-[600px] bg-white border border-gray-200 rounded-t-xl shadow-2xl flex flex-col z-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff&size=128&bold=true`}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white font-bold text-xs">${user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</div>`;
                  }
                }}
              />
          </div>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-xs text-blue-100">AI Assistant</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-blue-800 rounded-full p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            {message.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-gray-600">You</span>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 bg-white placeholder:text-gray-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
