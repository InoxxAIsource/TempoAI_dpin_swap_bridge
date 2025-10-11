interface MermaidProps {
  chart: string;
}

const Mermaid = ({ chart }: MermaidProps) => {
  return (
    <div className="my-8">
      {/* @ts-ignore - lov-mermaid is a custom Lovable element */}
      <lov-mermaid>{chart}</lov-mermaid>
    </div>
  );
};

export default Mermaid;
