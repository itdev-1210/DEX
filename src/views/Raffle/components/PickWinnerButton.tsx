/* eslint-disable no-else-return */
import React, { useState } from 'react'
import { Button, WaitIcon, ButtonProps, Text } from '@dinoswap/uikit'
import useI18n from 'hooks/useI18n'
import { useRaffle as useRaffleHook } from 'state/hooks'
import useRaffle from 'hooks/useRaffle'

interface PickWinnerButtonProps extends ButtonProps {
  disabled?: boolean
}

const PickWinnerButton: React.FC<PickWinnerButtonProps> = ({ disabled, ...props }) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const {
    currentRound: { drawing, lastRaffle, raffleDuration },
  } = useRaffleHook()

  const { onPickWinner } = useRaffle()

  const onPresentPickWinner = async () => {
    setPendingTx(true)
    try {
      const tx = await onPickWinner()
    } catch (err) {
      console.log(err)
      setPendingTx(false)
    }
  }


  const getPickWinnerText = () => {
    console.log("DRAWING...", drawing, lastRaffle, raffleDuration, (parseInt(lastRaffle) + parseInt(raffleDuration)), Math.floor(Date.now()/1000))
    if (((parseInt(lastRaffle) + parseInt(raffleDuration)) < Math.floor(Date.now()/1000))) {
      return pendingTx ? 
      (<><Text> Wait for 2 transactions to confirm then reload.</Text><br/><Button {...props} disabled={disabled || pendingTx}>{TranslateString(488, 'Pending...')}</Button></>)
       : 
      (<Button {...props} onClick={onPresentPickWinner}>{TranslateString(736, 'Pick Winner')}</Button>)
    } else {
      return (<Button {...props} disabled >
          <WaitIcon mr="4px" color="textDisabled" /> {TranslateString(736, 'Ending soon!')}
        </Button>
      )
    }
  }

  return (<>
      {getPickWinnerText()}
    </>
  )
}

export default PickWinnerButton
