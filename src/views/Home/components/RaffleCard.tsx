import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, Heading, Skeleton, Text } from '@dinoswap/uikit'
import useI18n from 'hooks/useI18n'
import { useGetStats } from 'hooks/api'
import { useRaffle as useRaffleHook, usePriceCakeBusd, useFetchRaffle } from 'state/hooks'
import moment from 'moment'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
  max-width:250px;
  margin:0 auto;
    margin-top:24px;
`

const TotalValueLockedCard = () => {
  const TranslateString = useI18n()
  // const data = useGetStats()
  // const tvl = data ? data.total_value_locked_all.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null
  const [rafftleTVL, setRaffleTVL] = useState(0)
  const [rafftleTTL, setRaffleTTL] = useState("...")
  const { account } = useWeb3React()
  const DINOPrice = usePriceCakeBusd()

  useFetchRaffle()

  const { 
    raffleCount, 
    currentRound
  } = useRaffleHook()

  const {
    drawing, 
    lastRaffle, 
    raffleDuration, 
    winnerCount,
    ticketCount,
    winners,
    totalSupply,
    ticketPrice
  } = currentRound

    const prizeInBusd = new BigNumber(totalSupply).div(new BigNumber(10).pow(18)).times(DINOPrice).toNumber()

    console.log("RAFFLE TVL DISPLAY", prizeInBusd, totalSupply, DINOPrice)
    const endTimeMs = (parseInt(lastRaffle, 10) + parseInt(raffleDuration, 10)) * 1000

  useEffect(() => {

    setRaffleTTL(moment(new Date()).to(moment(new Date(endTimeMs))))

    setRaffleTVL(prizeInBusd)

  }, [prizeInBusd, endTimeMs])



  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Heading size="lg" mb="12px">
          {TranslateString(762, 'Raffle Pot')}
        </Heading>
        {rafftleTVL ? (
          <>
            <Text style={{fontSize:24, lineHeight:"36px", fontWeight:700}}>{`$${(rafftleTVL).toLocaleString(undefined, {maximumFractionDigits: 0})}`}</Text>
            <Text color="textSubtle">Ending {rafftleTTL}</Text>
          </>
        ) : (
          <>
            <Skeleton height={66} />
          </>
        )}
      </CardBody>
    </StyledTotalValueLockedCard>
  )
}

export default TotalValueLockedCard
