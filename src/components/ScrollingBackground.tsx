import { useEffect, useRef } from 'react';

const ScrollingBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const blockchainText = [
    '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t',
    '0x9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h',
    '0x5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x',
    '0xb1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9',
    '0x3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w',
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const lines = container.querySelectorAll('.scroll-line');
    lines.forEach((line, index) => {
      const speed = 20 + (index * 5);
      (line as HTMLElement).style.animationDuration = `${speed}s`;
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-10"
      aria-hidden="true"
    >
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="scroll-line whitespace-nowrap text-xs text-foreground font-mono py-1"
          style={{
            animation: 'scroll-left linear infinite',
            animationDelay: `${i * 0.5}s`,
          }}
        >
          {[...Array(10)].map((_, j) => (
            <span key={j} className="inline-block px-4">
              {blockchainText[j % blockchainText.length]}
            </span>
          ))}
        </div>
      ))}
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollingBackground;
