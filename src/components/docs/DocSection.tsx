import { ReactNode } from 'react';

interface DocSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
  subtitle?: string;
}

const DocSection = ({ id, title, children, subtitle }: DocSectionProps) => {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-2 font-playfair">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground leading-relaxed">{subtitle}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};

export default DocSection;
