import Web3 from 'web3'
import { WebsocketProviderOptions } from 'web3-core-helpers'

const WSProvider = new Web3.providers.WebsocketProvider("wss://mainnet.infura.io/ws/v3/111d750ade4541a48ae98627b84228e5", { timeout: 10000 } as WebsocketProviderOptions)
const web3NoAccountEthWS = new Web3(WSProvider)

const getWeb3NoAccountEthWS = () => {
  return web3NoAccountEthWS
}

export { getWeb3NoAccountEthWS }
export default web3NoAccountEthWS
