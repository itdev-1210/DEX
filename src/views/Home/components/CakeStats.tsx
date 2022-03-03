import React from 'react'
import { Card, CardBody, Heading, Text } from '@dinoswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceCakeBusd, usePools, } from 'state/hooks'
import { useTotalSupply, useBurnedBalance, useDinoPerBlock } from 'hooks/useTokenBalance'
import useI18n from 'hooks/useI18n'
import { useGetStats } from 'hooks/stats'
import { getCakeAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width:100%;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const CakeStats = () => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  /* const pools = usePools(account)
  const activeBurned = pools
  .map((pool)=> { return (!pool.isFinished && pool.sousId !== 8 && pool.totalStaked && new BigNumber(pool.totalStaked).toNumber()  > 0) ? new BigNumber(pool.totalStaked).div(new BigNumber(10).pow(18)).toNumber() : 0 })
  .reduce((totalBurned, burnedPerPool)=>{
    return totalBurned + burnedPerPool
  }) */

  const allStats = useGetStats()


  // console.log("ACTIVE BURNED", activeBurned)

  // const totalSupply = useTotalSupply()
  const dinoPerBlock = useDinoPerBlock().div(new BigNumber(10).pow(18)).toNumber() + 2.5 + 0.4
  // const burnedBalance = getBalanceNumber(useBurnedBalance(getCakeAddress())) + activeBurned
  // const cakeSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0
  const DINOprice = usePriceCakeBusd().toNumber()

  console.log("STATS", DINOprice, allStats, dinoPerBlock)

  return (
    <StyledCakeStats>
      <CardBody>
        <div style={{fontSize:30, fontWeight:600, paddingBottom:10}}>
          {TranslateString(534, 'DINO Stats')}
        </div>
        <Row>
          <span style={{marginRight:10}}><Text fontSize="14px">{TranslateString(536, 'Total DINO Supply')}</Text></span>
          { allStats ? <CardValue fontSize="14px" decimals={0} value={allStats ? allStats.total : 0} /> : '---'}
        </Row>
        <Row>
          <span style={{marginRight:10}}><Text fontSize="14px">{TranslateString(536, 'Circulating DINO Supply')}</Text></span>
          { allStats ? <CardValue fontSize="14px" decimals={0} value={allStats ? allStats.circulating : 0} /> : '---'}
        </Row>
        <Row>
          <span style={{marginRight:10}}><Text fontSize="14px">{TranslateString(536, 'Market Cap')}</Text></span>
          { allStats && DINOprice ? <CardValue fontSize="14px" decimals={0} value={allStats && DINOprice ? (allStats.circulating * DINOprice) : 0} prefix="$"/>  : '---'}
        </Row>
        <Row>
          <Text fontSize="14px">{TranslateString(538, 'Total DINO Burned')}</Text>
          { allStats ? <CardValue fontSize="14px" decimals={0} value={allStats ? allStats.burned : 0 } /> : '---'}
        </Row>
        <Row>
          <Text fontSize="14px">{TranslateString(540, 'New DINO/block')}</Text>
          <CardValue fontSize="14px" decimals={2} value={dinoPerBlock} />
        </Row>
        <Row>
          <Text fontSize="14px">{TranslateString(540, 'DINO Price')}</Text>
          <CardValue fontSize="14px" decimals={2} value={DINOprice || 0} prefix="$" />
        </Row>
      </CardBody>
    </StyledCakeStats>
  )
}

export default CakeStats
