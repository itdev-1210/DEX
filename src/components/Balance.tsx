import React, { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import { Text } from '@dinoswap/uikit'

interface TextProps {
  isDisabled?: boolean
  fontSize?: string
  color?: string
}

interface BalanceProps extends TextProps {
  value?: number
  decimals?: number
  unit?: string
  prefix?: string
}

const Balance: React.FC<BalanceProps> = ({ 
  value, fontSize, color, decimals, isDisabled, unit, prefix 
}) => {
  const previousValue = useRef(0)

  useEffect(() => {
    previousValue.current = value
  }, [value])

  return (
    <Text bold color={isDisabled ? 'textDisabled' : color} fontSize={fontSize}>
      <CountUp 
        start={previousValue.current} 
        end={value} 
        decimals={decimals} 
        prefix={prefix}
        suffix={unit}
        duration={1} separator="," />
    </Text>
  )
}

Balance.defaultProps = {
  fontSize: '32px',
  isDisabled: false,
  color: 'text',
  decimals: 3,
}

export default Balance
