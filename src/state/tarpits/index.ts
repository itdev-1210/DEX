/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import tarpitsConfig from 'config/constants/tarpits'
import { getAddress } from 'utils/addressHelpers'
import fetchTarpitsTotalStaking from './fetchTarpits'
import {
  fetchTarpitsAllowance,
  fetchUserBalances,
  fetchLocks
} from './fetchTarpitsUser'
import { TarpitState, Tarpit } from '../types'



const initialState: TarpitState = { data: [...tarpitsConfig] }

export const TarpitsSlice = createSlice({
  name: 'Tarpits',
  initialState,
  reducers: {
    setTarpitsPublicData: (state, action) => {
      const liveTarpitsData  = action.payload;
      // console.log("LIVE DATA", liveTarpitsData, action.payload)
      state.data = state.data.map((pool) => {
        const liveTarpitData = liveTarpitsData.find((entry) => getAddress(entry.contractAddress).toString() === getAddress(pool.contractAddress).toString())
        return { ...pool, ...liveTarpitData }
      })
    },

    setTarpitsUserData: (state, action) => {
      const UserDataObject = action.payload;
       // console.log("USER DATA OBJECT", UserDataObject, action.payload)
      state.data = state.data.map((pool) => {
        const userTarpitData = UserDataObject.find((entry) => getAddress(entry.contractAddress).toString() === getAddress(pool.contractAddress).toString())
        // console.log("FOUND TARPIT DATA?", userTarpitData)
        return { ...pool, userData: userTarpitData }
      })
    },

    updateTarpitsUserData: (state, action) => {
      const { field, value, contractAddress } = action.payload;
      const index = state.data.findIndex((p) => getAddress(p.contractAddress).toString() === contractAddress)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
    },
  },
})

// Actions
export const { setTarpitsPublicData, setTarpitsUserData, updateTarpitsUserData } = TarpitsSlice.actions

// Thunks
export const fetchTarpitsPublicDataAsync = () => async (dispatch) => {
  const totalStaking = await fetchTarpitsTotalStaking()
  console.log("TARPITS TOTAL STAKING", totalStaking)

  dispatch(setTarpitsPublicData(totalStaking))
}

export const fetchTarpitsUserDataAsync = (account) => async (dispatch) => {
  const allowances = await fetchTarpitsAllowance(account)
  // console.log("allowances tarpits", allowance)
  const stakingTokenBalances = await fetchUserBalances(account)
  // console.log("balances tarpits", stakingTokenBalance)
  const locks = await fetchLocks(account)



  // console.log("TOTALS TARPITS", totalRewards, totalDeposits)
   console.log("locks tarpits", locks)

  const userData = tarpitsConfig.map((tarpit) => {

    let totalRewards = 0;
    let totalDeposits = 0;
    const thisLocks = locks[getAddress(tarpit.contractAddress).toString()]
    if (thisLocks){
      for (let i=0; i< thisLocks.length; i++){
        // console.log("LOCKS add totals", locks[i])
        if (!thisLocks[i].claimed){
          totalRewards += parseFloat(thisLocks[i].reward)
          totalDeposits += parseFloat(thisLocks[i].amount)
        }
      }
    }

    return {
      contractAddress: tarpit.contractAddress,
      allowance: allowances[getAddress(tarpit.contractAddress).toString()],
      stakingTokenBalance: stakingTokenBalances[getAddress(tarpit.contractAddress).toString()],
      locks: locks[getAddress(tarpit.contractAddress).toString()],
      totalRewards,
      totalDeposits,
    }
  })

console.log("USER DATA TARPITS", userData)

  dispatch(setTarpitsUserData(userData))
}

export const updateUserAllowanceTarpits = (account: string, contractAddress:any) => async (dispatch) => {
  const allowance = await fetchTarpitsAllowance(account)
  dispatch(updateTarpitsUserData({ field: 'allowance', value: allowance, contractAddress }))
}

export const updateUserStakedBalanceTarpits = (account: string, contractAddress:any) => async (dispatch) => {
  console.log("CONTRACT ADDRESS PASSED TO TARPITS UPDATE", contractAddress)
  const stakedBalances = await fetchUserBalances(account)
  dispatch(updateTarpitsUserData({ field: 'stakedBalance', value: stakedBalances, contractAddress }))
}

export default TarpitsSlice.reducer
