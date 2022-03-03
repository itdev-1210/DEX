import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Card, CardBody, Heading, Skeleton, Text } from '@dinoswap/uikit'
import useI18n from 'hooks/useI18n'
import { useGetStats } from 'hooks/api'
import { useFarms, usePriceCakeBusd, useGetApiPrices, useTarpits, usePools, useJurassicPools } from 'state/hooks'

const StyledTotalValueLockedCard = styled(Card)`
  align-items: center;
  display: flex;
  flex: 1;
`

const TotalValueLockedCard = () => {
  const TranslateString = useI18n()
  // const data = useGetStats()
  // const tvl = data ? data.total_value_locked_all.toLocaleString('en-US', { maximumFractionDigits: 0 }) : null
  const [tvl, setTVL] = useState(0)
  const farms = useFarms()
  const prices = useGetApiPrices()
  const { account } = useWeb3React()
  const tarpits = useTarpits(account)
  const DINOPrice = usePriceCakeBusd()

  const pools = usePools(account)
  const newPools = pools.filter((p) => p.sousId !== 1)
  const jurassicPools = useJurassicPools(account)

  useEffect(() => {


    let alltvl =0;

    for (let i=0; i<farms.length; i++){
      const farm = farms[i]

      console.log("TVL FARM", farm)
      if (farm.lpTotalInQuoteToken && prices) {

        const quoteTokenPriceUsd = prices[farm.quoteToken.symbol.toLowerCase().replace("wmatic", "matic")]
        const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(quoteTokenPriceUsd)
        console.log("TVL FARM 2", totalLiquidity.toNumber(), quoteTokenPriceUsd, tvl, (tvl + totalLiquidity.toNumber()))
        if (totalLiquidity.toNumber() > 0 ){
          alltvl += totalLiquidity.toNumber()
        }
      }
    }

    for (let i=0; i<newPools.length; i++){
      const extinctionPool = newPools[i]
      const DINOStaked = extinctionPool.dinoPoolStaked || extinctionPool.totalStaked
      console.log("EXTINCTION POOL GET TOTAL DINO STAKED", extinctionPool, DINOStaked)
      const USDStaked = new BigNumber(DINOStaked).div(new BigNumber(10).pow(18)).toNumber() * DINOPrice.toNumber()
      alltvl += USDStaked
      
    }

    for (let i=0; i<jurassicPools.length; i++){
      const jurassicPool = jurassicPools[i]
      const DINOStaked = jurassicPool.totalStaked
      console.log("JURASSIC POOL GET TOTAL DINO STAKED", jurassicPool, DINOStaked)
      const USDStaked = new BigNumber(DINOStaked).div(new BigNumber(10).pow(18)).toNumber() * DINOPrice.toNumber()
      alltvl += USDStaked
    }

    for (let i=0; i<tarpits.length; i++){
      const tarpit = tarpits[i]
      const DINOStaked = tarpit.totalStaked
      console.log("TARPIT GET TOTAL DINO STAKED", tarpit, DINOStaked)
      const USDStaked = new BigNumber(DINOStaked).div(new BigNumber(10).pow(18)).toNumber() * DINOPrice.toNumber()
      alltvl += USDStaked
    }

    console.log("SETTING TVL", alltvl)
    setTVL(parseInt(alltvl.toFixed(0)))

  }, [farms, prices, tvl, setTVL, newPools, jurassicPools, DINOPrice, tarpits])



  return (
    <StyledTotalValueLockedCard>
      <CardBody>
        <Heading size="lg" mb="24px">
          {TranslateString(762, 'Total Value Locked (TVL)')}
        </Heading>
        {tvl ? (
          <>
            <Text style={{fontSize:24, lineHeight:"36px", fontWeight:700}}>{`$${(tvl).toLocaleString(undefined, {maximumFractionDigits: 0})}`}</Text>
            <Text color="textSubtle">{TranslateString(764, 'Across all Fossil Farms, Extinction Pools, Jurassic Pools and Tarpits')}</Text>
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
