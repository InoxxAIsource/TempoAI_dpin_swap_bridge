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
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
        {subtitle && (
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="prose prose-invert max-w-none">
        {children}
      </div>
    </section>
  );
};

export default DocSection;
