import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ProtocolPopover = () => {
  const protocols = [
    {
      name: "Uniswap",
      logo: "https://cryptologos.cc/logos/uniswap-uni-logo.svg",
      color: "#FF007A"
    },
    {
      name: "Lido",
      logo: "https://cryptologos.cc/logos/lido-dao-ldo-logo.svg",
      color: "#00A3FF"
    },
    {
      name: "Pendle",
      logo: "https://assets.coingecko.com/coins/images/15069/standard/Pendle_Logo_Normal-03.png",
      color: "#00D4AA"
    },
    {
      name: "Yearn",
      logo: "https://cryptologos.cc/logos/yearn-finance-yfi-logo.svg",
      color: "#0657F9"
    },
    {
      name: "Aave",
      logo: "https://cryptologos.cc/logos/aave-aave-logo.svg",
      color: "#B6509E"
    },
    {
      name: "Compound",
      logo: "https://cryptologos.cc/logos/compound-comp-logo.svg",
      color: "#00D395"
    },
    {
      name: "Curve",
      logo: "https://cryptologos.cc/logos/curve-dao-token-crv-logo.svg",
      color: "#FF0000"
    }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
          Protocol
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div>
          <h4 className="font-semibold mb-4 text-sm">Supported Protocols</h4>
          <div className="grid grid-cols-2 gap-4">
            {protocols.map((protocol) => (
              <div
                key={protocol.name}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                  <img 
                    src={protocol.logo} 
                    alt={protocol.name}
                    className="w-6 h-6"
                    onError={(e) => {
                      // Fallback to colored circle with initial if image fails
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.parentElement;
                      if (fallback) {
                        fallback.style.backgroundColor = protocol.color;
                        fallback.innerHTML = `<span class="text-white font-bold text-xs">${protocol.name[0]}</span>`;
                      }
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{protocol.name}</span>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ProtocolPopover;
