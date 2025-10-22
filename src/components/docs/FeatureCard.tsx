import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--docs-accent))]/30 group">
      <div className="bg-gradient-to-br from-[hsl(var(--docs-accent))]/10 to-[hsl(var(--docs-accent))]/5 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
        <Icon className="h-6 w-6 text-[hsl(var(--docs-accent))]" />
      </div>
      <h3 className="text-[17px] font-bold mb-2.5 font-inter text-foreground group-hover:text-[hsl(var(--docs-accent))] transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-[1.7] text-[14px]">{description}</p>
    </div>
  );
};

export default FeatureCard;
