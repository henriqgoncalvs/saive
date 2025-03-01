'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const suggestedQuestions = [
  'How can I save more money this month?',
  'Where am I spending too much?',
  'What investment options should I consider?',
  'How to reduce my credit card debt?',
  'Can you analyze my spending patterns?',
  "What's my financial health score?",
  'How much should I save for retirement?',
  'Should I pay off debt or invest?',
];

const initialMessages: Message[] = [
  {
    id: 1,
    content:
      "Hello! I'm your AI financial assistant. I have access to your financial data and I'm here to help you make smarter decisions with your money. What would you like to know?",
    sender: 'ai',
    timestamp: new Date(),
  },
];

function AIAssistantContent() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(() => {
      const aiResponses: { [key: string]: string } = {
        'How can I save more money this month?':
          'Based on your spending data, I see several opportunities to save money this month:\n\n1. Your subscription services cost $87 monthly. Consider reviewing and canceling unused ones.\n\n2. You spent $420 on dining out last month, which is 30% higher than your average. Try cooking at home more.\n\n3. Your utility bills seem high - you might save $40-60 monthly by adjusting your thermostat by 2-3 degrees.\n\nImplementing these changes could save you approximately $150-200 this month.',
        'Where am I spending too much?':
          "Looking at your spending patterns, a few categories stand out:\n\n1. Entertainment: You're spending 22% more than your budgeted amount\n\n2. Food delivery: This has increased 35% over the last three months\n\n3. Subscription services: You have 12 active subscriptions totaling $114/month\n\nI recommend setting spending alerts for these categories and reviewing your subscriptions to identify ones you rarely use.",
        'What investment options should I consider?':
          "Based on your financial profile (age: 34, risk tolerance: moderate, income: $85K), here are some investment options to consider:\n\n1. Increase your 401(k) contributions to at least get your employer's full match (currently at 4%, employer offers 6%)\n\n2. Consider a Roth IRA for tax diversification\n\n3. For your medium-term goals (5-10 years), a mix of index funds with 70% stocks/30% bonds aligns with your risk profile\n\nWould you like me to explain any of these options in more detail?",
        'How to reduce my credit card debt?':
          "You currently have $4,850 in credit card debt across 3 cards, with interest rates ranging from 16.99% to 24.99%. Here's a plan to reduce it:\n\n1. Focus on paying off the highest interest card first (Card #2 at 24.99%)\n\n2. Based on your cash flow, you could allocate an extra $300/month toward debt repayment\n\n3. Consider a balance transfer to a 0% APR card - this could save you approximately $450 in interest\n\nFollowing this plan, you could be debt-free in approximately 14 months instead of 26+ months.",
      };

      // Get specific response or default
      const responseContent =
        aiResponses[userMessage.content] ||
        "Based on your financial data, I can see that you've been managing your money fairly well. Your income is stable and your expenses are generally within reasonable limits. However, I notice a few areas where you might be able to optimize your finances.\n\nYour monthly subscriptions total to about $120, which is a bit high. You might want to review these and cancel any services you don't use regularly. Additionally, your dining out expenses have been increasing over the past few months, and now represent about 15% of your monthly spending.\n\nIn terms of savings, you're doing well with your emergency fund, but your retirement contributions could be increased. Given your age and income level, I'd recommend trying to contribute at least 15% of your income to retirement accounts.\n\nWould you like me to provide more specific recommendations for any of these areas?";

      const aiMessage: Message = {
        id: messages.length + 2,
        content: responseContent,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gradient">AI Financial Assistant</h1>
      </div>

      <div className="flex flex-col flex-1 glass-card rounded-xl p-5 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'mb-4 max-w-[90%] slide-up',
                message.sender === 'user' ? 'ml-auto' : 'mr-auto'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1',
                    message.sender === 'user'
                      ? 'bg-finance-accent text-white'
                      : 'bg-gray-800 text-white'
                  )}
                >
                  {message.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div>
                  <div
                    className={cn(
                      'rounded-lg p-4',
                      message.sender === 'user'
                        ? 'bg-finance-accent text-white'
                        : 'glass-panel text-white'
                    )}
                  >
                    {formatMessage(message.content)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 ml-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="mb-4 max-w-[80%]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0 mt-1">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="glass-panel rounded-lg p-4 text-white">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></div>
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4">
          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs bg-gray-800/70 hover:bg-gray-700 text-gray-300 py-1.5 px-3 rounded-full truncate transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something about your finances..."
              className="bg-gray-800/50 border-gray-700 focus:border-finance-accent pr-12 py-6"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 h-auto rounded-full bg-finance-accent hover:bg-finance-accent-hover"
            >
              <ArrowUp size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIAssistantPage() {
  return <AIAssistantContent />;
}
