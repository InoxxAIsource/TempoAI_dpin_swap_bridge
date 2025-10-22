import { ReactNode } from 'react';

interface DocSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
  subtitle?: string;
}

const DocSection = ({ id, title, children, subtitle }: DocSectionProps) => {
  return (
    <section id={id} className="mb-20 scroll-mt-24">
      <div className="mb-8 pb-6 border-b border-border/50">
        <h2 className="text-[32px] md:text-[36px] font-bold mb-3 font-playfair text-foreground leading-tight">{title}</h2>
        {subtitle && (
          <p className="text-[16px] text-muted-foreground/90 leading-[1.7] max-w-[680px]">{subtitle}</p>
        )}
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </section>
  );
};

export default DocSection;
