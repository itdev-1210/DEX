import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
   {
    pid: 10,
    lpSymbol: 'DINO-USDC LP',
    lpAddresses: {
      137: '0x3324af8417844e70b81555a6d1568d78f4d4bf1f',
    },
    amm:"SushiSwap",
    token: tokens.dino,
    quoteToken: tokens.usdc,
  }, 
   {
    pid: 11,
    lpSymbol: 'DINO-wETH LP',
    lpAddresses: {
      137: '0x9f03309A588e33A239Bf49ed8D68b2D45C7A1F11',
    },
    amm:"QuickSwap",
    token: tokens.dino,
    quoteToken: tokens.weth,
  },
     {
    pid: 26,
    lpSymbol: 'EROWAN-REGEN LP',
    lpAddresses: {
      137: '0x66c37a00E426A613B188180198AAC12B0b4aE4D4',
    },
    amm:"QuickSwap",
    token: tokens.erowan,
    quoteToken: tokens.regen,
    isCommunity:true
  }, 
     {
    pid: 25,
    lpSymbol: 'EROWAN-XPRT LP',
    lpAddresses: {
      137: '0xF366DF119532b2e0F4E416C81d6FF7728a60FE7d',
    },
    amm:"QuickSwap",
    token: tokens.erowan,
    quoteToken: tokens.xprt,
    isCommunity:true
  }, 
   {
    pid: 24,
    lpSymbol: 'EROWAN-AKT LP',
    lpAddresses: {
      137: '0xA651EF83FA6a90e76206De4e79A5c69f80994556',
    },
    amm:"QuickSwap",
    token: tokens.erowan,
    quoteToken: tokens.akt,
    isCommunity:true
  }, 
   {
    pid: 23,
    lpSymbol: 'EROWAN-IRIS LP',
    lpAddresses: {
      137: '0x58fFB271c6F3D92f03C49e08E2887810F65b8Cd6',
    },
    amm:"QuickSwap",
    token: tokens.erowan,
    quoteToken: tokens.iris,
    isCommunity:true
  }, 
   {
    pid: 22,
    lpSymbol: 'EROWAN-ATOM LP',
    lpAddresses: {
      137: '0x7051810A53030171F01d89e9AeBd8A599DE1B530',
    },
    amm:"QuickSwap",
    token: tokens.erowan,
    quoteToken: tokens.atom,
    isCommunity:true
  }, 
   {
    pid: 21,
    lpSymbol: 'EROWAN-QUICK LP',
    lpAddresses: {
      137: '0x631F39D22430E889A3CFbEA4FD73Ed101059075f',
    },
    amm:"QuickSwap",
    token: tokens.erowan,
    quoteToken: tokens.quick,
    isCommunity:true
  }, 
   {
    pid: 20,
    lpSymbol: 'WORK-USDC LP',
    lpAddresses: {
      137: '0xAb0454B98dAf4A02EA29292E6A8882FB2C787DD4',
    },
    amm:"SushiSwap",
    token: tokens.work,
    quoteToken: tokens.usdc,
    isCommunity:true
  }, 
   {
    pid: 19,
    lpSymbol: 'ORBS-USDC LP',
    lpAddresses: {
      137: '0xB2b6D423e535b57aaD06E9866803B95fB66152EA',
    },
    amm:"QuickSwap",
    token: tokens.orbs,
    quoteToken: tokens.usdc,
    isCommunity:true
  }, 
   {
    pid: 18,
    lpSymbol: 'DNXC-USDC LP',
    lpAddresses: {
      137: '0xE169a660d720917B4fB7e95f045B6f60a64EB10A',
    },
    amm:"QuickSwap",
    token: tokens.dnxc,
    quoteToken: tokens.usdc,
    isCommunity:true
  }, 
   {
    pid: 17,
    lpSymbol: 'FOR-USDC LP',
    lpAddresses: {
      137: '0xA1c3eb6fE2bB452AaC4d9247478594bf04750017',
    },
    amm:"QuickSwap",
    token: tokens.for,
    quoteToken: tokens.usdc,
    isCommunity:true
  }, 
   {
    pid: 16,
    lpSymbol: 'DG-USDC LP',
    lpAddresses: {
      137: '0x27CE41B9eeB94cC122eF3B5e409b2900d3e0A629',
    },
    amm:"QuickSwap",
    token: tokens.dg,
    quoteToken: tokens.usdc,
    isCommunity:true
  }, 
   {
    pid: 15,
    lpSymbol: 'ROUTE-wETH LP',
    lpAddresses: {
      137: '0xeBC4f9B1cE66258AC3A48578FFEEba1330dDB68B',
    },
    amm:"DFYN",
    token: tokens.route,
    quoteToken: tokens.weth,
    isCommunity:true
  }, 
   {
    pid: 14,
    lpSymbol: 'SFI-wETH LP',
    lpAddresses: {
      137: '0x7C07CecD8cdd65C0daD449808cc5f9AD74C22bd1',
    },
    amm:"SushiSwap",
    token: tokens.sfi,
    quoteToken: tokens.weth,
    isCommunity:true
  }, 
   {
    pid: 13,
    lpSymbol: 'ARPA-wETH LP',
    lpAddresses: {
      137: '0x590F5E967d73eA06DAE9aED2788108DCF52dA269',
    },
    amm:"SushiSwap",
    token: tokens.arpa,
    quoteToken: tokens.weth,
    isCommunity:true
  }, 
   {
    pid: 12,
    lpSymbol: 'UST-USDT LP',
    lpAddresses: {
      137: '0x39BEd7f1C412ab64443196A6fEcb2ac20C707224',
    },
    amm:"DFYN",
    token: tokens.ust,
    quoteToken: tokens.usdt,
    isCommunity:true,
  }, 
  {
    pid: 0,
    lpSymbol: 'BEL-wETH LP',
    lpAddresses: {
      137: '0x49ceCfa5c62b3A97F58CAd6B4aCc7c74810E1DDa',
    },
    amm:"QuickSwap",
    token: tokens.bel,
    quoteToken: tokens.weth,
    isCommunity:true
  },
  {
    pid: 1,
    lpSymbol: 'DFYN-wETH LP',
    lpAddresses: {
      137: '0x6fA867BBFDd025780a8CFE988475220AfF51FB8b',
    },
    amm:"DFYN",
    token: tokens.dfyn,
    quoteToken: tokens.weth,
    isCommunity:true
  },
  {
    pid: 2,
    lpSymbol: 'xMARK-USDC LP',
    lpAddresses: {
      137: '0x97A95deb56d689802F02f50c25EBCda5d0A49591',
    },
    amm:"SushiSwap",
    token: tokens.xmark,
    quoteToken: tokens.usdc,
    isCommunity:true
  },
  {
    pid: 3,
    lpSymbol: 'stkGHST-wETH LP',
    lpTokenForValue:"0xccb9d2100037f1253e6c1682adf7dc9944498aff",
    lpAddresses: {
      137: '0x388E2a3d389F27504212030c2D42Abf0a8188cd1',
    },
    amm:"Quickswap",
    token: tokens.ghst,
    quoteToken: tokens.weth,
    liquidityUrl:"https://wiki.aavegotchi.com/en/staking",
    isCommunity:true
  }, 
  {
    pid: 4,
    lpSymbol: 'SX-wETH LP',
    lpAddresses: {
      137: '0x1bF9805B40a5f69c7d0f9E5d1Ab718642203c652',
    },
    amm:"SushiSwap",
    token: tokens.sx,
    quoteToken: tokens.weth,
    isCommunity:true
  },
  {
    pid: 5,
    lpSymbol: 'CGG-wMATIC LP',
    lpAddresses: {
      137: '0xd74d23d2f23CD06a7D94f740A74c6E906F0C9005',
    },
    amm:"SushiSwap",
    token: tokens.cgg,
    quoteToken: tokens.wmatic,
    isCommunity: true
  },
  {
    pid: 6,
    lpSymbol: 'wMATIC-wETH LP',
    lpAddresses: {
      137: '0xadbF1854e5883eB8aa7BAf50705338739e558E5b',
    },
    amm:"QuickSwap",
    token: tokens.wmatic,
    quoteToken: tokens.weth,
    finished:true
  },
  {
    pid: 7,
    lpSymbol: 'USDC-wETH LP',
    lpAddresses: {
      137: '0x853Ee4b2A13f8a742d64C8F088bE7bA2131f670d',
    },
    amm:"QuickSwap",
    token: tokens.usdc,
    quoteToken: tokens.weth,
    finished:true
  },
  {
    pid: 8,
    lpSymbol: 'USDC-USDT LP',
    lpAddresses: {
      137: '0x2cF7252e74036d1Da831d11089D326296e64a728',
    },
    amm:"QuickSwap",
    token: tokens.usdc,
    quoteToken: tokens.usdt,
    finished:true
  },
  {
    pid: 9,
    lpSymbol: 'USDC-MAI LP',
    lpAddresses: {
      137: '0x160532D2536175d65C03B97b0630A9802c274daD',
    },
    amm:"QuickSwap",
    token: tokens.usdc,
    quoteToken: tokens.mimatic,
    finished:true
  },
]

export default farms
