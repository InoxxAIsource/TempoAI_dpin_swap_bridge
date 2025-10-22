import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      <div className="bg-[hsl(var(--docs-accent))]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-[hsl(var(--docs-accent))]" />
      </div>
      <h3 className="text-lg font-semibold mb-2 font-inter">{title}</h3>
      <p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;
