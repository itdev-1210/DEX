import { configureStore } from '@reduxjs/toolkit'
import farmsReducer from './farms'
import toastsReducer from './toasts'
import poolsReducer from './pools'
import pricesReducer from './prices'
import blockReducer from './block'
import tarpitsReducer from './tarpits'
import jurassicReducer from './jurassicpools'
import raffleReducer from './raffle'

export default configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    farms: farmsReducer,
    toasts: toastsReducer,
    pools: poolsReducer,
    prices: pricesReducer,
    block: blockReducer,
    tarpits: tarpitsReducer,
    jurassicpools: jurassicReducer,
    raffle: raffleReducer,
  },
})
