import React from 'react'
import styled from 'styled-components'
import { useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { Text, Image } from '@dinoswap/uikit'
import { getBalanceNumber } from 'utils/formatBalance'

export interface FarmProps {
  label: string
  pid: number
  image: string,
  amm?: string
}

const IconImage = styled(Image)`
  width: 24px;
  height: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
`

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`
const LeftImage = styled(Image)`
position:relative;
left:-32px;
`

const Shovel = styled.div`
  background-image: url('/images/shovel.png');
  background-position: bottom left;
  background-repeat: no-repeat;
  background-size:contain;
  height: 55px;
  width: 70px;
  position:relative;
  margin-right:30px;
`
const BigIcon = styled.img`
  height: 36px;
  width: 36px;
  position: absolute;
  bottom: 10px;
  right:0px;
  background:#fff;
  border-radius:50%;
`
const SmallIcon = styled.img`
  height: 28px;
  width: 28px;
  position: absolute;
  bottom: -2px;
  right:-12px;
  background:#fff;
  border-radius:50%;
`


const Farm: React.FunctionComponent<FarmProps> = ({ image, label, pid }) => {
  const { stakedBalance } = useFarmUser(pid)
  const TranslateString = useI18n()
  const rawStakedBalance = getBalanceNumber(stakedBalance)

  const handleRenderFarming = (): JSX.Element => {
    if (rawStakedBalance) {
      return (
        <Text color="secondary" fontSize="12px" bold>
          {TranslateString(999, 'FARMING')}
        </Text>
      )
    }

    return null
  }

  return (
    <Container>

      <Shovel>
        <BigIcon src={`/images/farms/${image.split("-")[0]}.png`} />
        <SmallIcon src={`/images/farms/${image.split("-")[1]}.png`} />
      </Shovel>

      <div>
        {handleRenderFarming()}
        <Text bold>{label}</Text>
      </div>
    </Container>
  )
}

export default Farm
