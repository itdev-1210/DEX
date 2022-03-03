import { useEffect, useMemo, useContext } from 'react'
import BigNumber from 'bignumber.js'
import { kebabCase } from 'lodash'
import { useWeb3React } from '@web3-react/core'
import { Toast, toastTypes } from '@dinoswap/uikit'
import { useSelector, useDispatch } from 'react-redux'
import { Team } from 'config/constants/types'
import { getWeb3NoAccount } from 'utils/web3'
import useRefresh from 'hooks/useRefresh'
import { ThemeContext } from 'contexts/ThemeContext'
import {
  fetchFarmsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchJurassicPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchJurassicPoolsUserDataAsync,
  fetchTarpitsPublicDataAsync,
  fetchTarpitsUserDataAsync,
  fetchCurrentRaffleAsync,
  fetchCurrentRaffleIdAsync,
  push as pushToast,
  remove as removeToast,
  clear as clearToast,
  setBlock,
} from './actions'
import { State, Farm, Pool, Tarpit, ProfileState, TeamsState, AchievementState, PriceState, RaffleState } from './types'
import { fetchPrices } from './prices'

export const useFetchPublicData = () => {
  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync())
    dispatch(fetchPoolsPublicDataAsync())
    dispatch(fetchJurassicPoolsPublicDataAsync())
    dispatch(fetchTarpitsPublicDataAsync())
  }, [dispatch, slowRefresh])

  useEffect(() => {
    const web3 = getWeb3NoAccount()

      const loadInitBlock = async () => {
        const blockNumber = await web3.eth.getBlockNumber()
        dispatch(setBlock(blockNumber))
      }
      loadInitBlock()

    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(setBlock(blockNumber))
    }, 3000)

    return () => clearInterval(interval)
  }, [dispatch])
}

// Tarpits

export const useTarpits = (account): Tarpit[] => {


  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchTarpitsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const tarpits = useSelector((state: State) => state.tarpits.data)
  // console.log("TARPITS", tarpits)
  return tarpits

}

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)
  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : new BigNumber(0),
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : new BigNumber(0),
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : new BigNumber(0),
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : new BigNumber(0),
  }
}




// jurasic pools

export const useJurassicPools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchJurassicPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.jurassicpools.data)

  console.log("POOLS", pools)
  return pools
}

export const useJurassicPoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.jurassicpools.data.find((p) => p.sousId === sousId))
  return pool
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)

  console.log("POOLS", pools)
  return pools
}

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return pool
}

// Raffle
export const useRaffle = () => {
  const currentRound = useSelector((state: State) => state.raffle.currentRound)
  const raffleCount = useSelector((state: State) => state.raffle.raffleCount)

  return {
    raffleCount,
    currentRound
  }
}

export const useFetchRaffle = () => {
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const dispatch = useDispatch()

  useEffect(() => {
    if (account) {
      // get current raffle ID
      dispatch(fetchCurrentRaffleIdAsync())
    }
  }, [dispatch, account])

  useEffect(() => {
    if (account) {
      // get public data for current lottery
      dispatch(fetchCurrentRaffleAsync({account}))
    }
  }, [dispatch, fastRefresh, account])
}

// Toasts
export const useToast = () => {
  const dispatch = useDispatch()
  const helpers = useMemo(() => {
    const push = (toast: Toast) => dispatch(pushToast(toast))

    return {
      toastError: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.DANGER, title, description })
      },
      toastInfo: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.INFO, title, description })
      },
      toastSuccess: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.SUCCESS, title, description })
      },
      toastWarning: (title: string, description?: string) => {
        return push({ id: kebabCase(title), type: toastTypes.WARNING, title, description })
      },
      push,
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    }
  }, [dispatch])

  return helpers
}


// Prices
export const useFetchPriceList = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()
   console.log("FTECHING PRICES")
  useEffect(() => {
    dispatch(fetchPrices())
  }, [dispatch, slowRefresh])
}

export const useGetApiPrices = () => {
  const prices: PriceState['data'] = useSelector((state: State) => state.prices.data)
  return prices
}

export const useGetApiPrice = (token: string) => {
  const prices = useGetApiPrices()

  if (!prices) {
    return null
  }

  return prices[token.toLowerCase()]
}

export const usePriceCakeBusd = (): BigNumber => {
  const prices = useGetApiPrices() || {}

  console.log("DINO PRICE hook", prices.dino)
  /* const cakeBnbFarm = useFarmFromPid(1)
  const bnbBusdFarm = useFarmFromPid(2)

  const bnbBusdPrice = bnbBusdFarm.tokenPriceVsQuote ? new BigNumber(1).div(bnbBusdFarm.tokenPriceVsQuote) : ZERO
  const cakeBusdPrice = cakeBnbFarm.tokenPriceVsQuote ? bnbBusdPrice.times(cakeBnbFarm.tokenPriceVsQuote) : ZERO
*/
  // return new BigNumber(1000000000); // cakeBusdPrice

  return new BigNumber(prices.dino);
}

// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}
