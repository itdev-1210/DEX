/* eslint-disable no-async-promise-executor */
import { useCallback } from 'react'
import { MaticPOSClient } from '@maticnetwork/maticjs'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
// import defaultTokenJson from '../constants/token/pancakeswap.json'
import { useToast } from 'state/hooks'
import useWeb3 from 'hooks/useWeb3'
import {setupNetwork, setupNetworkMainnet} from 'utils/wallet'
import { getWeb3NoAccountEthWS } from 'utils/web3EthWS'


const getMaticPOSClient = (web3) => {
  return new MaticPOSClient({
    network: 'mainnet', // optional, default is testnet
    version: "v1",
    parentProvider: web3,
    maticProvider: web3 // 'https://rpc-mainnet.matic.network' // 'https://rpc-mainnet.maticvigil.com/v1/9898cdbb0d0b7aad453a94dda54f3b296140df10',
  })
}

export const useBridgeApproveFromEth = () => {
  const { account, library } = useWeb3React()
  const maticClient = getMaticPOSClient(library);
  const { toastError, toastSuccess } = useToast()


  const handleApprove = useCallback(
    async (amount: string, token: string) => {
      try {
        await setupNetworkMainnet()
        const maticRes = await maticClient.approveERC20ForDeposit(token, amount.toString(), { from: account });
        // await setupNetwork()
        console.info("MATIC RESULT", maticRes)
        return true
      } catch(e){
        toastError("Approval Error", JSON.stringify(e))
        await setupNetwork()
        console.log("MATIC ", e)
        return false
      }
    },
    [account, maticClient, toastError],
  )

  return { onBridgeApprove: handleApprove }
}

export const useBridgeDepositFromEth = () => {
  const { account, library } = useWeb3React()
  const maticClient = getMaticPOSClient(library);
  const { toastError, toastSuccess } = useToast()

// WE WILL NEED GAS PRICE LOGIC HERE?
  const handleDeposit = useCallback(
    async (amount: string, token:string) => {
      try {
        await setupNetworkMainnet()
        const maticRes = await maticClient.depositERC20ForUser(token, account, amount.toString(), {
          from: account,
          // gasPrice: "20000000000",
        });
        await setupNetwork()
        toastSuccess("Bridge Initiated", "Your ERC20 tokens are being bridged to Polygon via the POS bridge. Please wait 7-10 minutes and your funds will arrive.")
        return true
      } catch (e){
        toastError("Deposit Error", JSON.stringify(e))
        return false
      }
    },
    [account, maticClient, toastError, toastSuccess],
  )

  return { onBridgeDeposit: handleDeposit }
}

// ---------- polygon

export const useBridgeBurnFromPolygon = () => {
  const { account, library } = useWeb3React()
  const maticClient = getMaticPOSClient(library);
  const { toastError, toastSuccess } = useToast()


  const handleBurn = useCallback(
    async (amount: string, token: string) => {
      try {
        await setupNetwork()
        const maticRes = await maticClient.burnERC20(token, amount, { from: account });
        return maticRes
      } catch(e){
        toastError("Burn Error", JSON.stringify(e))
        return false
      }
    },
    [account, maticClient, toastError],
  )

  return { onBridgeBurn: handleBurn }
}

export const useBridgeCheckForReceipt = () => {
  const { toastError, toastSuccess } = useToast()
  const web3 = getWeb3NoAccountEthWS()

// WE WILL NEED GAS PRICE LOGIC HERE?
  const handleCheck = useCallback(
    async (transaction: string, blocknumber: number, tokenAddress: string) => {
      try {
        await setupNetwork()

        const check = async () => {
          return new Promise(async (resolve, reject) => {
            web3.eth.subscribe(
              "logs",
              {
                address: tokenAddress,
              },
              (error, result) => {
                if (error) {
                  console.log("receipt ERR", error)
                  reject(error);
                }

                console.log("ETH data for matic receipt", result);
                if (result && result.data) {
                  const transactionDecoded = web3.eth.abi.decodeParameters(
                    ["uint256", "uint256", "bytes32"],
                    result.data
                  );
                  console.log("TRANSACTION DECODED", transactionDecoded)
                  if (blocknumber <= transactionDecoded["1"]) {
                    resolve(result);
                  }
                }
              }
            );
          })
        }

        await check();
        console.log("FINISHED CHECKING")
        return true

      } catch(e){
        toastError("Receipt Error", JSON.stringify(e))
        return false
      }
    },
    [toastError, web3],
  )

  return { onBridgeCheckForReceipt: handleCheck }
}

export const useBridgeExitFromPolygon = () => {
  const { account, library } = useWeb3React()
  const maticClient = getMaticPOSClient(library);
  const { toastError, toastSuccess } = useToast()

// WE WILL NEED GAS PRICE LOGIC HERE?
  const handleExit = useCallback(
    async (transaction: string) => {
      try {
        await setupNetwork()
        console.log("EXIT TRANS", transaction)
        const maticRes = await maticClient.exitERC20(transaction, {
          from: account,
          // gasPrice: "20000000000",
        });
        toastSuccess("Bridge Initiated", "Your ERC20 tokens are being bridged back to Ethereum via the POS bridge")
        return true
      } catch(e){
        toastError("Exit Error", JSON.stringify(e))
        return false
      }
    },
    [account, maticClient, toastError, toastSuccess],
  )

  return { onBridgeExit: handleExit }
}

export default useBridgeDepositFromEth
