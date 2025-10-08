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
    <div className="border border-border rounded-2xl p-6 md:p-8 bg-card transition-all duration-300 hover:border-primary/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-3xl md:text-4xl font-bold mb-2">{value}</div>
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
