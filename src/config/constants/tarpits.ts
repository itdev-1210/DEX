import tokens from './tokens'
import contracts from './contracts'
import { TarpitConfig } from './types'

const tarpits: TarpitConfig[] = [
  {
    DINOAddress: {
    	137: tokens.dino.address[137],
    },
    contractAddress:{
    	137: contracts.tarpit[137],
    }
  },
  {
    DINOAddress: {
      137: tokens.dino.address[137],
    },
    contractAddress:{
      137: contracts.tarpitTwo[137],
    },
    versiontwo:true
  }
]

export default tarpits
