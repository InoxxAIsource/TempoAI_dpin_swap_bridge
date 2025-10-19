import BenefitsShowcase from '@/components/depin/BenefitsShowcase';
import ComparisonCards from '@/components/depin/ComparisonCards';

const DePINBenefits = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">DePIN Benefits</h1>
        <p className="text-xl text-muted-foreground">
          Discover the advantages of participating in decentralized physical infrastructure networks.
        </p>
      </div>

      <BenefitsShowcase />
      <ComparisonCards />
    </div>
  );
};

export default DePINBenefits;
