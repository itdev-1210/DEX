import { useEffect, useState } from 'react'
import farms from 'config/constants/farms'
import tokens from 'config/constants/tokens'
import contracts from 'config/constants/contracts'
import { getBep20Contract } from "utils/contractHelpers"
import BigNumber from 'bignumber.js'
/*
 * Due to Cors the api was forked and a proxy was created
 * @see https://github.com/pancakeswap/gatsby-pancake-api/commit/e811b67a43ccc41edd4a0fa1ee704b2f510aa0ba
 */


/* eslint-disable camelcase */

export interface TradePair {
  swap_pair_contract?: string
  base_symbol?: string
  quote_symbol?: string
  last_price?: number
  base_volume_24_h?: number
  quote_volume_24_h?: number
}

export interface ApiStatResponse {
  update_at?: string
  '24h_total_volume'?: number
  total_value_locked?: number
  total_value_locked_all?: number
  trade_pairs?: {
    [key: string]: TradePair
  }
}

export const useGetStats = () => {
  const [data, setData] = useState<ApiStatResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {

        /*
         for (let i=0; i< farms.length; i++){
           if (farms[i].quoteToken === tokens.usdc || farms[i].quoteToken === tokens.usdt || farms[i].quoteToken === tokens.mimatic){
             console.log("calculating tVL, USD farm")
              const CollateralContract = getBep20Contract(farms[i].quoteToken.address[137], web3)
              const CollateralBalance = await contract.methods.balanceOf(farms[i].lpAddresses[137]).call()
              console.log("USD collateral balance", CollateralBalance)
              const LPContract = getBep20Contract(farms[i].lpAddresses[137], web3)
              const LPAmountTotal = await LPContract.methods.totalSupply().call()
              const LPAmountMasterchef = await LPContract.methods.balanceOf(contracts.masterChef[137]).call()
              const dollarValueLPTotal = new BigNumber(CollateralBalance).div(new BigNumber(10).pow(farms[i].quoteToken.decimals)).times(2)
              const locked = dollarValueLPTotal.times(new BigNumber(LPAmountMasterchef).div(new BigNumber(LPAmountTotal)))
              console.log("LOCKED", locked.toNumber())


           } else if (farms[i].quoteToken === tokens.weth){
             console.log("calculating tVL, weth farm")
           }
         }
         */
        // setData(responsedata)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    // ... do more functions for tarpits and pools

    fetchData()
  }, [setData])

  return data
}
