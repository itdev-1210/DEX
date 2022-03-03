import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { fetchCurrentRaffleAsync, fetchCurrentRaffleIdAsync } from 'state/actions'
import { buyTicket, pickWinner, disburseWinner } from 'utils/callHelpers'
import { useRaffle as useRaffleContract } from './useContract'

const useRaffle = () => {
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const raffleContract = useRaffleContract()

  const handleBuyTicket = useCallback(
    async (amount: string) => {
      const txHash = await buyTicket(raffleContract, account, amount)
      dispatch(fetchCurrentRaffleIdAsync())
      dispatch(fetchCurrentRaffleAsync)
      console.info(txHash)
    },
    [account, dispatch, raffleContract],
  )

  const handlePickWinner = useCallback(
    async () => {
      const txHash1 = await pickWinner(raffleContract, account)
      const randomCountInit = await raffleContract.methods.randomCount().call()
      const raffleCountInit = await raffleContract.methods.raffleCount().call()
      if (randomCountInit > raffleCountInit){
        const txHash2 = await disburseWinner(raffleContract, account)
        dispatch(fetchCurrentRaffleIdAsync())
        dispatch(fetchCurrentRaffleAsync)
      } else {
        let called = false;
        const interval = setInterval(async () => {
          const randomCount = await raffleContract.methods.randomCount().call()
          const raffleCount = await raffleContract.methods.raffleCount().call()
          console.log("CHECK FOR DISBURSE", called, randomCount , raffleCount)
          if (randomCount > raffleCount && !called){
            called=true;
            const txHash2 = await disburseWinner(raffleContract, account)
            dispatch(fetchCurrentRaffleIdAsync())
            dispatch(fetchCurrentRaffleAsync)
            console.info(txHash2)
            clearInterval(interval)
          }
        }, 1000)
      }
    },
    [account, dispatch, raffleContract],
  )

  return { 
    onBuyTicket: handleBuyTicket,
    onPickWinner: handlePickWinner
  }
  
}

export default useRaffle
