import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'

const httpProvider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/111d750ade4541a48ae98627b84228e5", { timeout: 10000 } as HttpProviderOptions)
const web3NoAccountEth = new Web3(httpProvider)

const getWeb3NoAccountEth = () => {
  return web3NoAccountEth
}

export { getWeb3NoAccountEth }
export default web3NoAccountEth
