import React from 'react'
import styled from 'styled-components'
import { HelpIcon } from '@dinoswap/uikit'
import useI18n from 'hooks/useI18n'

import Tooltip from '../Tooltip/Tooltip'

export interface MultiplierProps {
  multiplier: string
}

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  width: 36px;
  text-align: right;

  ${({ theme }) => theme.mediaQueries.sm} {
    text-align: left;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin-left: 14px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    svg {
      margin-left: 0;
    }
  }
`

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  const displayMultipler = multiplier ? multiplier.toLowerCase() : '-'
  const TranslateString = useI18n()

  return (
    <Container>
      <MultiplierWrapper>{displayMultipler}</MultiplierWrapper>
      {/* <Tooltip
        content={
          <div>
            {TranslateString(999, 'The multiplier represents the amount of DINO rewards each farm gets.')}
          </div>
        }
      >
        <HelpIcon color="textSubtle" />
      </Tooltip> */}
    </Container>
  )
}

export default Multiplier
