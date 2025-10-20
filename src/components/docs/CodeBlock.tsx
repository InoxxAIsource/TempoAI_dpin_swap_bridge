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
    <div className="my-6 rounded-xl overflow-hidden border border-border bg-card/50">
      {filename && (
        <div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center justify-between">
          <span className="text-sm font-mono text-muted-foreground">{filename}</span>
          <span className="text-xs text-muted-foreground">{language}</span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        <pre className="p-4 overflow-x-auto">
          <code className={`language-${language} text-sm font-mono`}>
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
