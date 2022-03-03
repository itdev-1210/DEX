import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getBep20Contract, getCakeContract, getMasterchefContract, getExtinctionPoolContract } from 'utils/contractHelpers'
import useWeb3 from './useWeb3'
import useRefresh from './useRefresh'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account } = useWeb3React()
  const web3 = useWeb3()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf(account).call()
      setBalance(new BigNumber(res))
    }

    if (account) {
      fetchBalance()
    }
  }, [account, tokenAddress, web3, fastRefresh])

  return balance
}


export const useDinoPerBlock = () => {
  const [dpb, setDpb] = useState(new BigNumber(0))
  // const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchDpb = async () => {
      const contract = getMasterchefContract()
      const res = await contract.methods.dinoPerBlock().call()
      setDpb(new BigNumber(res))
      console.log("GET DINO PER BLOCK")
    }

    fetchDpb()
  }, [setDpb]) // slowRefresh])

  return dpb
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()

  useEffect(() => {
    async function fetchTotalSupply() {
      const cakeContract = getCakeContract()
      const supply = await cakeContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply))
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { slowRefresh } = useRefresh()
  const web3 = useWeb3()

  useEffect(() => {
    const fetchBalance = async () => {
      const pool = getExtinctionPoolContract("0xD5afb53917FC9554a16aB8D3d8fE726846cAef05", web3)
      const poolRes = await pool.methods.dinoSupply().call()

      const contract = getBep20Contract(tokenAddress, web3)
      const res = await contract.methods.balanceOf('0x000000000000000000000000000000000000dEaD').call()
      setBalance(new BigNumber(res).plus(new BigNumber(poolRes)))
    }

    fetchBalance()
  }, [web3, tokenAddress, slowRefresh])

  return balance
}

export default useTokenBalance
