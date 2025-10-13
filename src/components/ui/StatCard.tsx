import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const StatCard = ({ icon: Icon, label, value, change, changeType = 'neutral' }: StatCardProps) => {
  return (
    <div className="border border-border rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 bg-card transition-all duration-300 hover:border-primary/50">
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        </div>
        <span className="text-xs md:text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">{value}</div>
      {change && (
        <div className={`text-sm ${
          changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
          changeType === 'negative' ? 'text-red-600 dark:text-red-400' :
          'text-muted-foreground'
        }`}>
          {change}
        </div>
      )}
    </div>
  );
};

export default StatCard;
