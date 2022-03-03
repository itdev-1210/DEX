import { MenuEntry } from '@dinoswap/uikit'

export const config: MenuEntry[] = [
  {
    icon: "HomeIcon",
    label: "Home",
    href: "https://dinoswap.exchange",
  },
  {
    icon: "TradeIcon",
    label: "Exchange",
    href: "https://trade.dinoswap.exchange",
  },
  {
    label: "Fossil Farms",
    icon: "FarmIcon",
    href: "https://dinoswap.exchange/farms",
  },
  {
    label: "Extinction Pools",
    icon: "PoolIcon",
    href: "https://dinoswap.exchange/pools",
  },
  {
    label: "Jurassic Pools",
    icon: "JurassicIcon",
    href: "https://dinoswap.exchange/jurassicpools",
  },
];
export const sideconfig: MenuEntry[] = [
   {
    label: "Tar Pits",
    icon: "TarIcon",
    href: "https://dinoswap.exchange/tarpits",
  },
  {
    label: "Raffle",
    icon: "RaffleIcon",
    href: "https://dinoswap.exchange/raffle",
  },
];

export default config

