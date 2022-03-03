import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import web3NoAccount from 'utils/web3'
import { poolsConfig, jurassicPoolsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'

// Addresses
import {
  getAddress,
  getCakeAddress,
  getMasterChefAddress,
  getTarpitAddress,
  getRaffleAddress,
} from 'utils/addressHelpers'

// ABI
import profileABI from 'config/abi/pancakeProfile.json'
import pancakeRabbitsAbi from 'config/abi/pancakeRabbits.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'
import bep20Abi from 'config/abi/erc20.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import cakeAbi from 'config/abi/cake.json'
import ifoAbi from 'config/abi/ifo.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import lotteryAbi from 'config/abi/lottery.json'
import lotteryTicketAbi from 'config/abi/lotteryNft.json'
import masterChef from 'config/abi/masterchef.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import tarpit from 'config/abi/tarpit.json'
import tarpitv2 from 'config/abi/tarpitv2.json'
import extinctionPoolAbi from 'config/abi/pool.json'
import jurassicPoolAbi from 'config/abi/jurassicpool.json'
import raffleAbi from 'config/abi/raffle.json'

const getContract = (abi: any, address: string, web3?: Web3) => {
  const _web3 = web3 ?? web3NoAccount
  return new _web3.eth.Contract((abi as unknown) as AbiItem, address)
}

export const getExtinctionPoolContract = (address: string, web3?: Web3) => {
  return getContract(extinctionPoolAbi, address, web3)
}
export const getBep20Contract = (address: string, web3?: Web3) => {
  return getContract(bep20Abi, address, web3)
}
export const getLpContract = (address: string, web3?: Web3) => {
  return getContract(lpTokenAbi, address, web3)
}
export const getSouschefContract = (id: number, web3?: Web3) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  return getContract(abi, getAddress(config.contractAddress), web3)
}
export const getCakeContract = (web3?: Web3) => {
  return getContract(cakeAbi, getCakeAddress(), web3)
}
export const getMasterchefContract = (web3?: Web3) => {
  return getContract(masterChef, getMasterChefAddress(), web3)
}
export const getTarpitContractNew = (address: string, web3?: Web3,) => {
  return getContract(tarpitv2, address, web3)
}
export const getTarpitContract = (address: string, web3?: Web3,) => {
  return getContract(tarpit, address, web3)
}
export const getJurassicPoolContract  = (id: number, web3?: Web3) => {
  const config = jurassicPoolsConfig.find((pool) => pool.sousId === id)
  return getContract(jurassicPoolAbi, getAddress(config.contractAddress), web3)
}
export const getRaffleContract = (web3?: Web3) => {
  return getContract(raffleAbi, getRaffleAddress(), web3)
}