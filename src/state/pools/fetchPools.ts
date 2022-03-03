/* eslint-disable no-nested-ternary */
import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import cakeABI from 'config/abi/cake.json'
import poolsABI from 'config/abi/pool.json'
import newestpoolsABI from 'config/abi/newestpools.json'
import wbnbABI from 'config/abi/weth.json'
import multicall from 'utils/multicall'
import { getAddress, getWbnbAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0)
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'startBlock',
    }
  })
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'endBlock',
    }
  })
  const callsLockBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'lockBlock',
    }
  })

  const starts = await multicall(sousChefABI, callsStartBlock)
  const ends = await multicall(sousChefABI, callsEndBlock)
  const locks = await multicall(sousChefABI, callsLockBlock)

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    const lockBlock = locks[index]
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
      lockBlock: new BigNumber(lockBlock).toJSON(),
    }
  })
}

export const fetchPoolsTotalStatking = async () => {
  const nonBnbPools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'BNB')

  const callsNonBnbPools = nonBnbPools.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  const nonBnbPoolsTotalStaked = await multicall(cakeABI, callsNonBnbPools)

  const dinoPools = poolsConfig.filter((p) => p.earningToken.symbol === 'DINO' && p.sousId !== 1)

  console.log("Should be one dino pool", dinoPools)



  const callsDinoPools = dinoPools.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'dinoSupply',
      params: [],
    }
  })

  const dinoPoolsTotalStaked = await multicall(poolsABI, callsDinoPools)


  const newestPools = poolsConfig.filter((p) => p.sousId === 9)

  console.log("Should be one newest pool", newestPools)



  const callsNewestPools = newestPools.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'stakedDinos',
      params: [],
    }
  })

  const newestPoolsTotalStaked = await multicall(newestpoolsABI, callsNewestPools)


  return [
    ...nonBnbPools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonBnbPoolsTotalStaked[index]).toJSON(),
      dinoPoolStaked: (dinoPoolsTotalStaked[index] ? new BigNumber(dinoPoolsTotalStaked[index]).toJSON() : newestPoolsTotalStaked[index] ? new BigNumber(newestPoolsTotalStaked[index]).toJSON() : 0)
    }))
  ]
}
