/* eslint-disable no-await-in-loop */
import { AbiItem } from 'web3-utils'
import tarpitsConfig from 'config/constants/tarpits'
import TarpitsABI from 'config/abi/tarpit.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { fetchLocksTarpits } from 'utils/callHelpers'
import { getAddress } from 'utils/addressHelpers'
import {getTarpitContract} from 'utils/contractHelpers'
import { getWeb3NoAccount } from 'utils/web3'
import BigNumber from 'bignumber.js'


// const web3 = getWeb3NoAccount()
// not needed
// const masterChefContract = new web3.eth.Contract((masterChefABI as unknown) as AbiItem, getMasterChefAddress())

// done
export const fetchTarpitsAllowance = async (account) => {


  const calls = tarpitsConfig.map((tarpitConfig)=> ({
    address: getAddress(tarpitConfig.DINOAddress),
    name: 'allowance',
    params: [account, getAddress(tarpitConfig.contractAddress)],
  }))

  const allowances = await multicall(erc20ABI, calls)

   console.log("GET TARPITS ALLOWANCES", allowances)
  return tarpitsConfig.reduce(
    (acc, pool, index) => ({ ...acc, [getAddress(pool.contractAddress).toString()]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  
  const callsLocked = tarpitsConfig.map((tarpitConfig)=> ({
    address: getAddress(tarpitConfig.contractAddress), // locked
    name: 'getLockedTokens',
    params: [account],
  }))

  const callsUnlocked = tarpitsConfig.map((tarpitConfig)=> ({
    address: getAddress(tarpitConfig.contractAddress), // unlocked
    name: 'getUnlockableTokens',
    params: [account],
  }))

  const DINOBalancesLocked = await multicall(TarpitsABI, callsLocked)
  const DINOBalancesUnlocked = await multicall(TarpitsABI, callsUnlocked)

  // console.log("TYPE OF SERIALIZED BIG NUMBER", typeof (new BigNumber(DINOBalances[0]).toJSON()))

  return tarpitsConfig.reduce(
    (acc, pool, index) => ({ 
      ...acc, 
      [getAddress(pool.contractAddress).toString()]: {
        locked: new BigNumber(DINOBalancesLocked[index]).div(new BigNumber(10).pow(18)).toNumber(), 
        unlocked: new BigNumber(DINOBalancesUnlocked[index]).div(new BigNumber(10).pow(18)).toNumber()
      }
    }),
    {},
  )
  // return { locked: new BigNumber(DINOBalances[0]).div(new BigNumber(10).pow(18)).toNumber(), unlocked: new BigNumber(DINOBalances[1]).div(new BigNumber(10).pow(18)).toNumber() }
}

export const fetchLocks = async (account) => {


  let locks = {}

  for (let i=0; i<tarpitsConfig.length; i++){
    const tarpitConfig = tarpitsConfig[i];
    const tarpitAddress = getAddress(tarpitConfig.contractAddress).toString()
    console.log("TARPIT ADDRESS locks", tarpitAddress, tarpitConfig.contractAddress)

    const thisLocks = await fetchLocksTarpits(getTarpitContract(tarpitAddress), account)
    locks = { 
      ...locks, 
      [getAddress(tarpitConfig.contractAddress).toString()]: (thisLocks || []) 
    }
  }

  console.log("TARPIT LOCKS REUTNR", locks)

 
  return locks
}
