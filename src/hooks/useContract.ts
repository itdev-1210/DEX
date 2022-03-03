import { useMemo } from 'react'
import useWeb3 from 'hooks/useWeb3'
import {
  getBep20Contract,
  getCakeContract,
  getMasterchefContract,
  getSouschefContract,
  getTarpitContract,
  getJurassicPoolContract,
  getRaffleContract
} from 'utils/contractHelpers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */


export const useERC20 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getBep20Contract(address, web3), [address, web3])
}

export const useCake = () => {
  const web3 = useWeb3()
  return useMemo(() => getCakeContract(web3), [web3])
}


export const useMasterchef = () => {
  const web3 = useWeb3()
  return useMemo(() => getMasterchefContract(web3), [web3])
}

export const useSousChef = (id) => {
  const web3 = useWeb3()
  return useMemo(() => getSouschefContract(id, web3), [id, web3])
}

export const useJurassicPool = (id) => {
  const web3 = useWeb3()
  return useMemo(() => getJurassicPoolContract(id, web3), [id, web3])
}

export const useTarpit = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getTarpitContract(address, web3), [address, web3])
}

export const useRaffle = () => {
  const web3 = useWeb3()
  return useMemo(() => getRaffleContract(web3), [web3])
}