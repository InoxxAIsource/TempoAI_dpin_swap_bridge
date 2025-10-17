import { Button } from '@/components/ui/button';

interface QuickFillButtonsProps {
  balance: string;
  onAmountSelect: (amount: string) => void;
  disabled?: boolean;
}

export const QuickFillButtons = ({ balance, onAmountSelect, disabled }: QuickFillButtonsProps) => {
  const handlePercentage = (percentage: number) => {
    const numBalance = parseFloat(balance) || 0;
    if (numBalance === 0) return;
    
    const amount = (numBalance * percentage).toFixed(6);
    onAmountSelect(amount);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-7 rounded-lg flex-1"
        onClick={() => handlePercentage(0.25)}
        disabled={disabled}
      >
        25%
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-7 rounded-lg flex-1"
        onClick={() => handlePercentage(0.5)}
        disabled={disabled}
      >
        50%
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-7 rounded-lg flex-1"
        onClick={() => handlePercentage(1.0)}
        disabled={disabled}
      >
        Max
      </Button>
    </div>
  );
};
