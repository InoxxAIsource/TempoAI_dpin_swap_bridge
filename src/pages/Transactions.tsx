import { useState } from 'react';
import { Search } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import PageHero from '../components/layout/PageHero';
import TransactionRow from '../components/transactions/TransactionRow';
import { Button } from '../components/ui/button';

const Transactions = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'completed', label: 'Completed' },
    { id: 'pending', label: 'Pending' },
    { id: 'failed', label: 'Failed' },
  ];

  const transactions = [
    {
      hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
      type: 'Bridge',
      from: 'Ethereum',
      to: 'Polygon',
      amount: '500 USDC',
      status: 'completed' as const,
      timestamp: '2 minutes ago',
    },
    {
      hash: '0x9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h',
      type: 'Bridge',
      from: 'Arbitrum',
      to: 'Avalanche',
      amount: '1.5 ETH',
      status: 'pending' as const,
      timestamp: '5 minutes ago',
    },
    {
      hash: '0x5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x',
      type: 'Bridge',
      from: 'Solana',
      to: 'Ethereum',
      amount: '100 SOL',
      status: 'completed' as const,
      timestamp: '1 hour ago',
    },
    {
      hash: '0xb1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9',
      type: 'Bridge',
      from: 'Polygon',
      to: 'Arbitrum',
      amount: '2,500 USDC',
      status: 'completed' as const,
      timestamp: '3 hours ago',
    },
    {
      hash: '0x3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w',
      type: 'Bridge',
      from: 'Ethereum',
      to: 'Optimism',
      amount: '0.8 ETH',
      status: 'failed' as const,
      timestamp: '5 hours ago',
    },
  ];

  return (
    <PageLayout>
      <PageHero 
        title="Transactions"
        description="Track all your cross-chain transfers and their status in real-time"
      />

      <section className="px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-1 border border-border rounded-full bg-card">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === filter.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by hash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 border border-border rounded-full bg-card focus:outline-none focus:border-primary/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <TransactionRow key={index} {...transaction} />
            ))}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center pt-4">
            <Button variant="outline" className="rounded-full px-8">
              Load More
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Transactions;
