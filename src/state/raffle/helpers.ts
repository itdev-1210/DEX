import { RaffleResponse } from 'state/types'
import { getRaffleContract } from 'utils/contractHelpers'

const raffleContract = getRaffleContract()

const processViewLotterySuccessResponse = (response): RaffleResponse => {
  const {
    drawing,
    lastRaffle,
    raffleDuration,
    winnerCount,
    ticketCount,
    winners,
    totalSupply,
    ticketPrice
  } = response

  return {
    drawing,
    lastRaffle,
    raffleDuration,
    winnerCount,
    ticketCount,
    winners,
    totalSupply,
    ticketPrice
  }
}

const processViewLotteryErrorResponse = (): RaffleResponse => {
  return {
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

export const fetchRaffle = async (account: string): Promise<RaffleResponse> => {
  try {
    const [
      drawing,
      lastRaffle,
      raffleDuration,
      winnerCount,
      ticketCount,
      winners,
      totalSupply,
      ticketPrice
    ] = await Promise.all([
      raffleContract.methods.drawing().call(),
      raffleContract.methods.lastRaffle().call(),
      raffleContract.methods.raffleDuration().call(),
      raffleContract.methods.winnerCount().call(),
      raffleContract.methods.getTickets(account).call(),
      raffleContract.methods.getWinners().call(),
      raffleContract.methods.getPrizePot().call(),
      raffleContract.methods.ticketPrice().call(),
    ])
    return processViewLotterySuccessResponse({
      drawing,
      lastRaffle,
      raffleDuration,
      winnerCount,
      ticketCount,
      winners,
      totalSupply,
      ticketPrice
    })
  } catch (error) {
    console.log(error)
    return processViewLotteryErrorResponse()
  }
}

export const fetchRaffleId = async () => {
  try {
    const raffleCount = await raffleContract.methods.raffleCount().call()
    return {raffleCount}
  } catch (error) {
    return {raffleCount: null}
  }
}
