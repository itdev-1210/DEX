import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import { Button, Modal, Image, Text } from '@dinoswap/uikit'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'

interface DepositModalProps {
  max: BigNumber
  onConfirm: (amount: string, decimals: number) => void
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

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])


    return (

      (locked && locked >0) ? (
        <Modal title='Extinction Pool Locked' onDismiss={onDismiss}>
          <div style={{alignItems:'center', justifyContent:'center', width:"100%", textAlign:"center"}}><img src='/images/lock.png' alt="LOCKED" style={{maxWidth:200, margin:"0 auto"}} /></div>
          <br/><p style={{width:350, marginBottom:15, textAlign:'center'}} ><Text>This extinction pool is permanently locked for new DINOs since block {locked}. The pool will continue to earn rewards until block {endBlock}. </Text></p>
          
            
          <ModalActions>
            <Button width="100%" variant="secondary" onClick={onDismiss}>
              {TranslateString(462, 'Cancel')}
            </Button>
            
          </ModalActions>
        </Modal>
      )
      :
       ( <Modal title={`${TranslateString(316, 'Deposit')} ${tokenName} Tokens`} onDismiss={onDismiss}>
        <div style={{alignItems:'center', justifyContent:'center', width:"100%", textAlign:"center"}}><img src='/images/warning.png' alt="WARNING" style={{maxWidth:200}} />
        <p style={{width:350, marginBottom:20, textAlign:'center'}} ><Text>⚠️ By entering these pools, you understand and agree that 100% of your deposited DINO will be burned to earn the reward tokens over the remaining duration of the pool.</Text></p>
        </div>
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
              await onConfirm(val, stakingTokenDecimals)
              setPendingTx(false)
              onDismiss()
            }}
          >
            {pendingTx ? TranslateString(488, 'Pending Confirmation') : TranslateString(464, 'Confirm')}
          </Button>
        </ModalActions>
      </Modal>
      )
    )
  
  
}

export default DepositModal
