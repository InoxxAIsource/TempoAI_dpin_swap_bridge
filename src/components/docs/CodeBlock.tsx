import { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import Prism from 'prismjs';

// Import language support
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-solidity';

// Import custom Prism theme
import '@/styles/prism-custom.css';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

const languageLabels: Record<string, string> = {
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  tsx: 'TSX',
  jsx: 'JSX',
  python: 'Python',
  bash: 'Bash',
  json: 'JSON',
  solidity: 'Solidity',
};

const CodeBlock = ({ code, language = 'typescript', filename }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border bg-[hsl(var(--docs-code-bg))] shadow-sm">
      <div className="px-4 py-2.5 bg-muted/50 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="text-sm font-mono text-foreground font-medium">{filename}</span>
          )}
          {!filename && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-background/50 text-muted-foreground font-medium">
              {languageLabels[language] || language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-background/50 hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="relative">
        <pre className="p-4 overflow-x-auto">
          <code className={`language-${language} text-sm leading-relaxed`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
