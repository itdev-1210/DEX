import addresses from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const mainNetChainId = 137
  const chainId = process.env.REACT_APP_CHAIN_ID
  return address[chainId] ? address[chainId] : address[mainNetChainId]
}

export const getCakeAddress = () => {
  return getAddress(tokens.dino.address)
}
export const getMasterChefAddress = () => {
  return getAddress(addresses.masterChef)
}
export const getTarpitAddress = () => {
  return getAddress(addresses.tarpit)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
export const getWbnbAddress = () => {
  return getAddress(tokens.wmatic.address)
}
export const getRaffleAddress = () => {
  return getAddress(addresses.raffle)
}