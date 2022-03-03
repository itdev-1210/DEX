import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { Contract } from 'web3-eth-contract'
import { fetchFarmUserDataAsync, updateUserBalance, updateUserStakedBalanceTarpits, updateUserPendingReward } from 'state/actions'
import { soushHarvest, soushHarvestBnb, harvest, tarpitHarvest, jurassicHarvest } from 'utils/callHelpers'
import { useMasterchef, useSousChef, useTarpit, useJurassicPool } from './useContract'

export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(masterChefContract, farmPid, account)
    dispatch(fetchFarmUserDataAsync(account))
    return txHash
  }, [account, dispatch, farmPid, masterChefContract])

  return { onReward: handleHarvest }
}

export const useTarpitHarvest = (tarpitContract: Contract) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  // const tarpitContract = useTarpit()

  const handleHarvest = useCallback(async () => {
    const txHash = await tarpitHarvest(tarpitContract, account)
    dispatch(updateUserStakedBalanceTarpits(account, tarpitContract._address))
    return txHash
  }, [account, dispatch, tarpitContract])

  return { onReward: handleHarvest }
}

export const useAllHarvest = (farmPids: number[]) => {
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid, account)]
    }, [])

    return Promise.all(harvestPromises)
  }, [account, farmPids, masterChefContract])

  return { onReward: handleHarvest }
}

export const useSousHarvest = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)
  const masterChefContract = useMasterchef()

  const handleHarvest = useCallback(async () => {
    if (sousId === 0) {
      await harvest(masterChefContract, 0, account)
    } else if (isUsingBnb) {
      await soushHarvestBnb(sousChefContract, account)
    } else {
      await soushHarvest(sousChefContract, account)
    }
    dispatch(updateUserPendingReward(sousId, account))
    dispatch(updateUserBalance(sousId, account))
  }, [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId])

  return { onReward: handleHarvest }
}

export const useJurassicHarvest = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const jurassicContract = useJurassicPool(sousId)

  const handleHarvest = useCallback(async () => {
    await jurassicHarvest(jurassicContract, account)
    
    dispatch(updateUserPendingReward(sousId, account))
    dispatch(updateUserBalance(sousId, account))
  }, [account, dispatch,  jurassicContract, sousId])

  return { onReward: handleHarvest }
}
