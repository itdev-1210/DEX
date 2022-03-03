/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RaffleState, RaffleResponse } from 'state/types'
import { fetchRaffle, fetchRaffleId } from './helpers'

interface PublicRaffleData {
  raffleCount: string
}

const initialState: RaffleState = {
  raffleCount: null,
  currentRound: {
    drawing: true,
    lastRaffle: null,
    raffleDuration: null,
    winnerCount: null,
    ticketCount: null,
    winners: [],
    totalSupply: null,
    ticketPrice: null
  }
}

export const fetchCurrentRaffleAsync = createAsyncThunk<RaffleResponse, {account: string}>(
  'lottery/fetchCurrentRaffle',
  async ({account}) => {
    const raffleInfo = await fetchRaffle(account)
    return raffleInfo
  },
)
export const fetchCurrentRaffleIdAsync = createAsyncThunk<PublicRaffleData>(
  'raffle/fetchCurrentRaffleId', 
  async () => {
    const raffleCount = await fetchRaffleId()
    return raffleCount
})

export const RaffleSlice = createSlice({
  name: 'Raffle',
  initialState,
  reducers: {
    setRafflePublicData: (state, action) => {
      state = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentRaffleAsync.fulfilled, (state, action: PayloadAction<RaffleResponse>) => {
      state.currentRound = { ...state.currentRound, ...action.payload }
    })
    builder.addCase(fetchCurrentRaffleIdAsync.fulfilled, (state, action: PayloadAction<PublicRaffleData>) => {
      state.raffleCount = action.payload.raffleCount
    })
  },
})

// Actions
export const { setRafflePublicData } = RaffleSlice.actions

export default RaffleSlice.reducer
