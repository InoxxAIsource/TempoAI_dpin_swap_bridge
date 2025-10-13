import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import uniswapLogo from "@/assets/protocols/uniswap.png";
import lidoLogo from "@/assets/protocols/lido.png";
import pendleLogo from "@/assets/protocols/pendle.png";
import yearnLogo from "@/assets/protocols/yearn.png";
import aaveLogo from "@/assets/protocols/aave.png";
import compoundLogo from "@/assets/protocols/compound.png";
import curveLogo from "@/assets/protocols/curve.png";

const ProtocolPopover = () => {
  const protocols = [
    {
      name: "Uniswap",
      logo: uniswapLogo,
      color: "#FF007A"
    },
    {
      name: "Lido",
      logo: lidoLogo,
      color: "#00A3FF"
    },
    {
      name: "Pendle",
      logo: pendleLogo,
      color: "#00D4AA"
    },
    {
      name: "Yearn",
      logo: yearnLogo,
      color: "#0657F9"
    },
    {
      name: "Aave",
      logo: aaveLogo,
      color: "#B6509E"
    },
    {
      name: "Compound",
      logo: compoundLogo,
      color: "#00D395"
    },
    {
      name: "Curve",
      logo: curveLogo,
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
