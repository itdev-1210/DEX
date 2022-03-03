import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import moment from 'moment';
import { getBalanceNumber } from 'utils/formatBalance'
import useI18n from 'hooks/useI18n'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Flex, MetamaskIcon } from '@dinoswap/uikit'
import Balance from 'components/Balance'
import { CommunityTag, CoreTag, BinanceTag } from 'components/Tags'
import { useBlock } from 'state/hooks'
import { PoolCategory } from 'config/constants/types'
import { registerToken } from 'utils/wallet'
import { BASE_URL } from 'config'

const tags = {
  [PoolCategory.BINANCE]: BinanceTag,
  [PoolCategory.CORE]: CoreTag,
  [PoolCategory.COMMUNITY]: CommunityTag,
}

interface Props {
  projectLink: string
  decimals: number
  totalStaked: BigNumber
  tokenName: string
  tokenAddress: string
  tokenDecimals: number
  startBlock: number
  endBlock: number
  lockBlock: number
  isFinished: boolean
  poolCategory: PoolCategory
  contractAddress?: string
  netDINOStaked: number
}

const StyledFooter = styled.div<{ isFinished: boolean }>`
  border-top: 1px solid ${({ theme }) => (theme.isDark ? '#524B63' : '#E9EAEB')};
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled2' : 'primary2']};
  padding: 24px;
`

const StyledDetailsButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: 0;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  font-weight: 600;
  height: 32px;
  justify-content: center;
  outline: 0;
  padding: 0;
  &:hover {
    opacity: 0.9;
  }

  & > svg {
    margin-left: 4px;
  }
`

const Details = styled.div`
  margin-top: 24px;
`

const Row = styled(Flex)`
  align-items: center;
`

const FlexFull = styled.div`
  flex: 1;
`
const Label = styled.div`
  font-size: 14px;
`
const TokenLink = styled.a`
  font-size: 14px;
  text-decoration: none;
  color: ${(props) => props.theme.colors.primary};
  cursor: pointer;
`

const CardFooter: React.FC<Props> = ({
  projectLink,
  decimals,
  tokenAddress,
  totalStaked,
  tokenName,
  tokenDecimals,
  isFinished,
  startBlock,
  endBlock,
  lockBlock,
  poolCategory,
  contractAddress,
  netDINOStaked,
}) => {
  const { currentBlock } = useBlock()
  const [isOpen, setIsOpen] = useState(false)
  const TranslateString = useI18n()
  const Icon = isOpen ? ChevronUp : ChevronDown

  const handleClick = () => setIsOpen(!isOpen)
  const Tag = tags[poolCategory]

  const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)
  const blocksUntilLock = Math.max(lockBlock - currentBlock, 0)
  const timeRemaining = (blocksRemaining * 2.25)
  const timeUntilLock = (blocksUntilLock * 2.25)
  const timeUntilStart = (blocksUntilStart * 2.25)



  const imageSrc = `${BASE_URL}/images/tokens/${tokenName.toLowerCase()}.png`

  return (
    <StyledFooter isFinished={isFinished}>
      <Row>
        <FlexFull>
          <Tag />
        </FlexFull>
        <StyledDetailsButton onClick={handleClick}>
          {isOpen ? TranslateString(1066, 'Hide') : TranslateString(658, 'Details')} <Icon />
        </StyledDetailsButton>
      </Row>
      {isOpen && (
        <Details>
          <Row mb="4px">
            <FlexFull>
              <Label>
                <span role="img" aria-label="syrup">
                  🦕{' '}
                </span>
                {TranslateString(408, 'Total Extinct DINOs')}
              </Label>
            </FlexFull>
            <Balance fontSize="14px" isDisabled={isFinished} value={netDINOStaked} />
          </Row>
          {blocksUntilStart > 0 && (
            <><Row mb="4px">
              <FlexFull>
                <Label>{TranslateString(1212, 'Blocks Until Start')}:</Label>
              </FlexFull>
              <Balance fontSize="14px" isDisabled={isFinished} value={blocksUntilStart} decimals={0} />
            </Row>
              <Row mb="4px">
                <FlexFull>
                  <Label>{TranslateString(410, '~Time Until Start')}:</Label>
                </FlexFull>
                <div style={{fontSize:14}}>{moment().add(timeUntilStart, 'seconds').toNow(true)}</div>
              </Row>
             </>
          )}
          {blocksUntilStart === 0 && blocksUntilLock > 0 && (
            <>
              <Row mb="4px">
                <FlexFull>
                  <Label>{TranslateString(410, 'Blocks Until Lock')}:</Label>
                </FlexFull>
                <Balance fontSize="14px" isDisabled={isFinished} value={blocksUntilLock} decimals={0} />
              </Row>
              <Row mb="4px">
                <FlexFull>
                  <Label>{TranslateString(410, '~Time Until Lock')}:</Label>
                </FlexFull>
                <div style={{fontSize:14}}>{moment().add(timeUntilLock, 'seconds').toNow(true)}</div>
              </Row>
            </>
          )}
          {blocksUntilStart === 0 && blocksRemaining > 0 && (
            <>
              <Row mb="4px">
                <FlexFull>
                  <Label>{TranslateString(410, 'Blocks Until End')}:</Label>
                </FlexFull>
                <Balance fontSize="14px" isDisabled={isFinished} value={blocksRemaining} decimals={0} />
              </Row>
              <Row mb="4px">
                <FlexFull>
                  <Label>{TranslateString(410, '~Time Until End')}:</Label>
                </FlexFull>
                <div style={{fontSize:14}}>{moment().add(timeRemaining, 'seconds').toNow(true)}</div>
              </Row>
            </>
          )}
          {tokenAddress && (
            <Flex mb="4px">
              <TokenLink onClick={() => registerToken(tokenAddress, tokenName, tokenDecimals, imageSrc)}>
                Add {tokenName} to Metamask
              </TokenLink>
              <MetamaskIcon height={15} width={15} ml="4px" />
            </Flex>
          )}
          { contractAddress && (
            <Flex mb="4px">
              <TokenLink href={`https://polygonscan.com/address/${contractAddress}`} target="_blank">
                View Extinction Pool Contract
              </TokenLink>
            </Flex>
          )}
        </Details>
      )}
    </StyledFooter>
  )
}

export default React.memo(CardFooter)
