import CalculationExamples from '@/components/depin/CalculationExamples';
import ROICalculator from '@/components/depin/ROICalculator';

const DePINEconomics = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">DePIN Economics</h1>
        <p className="text-xl text-muted-foreground">
          Understand the reward structure, calculations, and ROI for DePIN devices.
        </p>
      </div>

      <CalculationExamples />
      <ROICalculator />
    </div>
  );
};

export default DePINEconomics;
