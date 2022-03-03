import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Flex, Heading, Text, Skeleton, Box, Button, useModal } from '@dinoswap/uikit'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import tokensConfig from 'config/constants/tokens'

import useTheme from 'hooks/useTheme'
import useSidebar from 'hooks/useSidebar'
import useI18n from 'hooks/useI18n'
import { useCake } from 'hooks/useContract'
import { useIfoAllowance } from 'hooks/useAllowance'
import { useIfoApprove } from 'hooks/useApprove'
import useTokenBalance from 'hooks/useTokenBalance'
import useRaffle from 'hooks/useRaffle'
import { usePriceCakeBusd, useRaffle as useRaffleHook, useFetchRaffle } from 'state/hooks'


import { getRaffleAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from 'utils/formatBalance'

import Page from 'components/layout/Page'
import Balance from 'components/Balance'

import Card from './components/Card'
import CardTitle from './components/CardTitle'
import CardContent from './components/CardContent'
import PickWinnerButton from './components/PickWinnerButton'
import DepositModal from './components/DepositModal'
import { dateTimeOptions } from './helpers'

const Raffle: React.FC = () => {
  useFetchRaffle()
  
  const [pendingTx, setPendingTx] = useState(false)

  const { isDark } = useTheme();
  const { selectedSidebar } = useSidebar();
  const { account } = useWeb3React()
  const dinoContract = useCake()
  const allowance = useIfoAllowance(dinoContract, getRaffleAddress(), pendingTx)
  const TranslateString = useI18n()

  const onApprove = useIfoApprove(dinoContract, getRaffleAddress())

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
  
  const dinoTokenBalance = useTokenBalance(tokensConfig.dino.address[137])

  const { onBuyTicket } = useRaffle()

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={dinoTokenBalance}
      onConfirm={onBuyTicket}
      tokenName="DINO"
      stakingTokenDecimals={18}
    />,
  )

  const originalWinners = ['0x33d01d44f424296aa53d3d6f1029da0d215aa4c5', '0x0b8a97a036bcc47707a11231362435e937f35536']

  const DINOPrice = usePriceCakeBusd()
  const prizeInBusd = new BigNumber(totalSupply).times(DINOPrice)
  const endTimeMs = (parseInt(lastRaffle, 10) + parseInt(raffleDuration, 10)) * 1000
  const endDate = new Date(endTimeMs)
  const ticketDisabled = drawing === true
  const prize = (!winnerCount || parseInt(winnerCount, 10) === 0)
     ? new BigNumber(0) : new BigNumber(totalSupply).dividedBy(new BigNumber(parseInt(winnerCount, 10)))

  const getPrizeBalances = () => {
    return (
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton my="7px" height={40} width={160} />
        ) : (
          <Balance
            fontSize="36px"
            color="secondary"
            prefix="~$"
            value={getBalanceNumber(prizeInBusd)}
            decimals={0}
          />
        )}
        {prizeInBusd.isNaN() ? (
          <Skeleton my="2px" height={14} width={90} />
        ) : (
          <Balance
            fontSize="14px"
            color="textSubtle"
            unit=" DINO"
            value={getBalanceNumber(new BigNumber(totalSupply))}
            decimals={0}
          />
        )}
      </>
    )
  }
  const getNextDrawId = () => {
    if (account) {
      return `#${parseInt(raffleCount, 10) + 1} | `
    }
    return ''
  }

  const getNextDrawDateTime = () => {
      return (lastRaffle) ? `${TranslateString(736, 'Draw')}: ${endDate.toLocaleString(undefined, dateTimeOptions)}` : "---"
  }

  const handleApprove = useCallback(async () => {
    setPendingTx(true)
    try {
      await onApprove()
      setPendingTx(false)
    } catch (err) {
      console.log(err)
      setPendingTx(false)
    }
  }, [setPendingTx, onApprove])

  return (
    <BackgroundContainer dark={isDark} bgimage={isDark ? "/images/bgdarkraffle.jpg" : "/images/bglightraffle.jpg"} bgPos={ selectedSidebar ? 'calc(50% - 120px) 100px' : 'calc(50% - 23px) 100px'}>
      <Page>
        <Card isActive>
          <div style={{ padding: '24px' }}>
            <CardTitle>
              <StyledDetails>
                <Heading mr="12px">{TranslateString(736, 'Next Draw')}</Heading>
                <Text>{`${getNextDrawId()}`}{`${getNextDrawDateTime()}`}</Text>
              </StyledDetails>
              <StyledDetails>
                <Heading mr="12px">{TranslateString(736, 'Previous Winners')}</Heading>
                <div>
                {winners.length > 0 ? 
                    (winners.map((winner) => <Winners >
                      <a href={`https://polygonscan.com/address/${winner}`}> <span style={{paddingRight: "12px"}}>{`${winner.substring(0, 6)}...${winner.substring(winner.length - 4)}`}</span> </a>
                    </Winners>))
                  :
                    (originalWinners.map((winner) => <Winners >
                      <a href={`https://polygonscan.com/address/${winner}`}> <span style={{paddingRight: "12px"}}>{`${winner.substring(0, 6)}...${winner.substring(winner.length - 4)}`}</span></a>
                    </Winners>))
                }
                </div>
              </StyledDetails>
            </CardTitle>
            <Divider />

            <CardContent>
              <Wrapper>
                <Flex justifyContent={['center', null, null, 'flex-start']}>
                  <Heading mr="12px">{TranslateString(736, 'Prize Pot')}</Heading>
                </Flex>
                <Flex flexDirection="column" mb="18px">
                  {getPrizeBalances()}
                </Flex>
              </Wrapper>
              {account && (<>
                <Box display={['none', null, null, 'flex']} mb="6px">
                  <Heading>{TranslateString(736, 'Your tickets')}</Heading>
                </Box>
                <Flex 
                  flexDirection={["column", null, 'row', 'row']}
                  alignItems={['center', null, 'flex-start', 'flex-start']}
                  >
                  <Flex 
                    flexDirection="column"
                    mr={[null, null, null, '24px']}
                    alignItems={['center', null, null, 'flex-start']}
                  >
                    
                      <Flex justifyContent={['center', null, null, 'flex-start']}>
                        <Text mx="0px" mr="5px">{TranslateString(736, 'You have ')}</Text>

                        <Balance
                          value={parseInt(ticketCount, 10)}
                          fontSize="16px"
                          decimals={0}
                          unit={TranslateString(736, ' tickets')}
                        />
                        <Text ml="5px">{TranslateString(736, 'this round')}</Text>
                      </Flex>
                    
                  </Flex>

                  {account && <>
                    {allowance.isNaN() || allowance.isLessThan(new BigNumber(ticketPrice)) ? (<div style={{padding: "0 5px"}}>
                      <Button onClick={handleApprove} disabled={pendingTx}>
                        {pendingTx ? 'Pending...' : 'Approve'}
                      </Button>
                    </div>) : (<>
                    <div style={{padding: "0 5px"}}>
                      <Button onClick={onPresentDeposit}>
                        Buy Tickets
                      </Button>
                    </div>
                    <div style={{padding: "0 5px"}}>
                      <PickWinnerButton disabled={ticketDisabled} maxWidth="280px" />
                    </div>
                    </>)}
                  </>}
                </Flex>
              </>)}
            </CardContent>
          </div>
        </Card>
      </Page>
    </BackgroundContainer>
  )
}

const BackgroundContainer = styled.div<{ bgimage?: string, dark?: boolean, width?: number, bgPos?: string }>`
  background: ${props => props.bgimage ? `url('${props.bgimage}')` : "none"};
  display:block;
  background-attachment: fixed;
    background-position: ${props => props.bgPos};
    background-repeat: no-repeat;
    background-size: cover;
    padding-top:18vw;
    background-color: ${props => props.dark ? '#192358' : '#bef7ff'};
}
`
const StyledDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`
const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 3px;
  margin: 12px auto;
  width: 100%;
`
const Winners = styled.div`
  display: flex;
  align-items: center;
`
const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
`

export default Raffle
