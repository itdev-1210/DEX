import React from 'react'
import { Text } from '@dinoswap/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import useAllEarnings from 'hooks/useAllEarnings'
import { usePriceCakeBusd } from 'state/hooks'
import styled from 'styled-components'
import CardValue from './CardValue'
import CardBusdValue from './CardBusdValue'

const Block = styled.div`
  margin-bottom: 24px;
}
`

const CakeHarvestBalance = () => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const allEarnings = useAllEarnings()
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const DINOprice = usePriceCakeBusd().toNumber()
  const earningsBusd = new BigNumber(earningsSum).multipliedBy(new BigNumber(DINOprice)).toNumber()
  // console.log("get earnings", earningsSum, usePriceCakeBusd())
  if (!account) {
    return (
      <Text color="textDisabled" style={{ lineHeight: '36px' }}>
        {TranslateString(298, 'Locked')}
      </Text>
    )
  }

  return (
    <Block>
      <CardValue value={earningsSum} lineHeight="36px" />
      <CardValue fontSize="14px" lineHeight="1.1" color="textSubtle" prefix="~$" bold={false} decimals={6} value={earningsBusd} />
    </Block>
  )
}

export default CakeHarvestBalance
