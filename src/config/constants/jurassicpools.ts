import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  {
    sousId: 1,
    stakingToken: tokens.dino,
    earningToken: tokens.dino,
    contractAddress: {
      137: '0x52e7b0C6fB33D3d404b07006b006c8A8D6049C55',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    tokenPerBlock: '0.4',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 7,
    stakingToken: tokens.dino,
    earningToken: tokens.for,
    contractAddress: {
      137: '0xbea90C9e26476aD31Ed90beA780C6B8b2E6B2711',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '1.135113715',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 6,
    stakingToken: tokens.dino,
    earningToken: tokens.dg,
    contractAddress: {
      137: '0x53D7d8c078c2668a6b0002D062Eb4DFa8dC5fE13',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0.0002751736111',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 5,
    stakingToken: tokens.dino,
    earningToken: tokens.route,
    contractAddress: {
      137: '0xffFA860353D907767091E711F76e297099B99EF5',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0.01300491898',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 4,
    stakingToken: tokens.dino,
    earningToken: tokens.sfi,
    contractAddress: {
      137: '0x990Fd37852b6123B376bCe814BC08192148ef9Aa',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0.00009403935185',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 2,
    stakingToken: tokens.dino,
    earningToken: tokens.ust,
    contractAddress: {
      137: '0x80f23e90f8d7d6f5e3f602b1e26c7b5fa4e530d3',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '0.05787037',
    sortOrder: 1,
    isFinished: false,
  },
  {
    sousId: 3,
    stakingToken: tokens.dino,
    earningToken: tokens.arpa,
    contractAddress: {
      137: '0x03728A3262Ba7642B5B7c2Bff588CA3734d62dE9',
    },
    poolCategory: PoolCategory.COMMUNITY,
    harvest: true,
    tokenPerBlock: '1.451464988',
    sortOrder: 1,
    isFinished: false,
  },
]

export default pools
