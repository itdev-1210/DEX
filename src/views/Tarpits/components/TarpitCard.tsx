import BigNumber from 'bignumber.js'
import tokensConfig from 'config/constants/tokens'
import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { Button, IconButton, useModal, AddIcon, Image } from '@dinoswap/uikit'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import Label from 'components/Label'
import { useERC20 } from 'hooks/useContract'
import useI18n from 'hooks/useI18n'
import { useTarpitStake } from 'hooks/useStake'
import { useTarpitHarvest } from 'hooks/useHarvest'
import { useTarpitApprove } from 'hooks/useApprove'
import useTokenBalance from 'hooks/useTokenBalance'
import useWeb3 from 'hooks/useWeb3'
import { useTarpits, useBlock, usePriceCakeBusd } from 'state/hooks'
import { Tarpit } from 'state/types'
import { getBalanceNumber } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import {getTarpitContract, getTarpitContractNew} from 'utils/contractHelpers'
import Balance from 'components/Balance'
import LockModal from './LockModal'
import CardTitle from './CardTitle'
import Card from './Card'
import HarvestButton from './HarvestButton'
import CardFooter from './CardFooter'



interface TarpitProps {
  tarpits: Tarpit
  index: number
}

const TarpitCard: React.FC<TarpitProps> = ({ tarpits, index}) => {

  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const web3 = useWeb3()

  console.log("TARPIT ADDRESS", getAddress(tarpits.contractAddress).toString())
  const tarpitContract = (tarpits.versiontwo ? 
    getTarpitContractNew(getAddress(tarpits.contractAddress).toString(), web3) 
      : 
    getTarpitContract(getAddress(tarpits.contractAddress).toString(), web3)
    )

  const { onApprove } = useTarpitApprove(tarpitContract)
  const { onStake } = useTarpitStake(tarpitContract)

  console.log("ON STAKE", onStake)
  const { onReward } = useTarpitHarvest(tarpitContract)
  const { currentBlock } = useBlock()

  const DINOPrice = usePriceCakeBusd()
   console.log("WHAT ARE TARPITS", tarpits)

  const stakingTokenBalance = useTokenBalance(tokensConfig.dino.address[137])


  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const allowance = new BigNumber(tarpits.userData?.allowance || 0)
  const totalStaked = new BigNumber(tarpits.totalStaked || 0)
  const stakingLocked = new BigNumber(tarpits.userData?.stakingTokenBalance?.locked || 0)
  const stakingUnlocked = new BigNumber(tarpits.userData?.stakingTokenBalance?.unlocked || 0)
  const earnings = new BigNumber(tarpits.userData?.totalRewards || 0)
  const deposits = new BigNumber(tarpits.userData?.totalDeposits || 0)
  const apy = earnings.div(deposits).times(100)

  console.log("TARPITS NUMBER FOR UI...", allowance.toNumber(), totalStaked.toNumber(), stakingLocked.toNumber(), stakingUnlocked.toNumber(), earnings.toNumber(), deposits.toNumber())


  // console.log("TARPITS APY", earnings.toNumber(), deposits.toNumber(), apy.toNumber())
  

  const accountHasStakedBalance = stakingLocked?.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber()

  const [onPresentDeposit] = useModal(
    <LockModal
      max={stakingTokenBalance}
      onConfirm={onStake}
      tokenName="DINO"
      versiontwo={tarpits.versiontwo}
      stakingTokenDecimals={18}
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
    <Card isActive style={{marginTop:20}}>
      <div style={{ padding: '24px' }}>

        <CardTitle>
          Tarpit V{index+1}
        </CardTitle>
        <p style={{textAlign:"center", fontSize:20, marginBottom:10}}>{TranslateString(348, 'Lock DINO to earn rewards')}</p>
        <HeaderLink href={`https://polygonscan.com/address/${getAddress(tarpits.contractAddress).toString()}`} target="_blank">View Contract</HeaderLink>

        
        <StyledDetails>
          <div>{TranslateString(736, 'Tarpits TVL')}:</div>
          { (!totalStaked || totalStaked.toNumber() <=0 ) ? (
            '---'
          ) : (
            <>
              <Balance fontSize="14px" value={DINOPrice.times(totalStaked).toNumber()} decimals={2} prefix="$" />
              <span> / </span>
              <Balance fontSize="14px" value={totalStaked.toNumber()} decimals={2} unit=" DINO" />
            </>
          )}
        </StyledDetails>

        <hr/>

        <StyledDetails>
          <div>{TranslateString(736, 'Locked Deposit')}:</div>
          { !stakingLocked ? (
            '---'
          ) : (
            <Balance fontSize="14px" value={stakingLocked.minus(earnings).toNumber()} decimals={2} unit=" DINO" />
          )}
        </StyledDetails>
        <StyledDetails>
          <div>{TranslateString(736, 'Locked Rewards')}:</div>
          { (!earnings || (earnings && Number.isNaN(earnings.toNumber()))) ? (
            '---'
          ) : (
            <Balance fontSize="14px" value={earnings.toNumber()} decimals={2} unit=" DINO" />
          )}
        </StyledDetails>
        <StyledDetails>
          <div>{TranslateString(736, 'Unlocked Balance')}:</div>
          { !stakingUnlocked ? (
            '---'
          ) : (
            <Balance fontSize="14px" value={stakingUnlocked.toNumber()} decimals={2} unit=" DINO" />
          )}
        </StyledDetails>

        <StyledCardActions>
          {!account && <UnlockButton />}
          {(account) &&
            (needsApproval ? (
              <div style={{ flex: 1 }}>
                { tarpits.versiontwo && 
                  <Button disabled={requestedApproval} onClick={handleApprove} width="100%">
                    Approve DINO
                  </Button>
                  }
                </div>
              
            ) : (
              <>

                {account && (
                  <Button
                        disabled={!stakingUnlocked.toNumber() || pendingTx}
                        onClick={async () => {
                          setPendingTx(true)
                          await onReward()
                          console.log("REWARD NO LONGER PENDING!!!")
                          setPendingTx(false)
                        }}
                      >{pendingTx ? TranslateString(999, 'Collecting') : TranslateString(562, 'Withdraw Unlocked DINO')}</Button>
                )}

                  { tarpits.versiontwo && <div style={{marginLeft:15}}>
                  { (tarpits.userData?.locks.length < 30 || stakingUnlocked.toNumber() < 0.00001) ? 
                    (<Button onClick={onPresentDeposit}>
                      {pendingTx ? TranslateString(999, 'Collecting') : TranslateString(562, 'Lock DINO')}
                    </Button>) : null
                  }
                  </div> }

              </>
            ))}
        </StyledCardActions>

{/* list all locks here */}
{/*
            {tarpits.userData?.locks?.map((lock, id) => (
              <Card isActive>
                <StyledDetails>
                  <div>{TranslateString(736, 'Amount')}:</div>
                  { !lock.amount ? (
                    '---'
                  ) : (
                    <Balance fontSize="14px" value={lock.amount} decimals={2} unit="DINO" />
                  )}
                  <div>{TranslateString(736, 'Lock Status: ')}{(lock.validity && lock.validity > Math.floor(Date.now() / 1000)) ? TranslateString(736, 'Unlocked') : `${TranslateString(736, 'Locked, unlocks on')} ${(new Date(lock.validity * 1000)).toLocaleDateString("en-US")} at ${(new Date(lock.validity * 1000)).toLocaleTimeString("en-US")}`}</div>
                  <div>{TranslateString(736, 'Claim Status: ')}{lock.claimed ? TranslateString(736, 'Claimed') : TranslateString(736, 'Unclaimed')}</div>

                  <div>{TranslateString(736, 'Reward')}:</div>
                  { !lock.reward ? (
                    '---'
                  ) : (
                    <Balance fontSize="14px" value={lock.reward} decimals={2} unit="DINO" />
                  )}
                  <div>{TranslateString(736, 'Reward APY')}:</div>
                  { !lock.reward ? (
                    '---'
                  ) : (
                    <Balance fontSize="14px" value={(lock.reward/lock.amount*100)} decimals={2} unit="%" />
                  )}

                </StyledDetails>
              </Card>
            ))}
*/}
      </div>
    </Card>
  )
}

const HeaderLink = styled.a`
text-align:center;
margin-bottom:20px;
color: ${({ theme }) => theme.colors.text};
display:block;
`

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

export default TarpitCard
