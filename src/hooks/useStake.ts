import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { Contract } from 'web3-eth-contract'
import { fetchFarmUserDataAsync, updateUserStakedBalance, updateUserStakedBalanceTarpits, updateUserBalance, updateUserBalanceJurassic, updateUserStakedBalanceJurassic } from 'state/actions'
import { stake, sousStake, sousStakeBnb, stakeTarpits, stakeTarpitsNew, jurassicStake } from 'utils/callHelpers'
import { useMasterchef, useSousChef, useTarpit, useJurassicPool } from './useContract'

const useStake = (pid: number) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(masterChefContract, pid, amount, account)
      dispatch(fetchFarmUserDataAsync(account))
      console.info(txHash)
    },
    [account, dispatch, masterChefContract, pid],
  )

  return { onStake: handleStake }
}

export const useTarpitStake = (tarpitContract: Contract) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  // const tarpitContract = useTarpit()
  const handleStake = useCallback(
    async (amount: string, length: number, id: number) => {
      console.log("TARPIT CONTRACT is", tarpitContract)
      if (id){
        const txHash = await stakeTarpitsNew(tarpitContract, length, amount, id, account)
        dispatch(updateUserStakedBalanceTarpits(account, tarpitContract._address))
        console.info(txHash)
      } else {
        const txHash = await stakeTarpits(tarpitContract, length, amount, account)
        dispatch(updateUserStakedBalanceTarpits(account, tarpitContract._address))
        console.info(txHash)
      }
    },
    [account, dispatch, tarpitContract],
  )

  return { onStake: handleStake }
}

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account)
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account)
      } else {
        await sousStake(sousChefContract, amount, decimals, account)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    },
    [account, dispatch, isUsingBnb, masterChefContract, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export const useJurassicStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useJurassicPool(sousId)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      await jurassicStake(sousChefContract, amount, decimals, account)
      dispatch(updateUserStakedBalanceJurassic(sousId, account))
      dispatch(updateUserBalanceJurassic(sousId, account))
    },
    [account, dispatch, sousChefContract, sousId],
  )

  return { onStake: handleStake }
}

export default useStake
