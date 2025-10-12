import { useEffect, useRef } from 'react';

interface MermaidProps {
  chart: string;
}

const Mermaid = ({ chart }: MermaidProps) => {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mermaidRef.current) {
      const mermaidElement = mermaidRef.current.querySelector('lov-mermaid');
      if (mermaidElement) {
        mermaidElement.textContent = chart;
      }
    }
  }, [chart]);

  return (
    <div ref={mermaidRef} className="my-8 p-6 rounded-xl border border-border bg-card/50">
      {/* @ts-ignore - lov-mermaid is a custom Lovable element */}
      <lov-mermaid />
    </div>
  );
};

export default Mermaid;
