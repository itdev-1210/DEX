import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, Toggle, Text } from '@dinoswap/uikit'
import useI18n from 'hooks/useI18n'

const PoolTabButtons = ({ stackedOnly, setStackedOnly }) => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()

  return (
    <HeaderCard>
          <HeaderText>Stake DINO to Earn Rewards</HeaderText>
    <Wrapper>
      <ToggleWrapper>
        <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
        <Text> {TranslateString(999, 'Staked only')}</Text>
      </ToggleWrapper>
      <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="subtle">
        <ButtonMenuItem as={Link} to={`${url}`}>
          {TranslateString(1198, 'Live')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/history`}>
          {TranslateString(388, 'Finished')}
        </ButtonMenuItem>
      </ButtonMenu>
    </Wrapper>
    <Warning>⚠️ By entering these pools, you understand and agree that 100% of your deposited DINO will be burned to earn the reward tokens over the remaining duration of the pool.</Warning>
    </HeaderCard>
  )
}

export default PoolTabButtons

const Warning= styled.div`
font-size:16px;
text-align:center;
font-weight:bold;
margin-top:12px;
color: ${({ theme }) => theme.colors.text};
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
const HeaderLink = styled.a`
text-align:center;
margin-bottom:12px;
color: ${({ theme }) => theme.colors.text};
display:block;
`
const HeaderCard = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius:16px;
  padding:24px;
  margin-bottom: 32px;
`
const HeaderText = styled.div`
font-size:28px;
text-align:center;
font-weight:bold;
margin-bottom:12px;
color: ${({ theme }) => theme.colors.text};
`

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 32px;

  ${Text} {
    margin-left: 8px;
  }
`
