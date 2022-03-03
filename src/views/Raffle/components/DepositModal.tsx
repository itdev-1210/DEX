import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal, Image, Flex, Text } from '@dinoswap/uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { useRaffle as useRaffleHook } from 'state/hooks'
import { getFullDisplayBalance, getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
  stakingTokenDecimals?: number
  locked?: number
  endBlock?: number
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = '',
  stakingTokenDecimals = 18,
  locked,
  endBlock
}) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, stakingTokenDecimals)
  }, [max, stakingTokenDecimals])

  const {
    currentRound: { drawing, ticketPrice },
  } = useRaffleHook()

  console.log("TICKET PRICE", ticketPrice, "FULL BALANCE", fullBalance)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(Math.floor(new BigNumber(fullBalance).div(new BigNumber(ticketPrice).div(new BigNumber(10).pow(18))).toNumber()).toString())
  }, [fullBalance, setVal, ticketPrice])


    return (

      <Modal title="Buy Tickets" onDismiss={onDismiss}>

      <Flex justifyContent={['center', null, null, 'flex-start']}>
        <Text mx="5px">{TranslateString(736, 'Ticket Price: ')}</Text>
        <Balance fontSize="16px" value={getBalanceNumber(new BigNumber(ticketPrice))} decimals={2} unit=" DINO" />
      </Flex>

          <TokenInput
            value={val}
            onSelectMax={handleSelectMax}
            onChange={handleChange}
            max={Math.floor(new BigNumber(fullBalance).div(new BigNumber(ticketPrice).div(new BigNumber(10).pow(18))).toNumber()).toString()}
            symbol="TICKETS"
          />
          <br/>
        <Flex justifyContent={['center', null, null, 'flex-start']}>
          <Text mx="5px">{TranslateString(736, 'Total Price in DINO: ')}</Text>
          <Balance fontSize="16px" value={getBalanceNumber(new BigNumber(ticketPrice).times(new BigNumber(val)))} decimals={2} unit=" DINO" />
        </Flex>

        <ModalActions>
          <Button width="100%" variant="secondary" onClick={onDismiss}>
            {TranslateString(462, 'Cancel')}
          </Button>
          <Button
            width="100%"
            disabled={pendingTx}
            onClick={async () => {
              setPendingTx(true)
              await onConfirm(val)
              setPendingTx(false)
              onDismiss()
            }}
          >
            {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Buy')}
          </Button>
        </ModalActions>
      </Modal>
      
    )
  
  
}

export default DepositModal
