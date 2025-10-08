interface ChainBadgeProps {
  chain: string;
  className?: string;
}

const ChainBadge = ({ chain, className = '' }: ChainBadgeProps) => {
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-border bg-card ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      {chain}
    </span>
  );
};

export default ChainBadge;
