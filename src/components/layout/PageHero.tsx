interface PageHeroProps {
  title: string;
  description: string;
}

const PageHero = ({ title, description }: PageHeroProps) => {
  return (
    <section className="px-6 md:px-12 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
          {description}
        </p>
      </div>
    </section>
  );
};

export default PageHero;
