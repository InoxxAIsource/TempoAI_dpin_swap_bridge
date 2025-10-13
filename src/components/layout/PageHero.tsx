interface PageHeroProps {
  title: string;
  description: string;
}

const PageHero = ({ title, description }: PageHeroProps) => {
  return (
    <section className="px-4 md:px-6 lg:px-12 py-8 md:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">{title}</h1>
        </div>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl">
          {description}
        </p>
      </div>
    </section>
  );
};

export default PageHero;
