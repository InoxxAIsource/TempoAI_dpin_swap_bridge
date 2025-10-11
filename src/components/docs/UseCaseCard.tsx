import { Check } from 'lucide-react';

interface UseCaseCardProps {
  title: string;
  userQuery: string;
  steps: string[];
  result: string;
}

const UseCaseCard = ({ title, userQuery, steps, result }: UseCaseCardProps) => {
  return (
    <div className="p-6 rounded-xl border border-border bg-card/50 mb-6">
      <h4 className="text-xl font-semibold mb-4">{title}</h4>
      
      <div className="mb-4 p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm font-mono text-muted-foreground mb-1">User:</p>
        <p className="text-foreground">"{userQuery}"</p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-semibold text-muted-foreground mb-3">AI Response:</p>
        <ul className="space-y-2">
          {steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-0.5">├─</span>
              <span className="text-muted-foreground">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-start gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
        <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-green-400 mb-1">Result:</p>
          <p className="text-sm text-muted-foreground">{result}</p>
        </div>
      </div>
    </div>
  );
};

export default UseCaseCard;
