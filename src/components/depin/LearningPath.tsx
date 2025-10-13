import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Check, Lock, Play, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LearningPath = () => {
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  const modules = [
    {
      id: 1,
      title: 'Introduction to DePIN',
      duration: '15 minutes',
      topics: [
        'What is DePIN?',
        'Why decentralization matters',
        'Real-world applications',
        'Benefits for individuals and networks'
      ],
      quiz: '5 questions'
    },
    {
      id: 2,
      title: 'Getting Started',
      duration: '30 minutes',
      topics: [
        'Creating your account',
        'Understanding demo mode',
        'Adding your first device',
        'Reading the dashboard',
        'Understanding metrics'
      ],
      quiz: '8 questions'
    },
    {
      id: 3,
      title: 'Device Setup & Verification',
      duration: '45 minutes',
      topics: [
        'Choosing device types',
        'Raspberry Pi requirements',
        'Installing the DePIN client',
        'Configuring your device',
        'Troubleshooting common issues',
        'Verifying device authenticity'
      ],
      quiz: '10 questions',
      handsOn: true
    },
    {
      id: 4,
      title: 'Understanding Rewards',
      duration: '30 minutes',
      topics: [
        'How rewards are calculated',
        'Demo vs verified multipliers',
        'Uptime requirements and bonuses',
        'Maximizing your earnings',
        'Tracking your progress'
      ],
      quiz: '7 questions'
    },
    {
      id: 5,
      title: 'Wormhole & Cross-Chain',
      duration: '45 minutes',
      topics: [
        'Introduction to Wormhole protocol',
        'Why cross-chain matters',
        'Bridging your rewards',
        'Chain selection guide',
        'Gas costs and optimization',
        'Security considerations'
      ],
      quiz: '12 questions',
      handsOn: true
    },
    {
      id: 6,
      title: 'DeFi Integration',
      duration: '30 minutes',
      topics: [
        'What is DeFi?',
        'Yield farming basics',
        'Combining DePIN + DeFi rewards',
        'Risk management strategies',
        'Portfolio diversification'
      ],
      quiz: '8 questions'
    },
    {
      id: 7,
      title: 'Advanced Topics',
      duration: '60 minutes',
      topics: [
        'Cryptographic signatures (Ed25519)',
        'Custom device types',
        'API integration guide',
        'Building your own client',
        'Protocol governance',
        'Future roadmap and opportunities'
      ],
      quiz: '15 questions',
      handsOn: true
    }
  ];

  const toggleModule = (id: number) => {
    if (completedModules.includes(id)) {
      setCompletedModules(completedModules.filter((m) => m !== id));
    } else {
      setCompletedModules([...completedModules, id]);
    }
  };

  const isModuleLocked = (id: number) => {
    return id > 1 && !completedModules.includes(id - 1);
  };

  const progress = (completedModules.length / modules.length) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-3xl font-bold mb-3">Complete Learning Path</h3>
        <p className="text-muted-foreground mb-6">
          Master DePIN from beginner to expert. Complete all modules to earn your certification.
        </p>

        {/* Progress Bar */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-semibold">Your Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedModules.length} / {modules.length} modules completed
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right text-sm font-semibold text-primary mt-2">
            {Math.round(progress)}%
          </div>
        </Card>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {modules.map((module, index) => {
          const isLocked = isModuleLocked(module.id);
          const isCompleted = completedModules.includes(module.id);

          return (
            <Card
              key={module.id}
              className={`p-6 transition-all ${
                isLocked
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-lg hover:shadow-primary/5 cursor-pointer'
              } ${isCompleted ? 'bg-green-500/5 border-green-500/20' : ''}`}
              onClick={() => !isLocked && toggleModule(module.id)}
            >
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-400'
                      : isLocked
                      ? 'bg-muted'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-8 h-8" />
                  ) : isLocked ? (
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  ) : (
                    <BookOpen className="w-8 h-8" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-muted-foreground">
                          Module {module.id}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                          {module.duration}
                        </span>
                        {module.handsOn && (
                          <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold">
                            Hands-on Lab
                          </span>
                        )}
                      </div>
                      <h4 className="text-xl font-bold mb-2">{module.title}</h4>
                    </div>
                    {!isLocked && !isCompleted && (
                      <Button size="sm" className="gap-2">
                        <Play className="w-4 h-4" />
                        Start
                      </Button>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="text-sm font-semibold text-muted-foreground mb-2">
                      Topics covered:
                    </div>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {module.topics.map((topic, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="text-muted-foreground">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">
                        Quiz: {module.quiz}
                      </span>
                    </div>
                    {isCompleted && (
                      <div className="flex items-center gap-2 text-green-400 font-semibold">
                        <Check className="w-4 h-4" />
                        Completed
                      </div>
                    )}
                    {isLocked && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Lock className="w-4 h-4" />
                        Complete previous module to unlock
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Certification */}
      <Card className="p-8 bg-gradient-to-br from-primary/10 via-purple-500/10 to-green-500/10 border-primary/20">
        <div className="flex items-start gap-6">
          <div className="p-4 rounded-xl bg-primary/20">
            <Award className="w-12 h-12 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-3">DePIN Expert Certification</h3>
            <p className="text-muted-foreground mb-6">
              Complete all 7 modules and pass the final assessment to earn your DePIN Expert
              certification. Demonstrate mastery of decentralized physical infrastructure networks,
              cross-chain bridging, and DeFi integration.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4 bg-card/50">
                <div className="text-2xl font-bold text-primary mb-1">
                  {completedModules.length}/7
                </div>
                <div className="text-sm text-muted-foreground">Modules Completed</div>
              </Card>
              <Card className="p-4 bg-card/50">
                <div className="text-2xl font-bold text-primary mb-1">20</div>
                <div className="text-sm text-muted-foreground">Final Assessment Questions</div>
              </Card>
              <Card className="p-4 bg-card/50">
                <div className="text-2xl font-bold text-primary mb-1">85%</div>
                <div className="text-sm text-muted-foreground">Passing Score Required</div>
              </Card>
            </div>
            <Button
              size="lg"
              disabled={completedModules.length < modules.length}
              className="gap-2"
            >
              <Award className="w-5 h-5" />
              {completedModules.length < modules.length
                ? `Complete ${modules.length - completedModules.length} more module${
                    modules.length - completedModules.length > 1 ? 's' : ''
                  } to unlock`
                : 'Take Final Assessment'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LearningPath;
