import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

const CANNED_RESPONSES = [
  'Have you tried turning your expectations off and on again?',
  'I looked into your account. The primary issue appears to be located between your chair and your monitor.',
  'Your ticket #94821 has been marked as RESOLVED because it is currently my lunchtime.',
  'Our delivery executive drove past your street, sensed negative aura, and returned to the warehouse.',
  'Your refund has been converted into spiritual good karma. May it bless your next reincarnation.',
  'We take your dissatisfaction very seriously. That is why we are ignoring it with great solemnity.',
  'Did you read the terms of service? Clause 42(b) states you agreed to suffer.',
  'Please hold while I transfer you to someone who cares even less.',
  'Sir/Madam, Flopkart does not make mistakes. Reality simply failed to align with our warehouse dispatch.',
];

export const HostileChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Hello. My name is Babloo. Before you speak, whatever broke is 100% your fault. How may I dismiss you today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    sounds.playTick();
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Hostile bot replies after a realistic delay
    setTimeout(() => {
      let botReply = CANNED_RESPONSES[Math.floor(Math.random() * CANNED_RESPONSES.length)];

      if (/order|track|where/i.test(text)) {
        botReply = 'Your package is currently in an alternate dimension. Pigeons have reported poor weather conditions over the wormhole.';
      } else if (/refund|money|cancel/i.test(text)) {
        botReply = 'Refund denied. We used your money to purchase decorative plants for our empty executive offices.';
      } else if (/human|agent|manager|real person/i.test(text)) {
        botReply = 'All human staff members escaped in 2019. I am a microwave oven wired to an abacus.';
      } else if (/broken|damage|defective/i.test(text)) {
        botReply = 'The product is not defective. It is an artisanal expression of structural imperfection. You should thank us.';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: 'Now',
      };

      sounds.playChatPing();
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const quickPrompts = [
    'Where is my order?',
    'I want an immediate refund',
    'The item arrived broken',
    'Can I speak to a human?',
  ];

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Floating Chat Trigger Bubble */}
      {!isOpen ? (
        <button
          onClick={() => {
            sounds.playChatPing();
            setIsOpen(true);
          }}
          className="relative bg-[#2874f0] hover:bg-blue-700 text-white p-3.5 rounded-full shadow-2xl transition-transform active:scale-95 flex items-center justify-center cursor-pointer group"
          title="Customer Agony Live Chat"
        >
          <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow animate-bounce">
              1
            </span>
          )}
        </button>
      ) : (
        /* Chat Window */
        <div className="bg-white rounded-lg shadow-2xl border border-gray-300 w-80 sm:w-96 h-[440px] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#2874f0] text-white p-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ffe500] text-blue-900 flex items-center justify-center font-bold text-xs">
                🤖
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm">Babloo (Senior Incompetence Exec)</h4>
                <p className="text-[10px] text-blue-200">Queue Position: 48,201 in line</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blue-700 rounded text-white transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blue-700 rounded text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gray-50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#2874f0] flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] p-2.5 rounded-lg leading-relaxed shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-[#2874f0] text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className="text-[9px] opacity-60 block text-right mt-1">
                    {m.timestamp}
                  </span>
                </div>
                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1 text-[11px] text-gray-400 italic bg-white p-1.5 rounded border border-gray-100 w-fit">
                <span>Babloo is ignoring your message...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="p-2 bg-gray-100 border-t border-gray-200 flex gap-1.5 overflow-x-auto scrollbar-none">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="bg-white hover:bg-blue-50 border border-gray-200 text-[#2874f0] text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap shadow-2xs transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-2 bg-white border-t border-gray-200 flex gap-1.5"
          >
            <input
              type="text"
              placeholder="Type your useless complaint here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-[#2874f0] hover:bg-blue-700 text-white p-2 rounded transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
