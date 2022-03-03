import { Toast } from '@dinoswap/uikit'
import BigNumber from 'bignumber.js'
import { CampaignType, FarmConfig, Nft, PoolConfig, TarpitConfig, Team } from 'config/constants/types'

export type TranslatableText =
  | string
  | {
      id: number
      fallback: string
      data?: {
        [key: string]: string | number
      }
    }

export type SerializedBigNumber = string
export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber
  finished?: boolean
  quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  lpTokenBalanceMC?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
  userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    earnings: BigNumber
  }
}

export interface Lock {
  amount: number
  validity: number
  reward: number
  claimed: boolean
}
// here
export interface Tarpit extends TarpitConfig {
  totalStaked?: BigNumber
  startBlock?: number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance?: {
      locked: BigNumber
      unlocked: BigNumber
    },
    totalRewards: BigNumber
    totalDeposits: BigNumber
    locks?: Lock[]
  }
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  dinoPoolStaked?: BigNumber
  startBlock?: number
  endBlock?: number
  lockBlock?: number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

export interface JurassicPool extends PoolConfig {
  totalStaked?: BigNumber
  dinoPoolStaked?: BigNumber
  startBlock?: number
  endBlock?: number
  lockBlock?: number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

export interface Profile {
  userId: number
  points: number
  teamId: number
  nftAddress: string
  tokenId: number
  isActive: boolean
  username: string
  nft?: Nft
  team: Team
  hasRegistered: boolean
}

// Slices states

export interface ToastsState {
  data: Toast[]
}

export interface FarmsState {
  data: Farm[]
}

export interface PoolsState {
  data: Pool[]
}

export interface JurassicPoolsState {
  data: JurassicPool[]
}

export interface TarpitState {
  data: Tarpit[]
}

export interface ProfileState {
  isInitialized: boolean
  isLoading: boolean
  hasRegistered: boolean
  data: Profile
}

export type TeamResponse = {
  0: string
  1: string
  2: string
  3: string
  4: boolean
}

export type TeamsById = {
  [key: string]: Team
}

export interface TeamsState {
  isInitialized: boolean
  isLoading: boolean
  data: TeamsById
}

export interface Achievement {
  id: string
  type: CampaignType
  address: string
  title: TranslatableText
  description?: TranslatableText
  badge: string
  points: number
}

export interface AchievementState {
  data: Achievement[]
}

// API Price State
export interface PriceList {
  [key: string]: number
}

export interface PriceApiResponse {
  /* eslint-disable camelcase */
  update_at: string
  prices: PriceList
}

export interface PriceState {
  isLoading: boolean
  lastUpdated: string
  data: PriceList
}

// Block

export interface BlockState {
  currentBlock: number
  initialBlock: number
}

export interface RaffleResponse {
  drawing: boolean
  lastRaffle: string
  raffleDuration: string
  winnerCount: string
  ticketCount: string
  winners: string[]
  totalSupply: string
  ticketPrice: string
}

export interface RaffleState {
  raffleCount: string
  currentRound: RaffleResponse
}

// Global state

export interface State {
  farms: FarmsState
  toasts: ToastsState
  prices: PriceState
  pools: PoolsState
  profile: ProfileState
  teams: TeamsState
  achievements: AchievementState
  block: BlockState
  tarpits: TarpitState
  jurassicpools: JurassicPoolsState
  raffle: RaffleState
}
