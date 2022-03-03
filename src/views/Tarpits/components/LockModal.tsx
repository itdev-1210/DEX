import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal, Image, Text } from '@dinoswap/uikit'
import styled from 'styled-components'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'
import Select, { OptionProps } from './Select/Select'


interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string, decimals: number, id?:number) => void
  onDismiss?: () => void
  tokenName?: string
  stakingTokenDecimals?: number
  locked?: number
  endBlock?: number
  versiontwo?: boolean
}

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
    text-align:center;
    margin: 10px 0;
  }

`

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = '',
  stakingTokenDecimals = 18,
  locked,
  endBlock,
  versiontwo
}) => {
  const [val, setVal] = useState('')
  const [seconds, setSeconds] = useState(versiontwo ? 7776000 : 7776000) // default option
  const [id, setId] = useState(4) // default option
  const [pendingTx, setPendingTx] = useState(false)
  const [multiplier, setMultiplier] = useState(versiontwo ? 3250 : 1000) // default option

  const options = versiontwo ?
   [
    {
      label: '3 Months',
      value: '7776000',
      multiplier:3250,
      id:4
    },
    {
      label: '2 Months',
      value: '5184000',
      multiplier:2750,
      id:3
    },
    {
      label: '1 Month',
      value: '2592000',
      multiplier:2250,
      id:2
    },
    {
      label: '2 Weeks',
      value: '1209600',
      multiplier:1750,
      id:1
    },
   ]
    :
   [
    {
      label: '3 Months',
      value: '7776000',
    },
    {
      label: '2 Months',
      value: '5184000',
    },
    {
      label: '1 Month',
      value: '2592000',
    },
    {
      label: '21 Days',
      value: '1814400',
    },
    {
      label: '14 Days',
      value: '1209600',
    },
    {
      label: '7 Days',
      value: '604800',
    },
  ]

  const TranslateString = useI18n()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, stakingTokenDecimals)
  }, [max, stakingTokenDecimals])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  const handleTimeChange = (option: OptionProps): void => {
    if (option.id){
      setId(option.id)
      setMultiplier(option.multiplier)
    }
    setSeconds(option.value)
  }

    return (

      <Modal title={`${TranslateString(316, 'Lock')} DINO Tokens`} onDismiss={onDismiss}>
        <div style={{alignItems:'center', justifyContent:'center', width:"100%", textAlign:"center", marginBottom:20}}>
        <Text><p style={{width:350, margin:'0 auto', textAlign:'center'}} >⚠️ By locking DINO you understand and agree that your DINO will be inaccessible for the chosen time.</p></Text>
        </div>


            <LabelWrapper>
              <Text>Lock DINO for </Text>
              <Select
                options={options}
                onChange={handleTimeChange}
              />
              <Text>({seconds || 0} seconds)</Text>
              {versiontwo ?
                (<>
                  <Text>Your Rewards: {parseFloat(val) > 0 ? (multiplier  * parseFloat(val) * seconds / 31536000 / 1000).toFixed(2) : '---'} DINO</Text>
                  <Text>Your APR: {((multiplier  * parseFloat("1") * seconds / 31536000 / 1000)/parseFloat("1")*100 *(31536000 / seconds)).toFixed(2)}% </Text>
                </>)
                :
                (<>
                  <Text>Your Rewards: {parseFloat(val) > 0 ? ((multiplier * 1e10 * seconds / 31536000) * parseFloat(val) * seconds / 31536000 / 1e12).toFixed(2) : '---'} DINO</Text>
                  <Text>Your APR: {(((multiplier * 1e10 * seconds / 31536000) * parseFloat("1") * seconds / 31536000 / 1e12)/parseFloat("1")*100 *(31536000 / seconds)).toFixed(2)}% </Text>
                </>)
              }
            </LabelWrapper>


          <TokenInput
            value={val}
            onSelectMax={handleSelectMax}
            onChange={handleChange}
            max={fullBalance}
            symbol={tokenName}
          />
        
        <ModalActions>
          <Button width="100%" variant="secondary" onClick={onDismiss}>
            {TranslateString(462, 'Cancel')}
          </Button>
          <Button
            width="100%"
            disabled={pendingTx}
            onClick={async () => {
              setPendingTx(true)
              await onConfirm(val, seconds, (versiontwo ? id : null))
              setPendingTx(false)
              onDismiss()
            }}
          >
            {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
          </Button>
        </ModalActions>
      </Modal>
      
    )
  
  
}

export default DepositModal
