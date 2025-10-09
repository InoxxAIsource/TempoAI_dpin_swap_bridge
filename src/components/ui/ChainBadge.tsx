interface ChainBadgeProps {
  chain: string;
  className?: string;
}

const chainLogos: Record<string, string> = {
  'Ethereum': 'Ξ',
  'Polygon': '⬡',
  'Arbitrum': '◆',
  'Avalanche': '▲',
  'Solana': '◎',
  'Optimism': 'Ⓞ',
  'BNB Chain': '◈',
  'Base': '⬢',
  'Fantom': 'Ⓕ',
  'Celo': '⬢',
  'Moonbeam': '◐',
  'Aurora': '⬢',
};

const chainColors: Record<string, string> = {
  'Ethereum': 'text-[#627EEA]',
  'Polygon': 'text-[#8247E5]',
  'Arbitrum': 'text-[#28A0F0]',
  'Avalanche': 'text-[#E84142]',
  'Solana': 'text-[#14F195]',
  'Optimism': 'text-[#FF0420]',
  'BNB Chain': 'text-[#F3BA2F]',
  'Base': 'text-[#0052FF]',
  'Fantom': 'text-[#1969FF]',
  'Celo': 'text-[#FCFF52]',
  'Moonbeam': 'text-[#53CBC9]',
  'Aurora': 'text-[#70D44B]',
};

const ChainBadge = ({ chain, className = '' }: ChainBadgeProps) => {
  const logo = chainLogos[chain] || '○';
  const color = chainColors[chain] || 'text-primary';
  
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border border-border bg-card/80 backdrop-blur-sm ${className}`}>
      <span className={`text-xl font-bold ${color} flex-shrink-0`}>{logo}</span>
      <span className="whitespace-nowrap">{chain}</span>
    </span>
  );
};

export default ChainBadge;
