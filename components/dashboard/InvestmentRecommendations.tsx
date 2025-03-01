import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface InvestmentOption {
  id: string;
  name: string;
  type: 'stock' | 'crypto' | 'realestate' | 'bonds' | 'etf';
  potentialReturn: string;
  riskLevel: 'low' | 'medium' | 'high';
  description: string;
  trend: 'up' | 'down' | 'stable';
}

export const InvestmentRecommendations = () => {
  const [options, setOptions] = useState<InvestmentOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call to get investment recommendations
    // based on AI analysis of market conditions and user financial profile
    const fetchRecommendations = () => {
      setIsLoading(true);

      // Simulating API call delay
      setTimeout(() => {
        const recommendedInvestments: InvestmentOption[] = [
          {
            id: '1',
            name: 'Tech ETF Portfolio',
            type: 'etf',
            potentialReturn: '8-12%',
            riskLevel: 'medium',
            description: 'Diversified tech sector ETF with exposure to major technology companies.',
            trend: 'up',
          },
          {
            id: '2',
            name: 'Bitcoin (BTC)',
            type: 'crypto',
            potentialReturn: '15-25%',
            riskLevel: 'high',
            description: 'Leading cryptocurrency with increasing institutional adoption.',
            trend: 'up',
          },
          {
            id: '3',
            name: 'Real Estate Investment Trust',
            type: 'realestate',
            potentialReturn: '6-9%',
            riskLevel: 'medium',
            description: 'Commercial real estate properties with steady income from rent.',
            trend: 'stable',
          },
          {
            id: '4',
            name: 'Treasury Bonds',
            type: 'bonds',
            potentialReturn: '3-5%',
            riskLevel: 'low',
            description: 'Government-backed bonds with reliable returns and minimal risk.',
            trend: 'stable',
          },
        ];

        setOptions(recommendedInvestments);
        setIsLoading(false);
      }, 1500);
    };

    fetchRecommendations();
  }, []);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-950 text-green-400 border-green-800';
      case 'medium':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'high':
        return 'bg-red-950 text-red-400 border-red-800';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="glass-card rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-950 flex items-center justify-center">
            <TrendingUp size={18} className="text-indigo-400" />
          </div>
          <h3 className="text-lg font-medium">AI Investment Recommendations</h3>
        </div>
        <Link href="/investments">
          <Button variant="ghost" size="sm" className="text-xs gap-1">
            View All
            <ArrowRight size={14} />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[90px] rounded-lg bg-slate-800/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {options.map((option) => (
            <div
              key={option.id}
              className="glass-panel rounded-lg p-4 transition-all duration-200 hover:translate-x-1 hover:bg-slate-800/60"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{option.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-xs px-2 py-0.5 border rounded-full ${getRiskBadgeColor(
                        option.riskLevel
                      )}`}
                    >
                      {option.riskLevel.charAt(0).toUpperCase() + option.riskLevel.slice(1)} Risk
                    </span>
                    <span className="text-xs text-slate-400">
                      Return: <span className="text-white">{option.potentialReturn}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{option.description}</p>
                </div>
                <div className={`text-sm font-medium ${getTrendColor(option.trend)}`}>
                  {option.trend === 'up' && '↑'}
                  {option.trend === 'down' && '↓'}
                  {option.trend === 'stable' && '→'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
