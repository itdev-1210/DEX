/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PriceApiResponse, PriceState } from 'state/types'
import BigNumber from 'bignumber.js'
import { getBep20Contract, getCakeContract } from '../../utils/contractHelpers'
import { getWeb3NoAccount } from '../../utils/web3'

const initialState: PriceState = {
  isLoading: false,
  lastUpdated: null,
  data: null,
}

const supportedTokens = [
  "xmark",
  "aavegotchi",
  "quick",
  "ethereum",
  "matic-network",
  "usd-coin",
  "tether",
  "sx-network",
  "dfyn-network",
  "bella-protocol",
  "chain-guardians",
  "dinoswap",
  "terrausd",
  "arpa-chain",
  "saffron-finance",
  "route",
  "decentral-games",
  "force-protocol",
  "dinox",
  "orbs",
  "the-employment-commons-work-token",
  "sifchain",
  "cosmos",
  "iris-network",
  "akash-network",
  "persistence",
  "regen",
];
const supportedTokensToTicker = {
  "xmark":"xmark",
  "aavegotchi":"ghst",
  "quick":"quick",
  "ethereum":"eth",
  "matic-network":"matic",
  "usd-coin":"usdc",
  "tether":"usdt",
  "sx-network":"sx",
  "dfyn-network":"dfyn",
  "bella-protocol":"bel",
  "chain-guardians":"cgg",
  "dinoswap":"dino",
  "terrausd":"ust",
  "arpa-chain": "arpa",
  "saffron-finance":"sfi",
  "route":"route",
  "decentral-games":"dg",
  "force-protocol":"for",
  "dinox" : "dnxc",
  "orbs":"orbs",
  "the-employment-commons-work-token":"work",
  "sifchain" : "erowan",
  "cosmos":"atom",
  "iris-network":"iris",
  "akash-network":"akt",
  "persistence":"xprt",
  "regen":"regen",



};

/* const GetDinoDEXPrice = async() => {
  try {
    const web3 = getWeb3NoAccount()
    // console.log("GET DINO PRICE1")
    const USDCcontract = getBep20Contract('0x2791bca1f2de4661ed88a30c99a7a9449aa84174', web3)
    // console.log("GET DINO PRICE2")
    const USDCres = await USDCcontract.methods.balanceOf('0x3324af8417844e70b81555a6d1568d78f4d4bf1f').call()
    // console.log("GET DINO PRICE3")
    const DINOcontract = getBep20Contract('0xaa9654becca45b5bdfa5ac646c939c62b527d394', web3)
    const DINOres = await DINOcontract.methods.balanceOf('0x3324af8417844e70b81555a6d1568d78f4d4bf1f').call()
    // console.log("PRICEEEE", DINOres, USDCres, ((new BigNumber(USDCres).div(new BigNumber(10).pow(6)).toNumber()) / (new BigNumber(DINOres).div(new BigNumber(10).pow(18)).toNumber())))
    return (new BigNumber(USDCres).div(new BigNumber(10).pow(6)).toNumber()) / (new BigNumber(DINOres).div(new BigNumber(10).pow(18)).toNumber())
    // return DINOres
  } catch(e){
    console.log("PRICES DEX ERR", e)
    return 0
  }
} */ 
// Thunks
export const fetchPrices = createAsyncThunk<PriceApiResponse>('prices/fetch', async () => {
  const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${supportedTokens.join(",")}&vs_currencies=usd`)
  const data = (await response.json()) as PriceApiResponse
  /* let DINOprice = await GetDinoDEXPrice()
  if (DINOprice <=0){
    DINOprice = await GetDinoDEXPrice()
  } */
  // console.log("PRICE DATA", data, DINOprice)
  // Return normalized token names
  const normalized = {
    update_at: (new Date()).toISOString(),
    prices: Object.keys(data).reduce((accum, token) => {
      return {
        ...accum,
        [supportedTokensToTicker[token.toLowerCase()]]: data[token].usd,
      }
    }, {mimatic:1, testd:1, mai:1}), // TEMPORARY PUT DINO HERE UNTIL WE GET ON COINGECKO
  }
  // normalized.prices.dino = DINOprice

   console.log("normalized prices", normalized)
  return normalized;
})

export const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPrices.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchPrices.fulfilled, (state, action: PayloadAction<PriceApiResponse>) => {
      state.isLoading = false
      state.lastUpdated = action.payload.update_at
      state.data = action.payload.prices
    })
  },
})

export default pricesSlice.reducer
