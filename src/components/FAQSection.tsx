import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: 'How does Tempo generate yields?',
      answer: 'Tempo uses AI algorithms to automatically deploy your assets across the highest-yielding DeFi protocols including lending platforms (Aave, Compound), DEXs (Uniswap, Curve), and yield farming opportunities. The AI continuously monitors and rebalances to optimize returns while managing risk.',
    },
    {
      question: 'Is my money safe?',
      answer: 'Security is our top priority. All smart contracts are audited by leading firms (Trail of Bits, OpenZeppelin, Quantstamp). We employ multi-signature wallets, time-locked upgrades, and maintain $50M+ in insurance coverage. Your assets are non-custodial - you always retain control.',
    },
    {
      question: 'What are the fees?',
      answer: 'Tempo charges a 2% management fee on assets under management (AUM) and 20% performance fee on profits generated. There are no deposit or withdrawal fees. Gas costs are optimized and batched to minimize your transaction costs.',
    },
    {
      question: 'Can I withdraw anytime?',
      answer: 'Yes, absolutely. There are no lock-up periods or withdrawal penalties. You can withdraw your full balance anytime. Withdrawals typically process within minutes, though during high network congestion it may take longer.',
    },
    {
      question: 'Which chains does Tempo support?',
      answer: 'Tempo currently supports Ethereum, Arbitrum, Optimism, Polygon, Avalanche, and BNB Chain. Our AI automatically identifies the best opportunities across all supported chains and handles bridging when necessary.',
    },
    {
      question: 'What assets can I deposit?',
      answer: 'We support major stablecoins (USDC, USDT, DAI), ETH, WBTC, and select blue-chip DeFi tokens. Each asset class has different strategies optimized by our AI for maximum risk-adjusted returns.',
    },
    {
      question: 'How is this different from other yield aggregators?',
      answer: 'Unlike static yield aggregators, Tempo uses machine learning to predict market conditions and dynamically adjust strategies in real-time. Our AI learns from historical data, adapts to volatility, and executes complex multi-protocol strategies that would be impractical to manage manually.',
    },
    {
      question: 'Do I need technical knowledge to use Tempo?',
      answer: 'Not at all. While we build on sophisticated DeFi infrastructure, our interface is designed for simplicity. Just connect your wallet, deposit assets, and our AI handles everything else. Advanced users can access detailed analytics and customize their risk preferences.',
    },
  ];

  return (
    <section className="relative px-6 md:px-12 py-32">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Frequently asked{' '}
            <span className="block">questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Tempo Protocol
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border rounded-xl px-6 bg-card"
            >
              <AccordionTrigger className="text-left font-bold hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70 leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
