/* eslint-disable no-nested-ternary */
import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK } from 'config'

/**
 * Get the APY value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APY is NaN or infinite.
 */

 // THIS IS ROI
export const getPoolApy = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
  blocksRemaining: number,
): number => {
   console.log("POOL APY INPUT", stakingTokenPrice, rewardTokenPrice, totalStaked, tokenPerBlock, blocksRemaining)

  const totalRewardPricePerRemainingTime = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(blocksRemaining)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apy = (totalRewardPricePerRemainingTime.minus(totalStakingTokenInPool)).div(totalStakingTokenInPool).times(100)

   console.log("POOL APY CALC APY", apy.toNumber())
  return apy.isNaN() || !apy.isFinite() ? null : apy.toNumber()

}

// yearly APR
export const getPoolApyYearly = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
  blocksRemaining: number,
): number => {
  console.log("POOL APY INPUT", stakingTokenPrice, rewardTokenPrice, totalStaked, tokenPerBlock, blocksRemaining)

  const totalRewardPricePerRemainingTime = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(blocksRemaining)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apy = (totalRewardPricePerRemainingTime.minus(totalStakingTokenInPool)).div(totalStakingTokenInPool).times(100).div(blocksRemaining).times(BLOCKS_PER_YEAR)

  console.log("POOL APY CALC APY", apy.toNumber())
  return apy.isNaN() || !apy.isFinite() ? null : (apy.toNumber() < -100) ? (-100) : apy.toNumber()
}


export const getJurassicPoolApy = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
): number => {
  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apy.isNaN() || !apy.isFinite() ? null : apy.toNumber()
}

/**
 * Get farm APY value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getFarmApy = (poolWeight: BigNumber, cakePriceUsd: BigNumber, poolLiquidityUsd: BigNumber): number => {
  const yearlyCakeRewardAllocation = CAKE_PER_BLOCK.times(BLOCKS_PER_YEAR).times(poolWeight)
  const apy = yearlyCakeRewardAllocation.times(cakePriceUsd).div(poolLiquidityUsd).times(100)
  return apy.isNaN() || !apy.isFinite() ? null : apy.toNumber()
}

export default null
