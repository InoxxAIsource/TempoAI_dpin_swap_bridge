interface MermaidProps {
  chart: string;
}

const Mermaid = ({ chart }: MermaidProps) => {
  return (
    <div className="my-8 p-6 rounded-xl border border-border bg-card/50">
      {/* @ts-ignore - lov-mermaid is a custom Lovable element */}
      <lov-mermaid>{chart}</lov-mermaid>
    </div>
  );
};

export default Mermaid;
