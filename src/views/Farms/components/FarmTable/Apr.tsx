 /* eslint-disable no-nested-ternary */
 import React from 'react'
import styled from 'styled-components'
import ApyButton from 'views/Farms/components/FarmCard/ApyButton'
import { Address } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import useI18n from 'hooks/useI18n'

export interface AprProps {
  value: string
  multiplier: string
  lpLabel: string
  tokenAddress?: Address
  quoteTokenAddress?: Address
  cakePrice: BigNumber
  originalValue: number
  hideButton?: boolean
  amm?: string
  liquidityUrl?: string
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};

  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: ${({ theme }) => theme.colors.textSubtle};
      }
    }
  }
`

const AprWrapper = styled.div`
  min-width: 60px;
  text-align: left;
`

const Apr: React.FC<AprProps> = ({
  value,
  lpLabel,
  tokenAddress,
  quoteTokenAddress,
  cakePrice,
  originalValue,
  hideButton = false,
  amm,
  liquidityUrl
}) => {
  const TranslateString = useI18n()
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAddress, tokenAddress })
  const addLiquidityUrl = (amm === "SushiSwap") ? 
      `https://app.sushi.com/add/${liquidityUrlPathParts}`
     : (amm === "QuickSwap") ? 
     `https://quickswap.exchange/#/add/${liquidityUrlPathParts}`
     : (amm === "DFYN") ? 
     `https://exchange.dfyn.network/#/add/${liquidityUrlPathParts}`
     :
     `https://trade.dinoswap.exchange/#/add/${liquidityUrlPathParts}`


     console.log("APR", liquidityUrl, amm)


  return originalValue !== 0 ? (
    <Container>
      { originalValue ? (
        <>
          <AprWrapper>{value}%</AprWrapper>
          {!hideButton && (
            <ApyButton lpLabel={lpLabel} cakePrice={cakePrice} apy={originalValue} addLiquidityUrl={liquidityUrl || addLiquidityUrl} />
          )}
        </>
      ) : (
        <AprWrapper>{TranslateString(656, '---%')}</AprWrapper>
      )  }
    </Container>
  ) : (
    <Container>
      <AprWrapper>{originalValue}%</AprWrapper>
    </Container>
  )
}

export default Apr
