interface MessageContentProps {
  content: string;
}

export default function MessageContent({ content }: MessageContentProps) {
  // Parse markdown-like formatting
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    
    lines.forEach((line, idx) => {
      // Bold text with **
      let processedLine = line;
      const boldParts: (string | JSX.Element)[] = [];
      let lastIndex = 0;
      let match;
      const boldRegex = /\*\*(.+?)\*\*/g;
      
      while ((match = boldRegex.exec(processedLine)) !== null) {
        if (match.index > lastIndex) {
          boldParts.push(processedLine.slice(lastIndex, match.index));
        }
        boldParts.push(<strong key={`bold-${idx}-${match.index}`}>{match[1]}</strong>);
        lastIndex = match.index + match[0].length;
      }
      
      if (lastIndex < processedLine.length) {
        boldParts.push(processedLine.slice(lastIndex));
      }
      
      // Links
      const linkRegex = /https?:\/\/[^\s]+/g;
      const finalParts: (string | JSX.Element)[] = [];
      
      boldParts.forEach((part, partIdx) => {
        if (typeof part === 'string') {
          let lastLinkIndex = 0;
          let linkMatch;
          const linkMatches: Array<{ index: number; url: string }> = [];
          
          while ((linkMatch = linkRegex.exec(part)) !== null) {
            linkMatches.push({ index: linkMatch.index, url: linkMatch[0] });
          }
          
          if (linkMatches.length === 0) {
            finalParts.push(part);
          } else {
            linkMatches.forEach((lm, lmIdx) => {
              if (lm.index > lastLinkIndex) {
                finalParts.push(part.slice(lastLinkIndex, lm.index));
              }
              finalParts.push(
                <a
                  key={`link-${idx}-${partIdx}-${lmIdx}`}
                  href={lm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  {lm.url}
                </a>
              );
              lastLinkIndex = lm.index + lm.url.length;
            });
            
            if (lastLinkIndex < part.length) {
              finalParts.push(part.slice(lastLinkIndex));
            }
          }
        } else {
          finalParts.push(part);
        }
      });
      
      // Check if it's a list item
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        elements.push(
          <div key={idx} className="flex gap-2 mb-1">
            <span className="text-zinc-400">•</span>
            <span>{finalParts}</span>
          </div>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={idx} className="h-2" />);
      } else {
        elements.push(
          <div key={idx} className="mb-1">
            {finalParts}
          </div>
        );
      }
    });
    
    return elements;
  };

  return <div className="space-y-1">{parseContent(content)}</div>;
}
