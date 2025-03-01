import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const suggestedQuestions = [
  'How can I save more money this month?',
  'Where am I spending too much?',
  'What investment options should I consider?',
  'How to reduce my credit card debt?',
];

export const AIAssistantPreview = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [typingText, setTypingText] = useState('');
  const textToType =
    'Ask me anything about your finances. I can help with spending analysis, investment suggestions, or saving tips based on your financial data.';

  useEffect(() => {
    setIsVisible(true);

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < textToType.length) {
        setTypingText(textToType.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 20);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div
      className={`glass-card rounded-xl p-5 h-full transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-finance-accent/20 flex items-center justify-center">
          <MessageSquare size={18} className="text-finance-accent" />
        </div>
        <h3 className="text-lg font-medium">AI Financial Assistant</h3>
      </div>

      <div className="glass-panel rounded-lg p-4 mb-4 h-[100px] flex items-center">
        <p className="text-gray-300">
          {typingText}
          <span className="animate-pulse">|</span>
        </p>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-400">Suggested questions:</p>
        <div className="grid grid-cols-2 gap-2">
          {suggestedQuestions.map((question, index) => (
            <Link
              href="/assistant"
              key={index}
              className="text-xs bg-gray-800/50 hover:bg-gray-800 text-gray-300 py-2 px-3 rounded-md truncate transition-colors"
            >
              {question}
            </Link>
          ))}
        </div>
      </div>

      <Link href="/assistant">
        <Button className="w-full bg-finance-accent hover:bg-finance-accent-hover">
          Chat with AI Assistant
        </Button>
      </Link>
    </div>
  );
};
