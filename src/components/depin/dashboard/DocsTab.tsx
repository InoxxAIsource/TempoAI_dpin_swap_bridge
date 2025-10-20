import { Book, FileText, Video, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DocsTab = () => {
  const navigate = useNavigate();

  const docSections = [
    {
      title: 'Getting Started',
      icon: Book,
      description: 'Learn the basics of DePIN and how to get started',
      link: '/docs/depin/getting-started',
    },
    {
      title: 'Advanced Features',
      icon: FileText,
      description: 'Explore advanced DePIN features and optimization',
      link: '/docs/depin/advanced',
    },
    {
      title: 'Wormhole Integration',
      icon: Video,
      description: 'Cross-chain rewards claiming with Wormhole',
      link: '/docs/depin/wormhole',
    },
    {
      title: 'FAQ',
      icon: HelpCircle,
      description: 'Frequently asked questions about DePIN',
      link: '/docs/depin/faq',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">DePIN Documentation</h2>
        <p className="text-muted-foreground">
          Everything you need to know about earning rewards with decentralized physical infrastructure networks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(section.link)}
                  >
                    Read More
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DocsTab;
