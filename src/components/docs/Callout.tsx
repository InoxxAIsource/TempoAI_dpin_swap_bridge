import { AlertCircle, Info, Lightbulb, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type CalloutType = 'info' | 'tip' | 'warning' | 'danger';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
  className?: string;
}

const calloutConfig = {
  info: {
    icon: Info,
    className: 'border-l-[hsl(var(--docs-info))] bg-[hsl(var(--docs-info))]/5',
    iconClassName: 'text-[hsl(var(--docs-info))]',
  },
  tip: {
    icon: Lightbulb,
    className: 'border-l-[hsl(var(--docs-success))] bg-[hsl(var(--docs-success))]/5',
    iconClassName: 'text-[hsl(var(--docs-success))]',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-l-[hsl(var(--docs-warning))] bg-[hsl(var(--docs-warning))]/5',
    iconClassName: 'text-[hsl(var(--docs-warning))]',
  },
  danger: {
    icon: AlertCircle,
    className: 'border-l-[hsl(var(--docs-danger))] bg-[hsl(var(--docs-danger))]/5',
    iconClassName: 'text-[hsl(var(--docs-danger))]',
  },
};

const Callout = ({ type = 'info', title, children, className }: CalloutProps) => {
  const config = calloutConfig[type];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        'not-prose my-6 rounded-lg border-l-[3px] p-5 shadow-md',
        config.className,
        className
      )}
      role="alert"
    >
      <div className="flex gap-3.5">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', config.iconClassName)} />
        <div className="flex-1">
          {title && (
            <p className="font-bold mb-2 text-foreground text-[15px]">
              {title}
            </p>
          )}
          <div className="text-[14px] leading-[1.7] text-foreground/85">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Callout;
