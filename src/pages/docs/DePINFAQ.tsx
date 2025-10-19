import { Card } from '@/components/ui/card';

const DePINFAQ = () => {
  const faqs = [
    {
      question: 'How do I get started?',
      answer: 'Visit the DePIN dashboard and choose between demo mode (instant setup) or real hardware (requires device configuration). Demo mode is perfect for learning the platform.'
    },
    {
      question: 'What\'s the difference between demo and verified devices?',
      answer: 'Demo devices are simulated and earn 1x base rewards. Verified devices use real hardware with cryptographic signatures and earn 2x rewards plus quality bonuses.'
    },
    {
      question: 'Why did the reward rate change from $0.05 to $0.002 per kWh?',
      answer: 'To ensure long-term sustainability of the network. The new multi-factor bonus system allows dedicated users to earn $3-4/month (matching previous projections) while discouraging spam and gaming.'
    },
    {
      question: 'Can I still earn $100+/month?',
      answer: 'Yes! With multiple verified devices (3-5), consistent reporting, and all bonuses active, you can earn $5-10/month per device. A 10-device setup can reach $100+/month.'
    },
    {
      question: 'What\'s the break-even time now?',
      answer: 'With the new system, a Raspberry Pi (~$60) with one verified solar panel earning ~$2-3/month will break even in 3-4 months. However, the system is now sustainable long-term.'
    },
    {
      question: 'How do streak bonuses work?',
      answer: 'Report data daily for 7 days: +$0.10 bonus. 15 days: +$0.25. 30 days: +$0.50. Perfect month bonus significantly boosts earnings!'
    },
    {
      question: 'What chains are supported via Wormhole?',
      answer: 'Ethereum, Polygon, Avalanche, Arbitrum, Optimism, Base, and BNB Chain. You can bridge your rewards to any of these chains.'
    },
    {
      question: 'Is Wormhole safe?',
      answer: 'Wormhole is secured by 19 independent Guardian validators (including Coinbase, Jump Crypto, Everstake). Every transaction requires 13/19 signatures. The network has secured $40B+ in volume.'
    },
    {
      question: 'How much does it cost to bridge via Wormhole?',
      answer: 'Bridge fees are very low: Polygon (~$0.50 total), Base (~$0.40 total), Arbitrum/Optimism (~$0.70 total). Much cheaper than staying on Ethereum ($5-50 gas fees).'
    },
    {
      question: 'How long does a Wormhole bridge take?',
      answer: 'Typically 1.5-3 minutes from start to finish: Source transaction (30s) + Guardian validation (30-60s) + VAA generation (10-20s) + Destination redemption (30-60s).'
    },
    {
      question: 'Which chain should I choose for my rewards?',
      answer: 'Low fees + DeFi: Polygon (Aave 6% APY, ~$0.50 cost). Coinbase integration: Base (easy fiat off-ramp). High yields: Avalanche (12%+ APY pools). Maximum security: Keep on Ethereum (no bridge needed).'
    },
    {
      question: 'Should I choose USD or TEMPO tokens?',
      answer: 'Depends on your goals. USD (USDC) is stable and predictable. TEMPO tokens have potential upside and governance rights. Mixed (80/20) balances both.'
    },
    {
      question: 'Can I combine DePIN rewards with DeFi yields?',
      answer: 'Yes! Bridge your DePIN earnings to chains like Polygon or Avalanche and deposit in yield protocols like Aave (6% APY) or provide liquidity (12%+ APY).'
    },
    {
      question: 'What happens if my device goes offline?',
      answer: 'You won\'t earn rewards during downtime. Devices with uptime > 99% receive quality bonuses. Uptime is calculated over rolling 30-day periods.'
    },
    {
      question: 'Is this testnet or mainnet?',
      answer: 'Currently testnet. Rewards are for demonstration purposes. Mainnet launch is planned for Q2 2026 with real token economics.'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about DePIN, rewards, and Wormhole bridging.
        </p>
      </div>

      <Card className="p-8">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
              {index < faqs.length - 1 && <div className="mt-6 border-b border-border"></div>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DePINFAQ;
