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
    <div className="not-prose my-6 rounded-lg overflow-hidden border border-border bg-[hsl(var(--docs-code-bg))] shadow-md hover:shadow-lg transition-shadow">
      <div className="px-4 py-3 bg-muted/30 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="text-[13px] font-mono text-foreground font-semibold tracking-tight">{filename}</span>
          )}
          {!filename && (
            <span className="text-[11px] px-2.5 py-1 rounded-md bg-[hsl(var(--docs-accent))]/10 text-[hsl(var(--docs-accent))] font-semibold uppercase tracking-wide border border-[hsl(var(--docs-accent))]/20">
              {languageLabels[language] || language}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-background hover:bg-[hsl(var(--docs-accent))]/10 transition-all text-muted-foreground hover:text-[hsl(var(--docs-accent))] border border-transparent hover:border-[hsl(var(--docs-accent))]/20"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied</span>
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
        <pre className="p-5 overflow-x-auto scrollbar-thin">
          <code className={`language-${language} text-[13px] leading-[1.6]`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
