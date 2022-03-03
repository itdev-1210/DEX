import BigNumber from 'bignumber.js'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import moment from 'moment';
import { Button, IconButton, useModal, AddIcon, Image } from '@dinoswap/uikit'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import Label from 'components/Label'
import { useERC20 } from 'hooks/useContract'
import { useJurassicApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { useJurassicStake } from 'hooks/useStake'
import { useJurassicUnstake } from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import { getJurassicPoolApy } from 'utils/apy'
import { getAddress } from 'utils/addressHelpers'
import { useJurassicHarvest } from 'hooks/useHarvest'
import Balance from 'components/Balance'
import { PoolCategory } from 'config/constants/types'
import tokens from 'config/constants/tokens'
import { JurassicPool } from 'state/types'
import { useGetApiPrice, useBlock } from 'state/hooks'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import CompoundModal from './CompoundModal'
import CardTitle from './CardTitle'
import Card from './Card'
import HarvestButton from './HarvestButton'
import CardFooterComponent from './CardFooter'

interface HarvestProps {
  pool: JurassicPool
}

const PoolCard: React.FC<HarvestProps> = ({ pool }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    harvest,
    poolCategory,
    totalStaked,
    startBlock,
    endBlock,
    lockBlock,
    isFinished,
    userData,
    stakingLimit,
    contractAddress,
    dinoPoolStaked,
  } = pool

  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE
  const TranslateString = useI18n()
  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const { account } = useWeb3React()
  const { onApprove } = useJurassicApprove(stakingTokenContract, sousId)
  const { onStake } = useJurassicStake(sousId, isBnbPool)
  const { onUnstake } = useJurassicUnstake(sousId)
  const { onReward } = useJurassicHarvest(sousId, isBnbPool)
  const { currentBlock } = useBlock()

  const hasntStarted = currentBlock < startBlock
  const isLocked = !isFinished && currentBlock > lockBlock && currentBlock < endBlock
  const isReallyFinished = isFinished || currentBlock > endBlock
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)



  console.log("JURASSIC POOL", pool)
  // APY
  const rewardTokenPrice = useGetApiPrice(earningToken.symbol)
  const stakingTokenPrice = useGetApiPrice(stakingToken.symbol)
  /* eslint-disable no-nested-ternary */
  const netDINOStaked = getBalanceNumber(pool.totalStaked, stakingToken.decimals)
  

  const apy = getJurassicPoolApy(
    stakingTokenPrice,
    rewardTokenPrice,
    netDINOStaked,
    parseFloat(pool.tokenPerBlock),
  )

  console.log("JURASSIC APR", apy,     stakingTokenPrice,
    rewardTokenPrice,
    netDINOStaked,
    parseFloat(pool.tokenPerBlock))

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const allowance = new BigNumber(userData?.allowance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)

  const isOldSyrup = false;
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool
  const isCardActive = isFinished && accountHasStakedBalance

  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(earningToken.decimals))
  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
      onConfirm={onStake}
      tokenName={stakingLimit ? `${stakingToken.symbol} (${stakingLimit} max)` : stakingToken.symbol}
      stakingTokenDecimals={stakingToken.decimals}
    />,
  )
  const [onPresentLocked] = useModal(
    <DepositModal
      max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
      onConfirm={onStake}
      locked={lockBlock}
      endBlock={endBlock}
      tokenName={stakingLimit ? `${stakingToken.symbol} (${stakingLimit} max)` : stakingToken.symbol}
      stakingTokenDecimals={stakingToken.decimals}
    />,
  )
  const [onPresentCompound] = useModal(
    <CompoundModal earnings={earnings} onConfirm={onStake} tokenName={stakingToken.symbol} />,
  )
  const poolImage = `${pool.earningToken.symbol}.png`.toLocaleLowerCase()
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={stakingToken.symbol}
      stakingTokenDecimals={stakingToken.decimals}
    />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <Card isActive={isCardActive} isFinished={isFinished && sousId !== 0}>
      {isFinished && sousId !== 0 && <PoolFinishedSash />}
      <div style={{ padding: '24px' }}>
        <CardTitle isFinished={isFinished && sousId !== 0}>
          {isOldSyrup && '[OLD]'} {earningToken.symbol} {TranslateString(348, 'Pool')}
        </CardTitle>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <img src={`/images/farms/${poolImage}`} alt={earningToken.symbol} style={{borderRadius:32, width:64, height:64}}/>
          </div>
        </div>

          <BalanceAndCompound>
            <Balance value={getBalanceNumber(earnings, earningToken.decimals)} isDisabled={isFinished} />
            {sousId === 0 && account && harvest && (
              <HarvestButton
                disabled={!earnings.toNumber() || pendingTx}
                text={pendingTx ? TranslateString(999, 'Compounding') : TranslateString(704, 'Compound')}
                onClick={onPresentCompound}
              />
            )}
          </BalanceAndCompound>
        
        <Label isFinished={isFinished && sousId !== 0} text={TranslateString(330, `${earningToken.symbol} earned`)} />
        <Label text={`~${new BigNumber(getBalanceNumber(earnings, earningToken.decimals)).times(rewardTokenPrice).toFixed(2)} USD earned`} />
                  { account && hasntStarted && currentBlock && startBlock ?
            (
                <div style={{fontSize:18, fontWeight:"bold", marginTop:10}}>Rewards start in approx {moment().add((Math.max(startBlock - currentBlock, 0)*2.25), 'seconds').toNow(true)} at block {startBlock}</div>
            )
            : null
           }
        <StyledCardActions>
          {!account && <UnlockButton />}
          {account &&
            (needsApproval && !isOldSyrup && !isLocked && !isReallyFinished ? (
              <div style={{ flex: 1 }}>
                <Button disabled={isFinished || requestedApproval} onClick={handleApprove} width="100%">
                  {`Approve ${stakingToken.symbol}`}
                </Button>
              </div>
            ) : (
              <>

                {account && harvest && !isOldSyrup && (
                  <Button
                    disabled={!earnings.toNumber() || pendingTx}
                    onClick={async () => {
                      setPendingTx(true)
                      await onReward()
                      setPendingTx(false)
                    }}
                  >{pendingTx ? TranslateString(999, 'Collecting') : TranslateString(562, 'Excavate')}</Button>
                )}

                <StyledActionSpacer />
                {(!isOldSyrup && isLocked) && (
                  <Button
                    onClick={onPresentLocked}
                  >
                    Locked 🔒
                  </Button>


                )}

                <Button
                  disabled={stakedBalance.eq(new BigNumber(0)) || pendingTx}
                  onClick={
                    isOldSyrup
                      ? async () => {
                          setPendingTx(true)
                          await onUnstake('0', stakingToken.decimals)
                          setPendingTx(false)
                        }
                      : onPresentWithdraw
                  }
                >
                  Unstake DINO
                </Button>
                {(!isOldSyrup && !isReallyFinished) && (
                  <span style={{marginLeft:20}}>
                    <IconButton disabled={isFinished && sousId !== 0} onClick={onPresentDeposit}>
                      <AddIcon color="white" />
                    </IconButton>
                  </span>
                )}
              </>
            ))}
        </StyledCardActions>
        <StyledDetails>
          <div>{TranslateString(736, 'APR')}:</div>
          {isFinished || isOldSyrup || !apy ? (
            '-'
          ) : (
            <Balance fontSize="14px" isDisabled={isFinished} value={apy} decimals={2} unit="%" />
          )}
        </StyledDetails>
        <StyledDetails>
          <div>{TranslateString(384, 'Your Staked DINOs')}:</div>
          <Balance
            fontSize="14px"
            isDisabled={isFinished}
            value={getBalanceNumber(stakedBalance, stakingToken.decimals)}
          />
        </StyledDetails>
      </div>
      <CardFooterComponent
        projectLink={earningToken.projectLink}
        decimals={stakingToken.decimals}
        totalStaked={totalStaked}
        startBlock={startBlock}
        endBlock={endBlock}
        lockBlock={lockBlock}
        isFinished={isFinished}
        netDINOStaked={netDINOStaked}
        contractAddress={contractAddress[137]}
        poolCategory={poolCategory}
        tokenName={earningToken.symbol}
        tokenAddress={earningToken.address ? getAddress(earningToken.address) : ''}
        tokenDecimals={earningToken.decimals}
      />
    </Card>
  )
}

const PoolFinishedSash = styled.div`
  background-image: url('/images/finished.png');
  background-position: top right;
  background-repeat: no-repeat;
  background-size:contain;
  height: 135px;
  position: absolute;
  right: 0px;
  top: 0x;
  width: 135px;
`

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`

export default PoolCard
