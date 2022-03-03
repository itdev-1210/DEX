import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Image } from '@dinoswap/uikit'
import { CommunityTag, CoreTag } from 'components/Tags'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  farmImage?: string
  tokenSymbol?: string
  amm?: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const LeftImage = styled(Image)`
position:relative;
left:-32px;
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const Shovel = styled.div`
  background-image: url('/images/shovel.png');
  background-position: bottom left;
  background-repeat: no-repeat;
  background-size:contain;
  height: 80px;
  width: 100px;
  position:relative;
`
const BigIcon = styled.img`
  height: 42px;
  width: 42px;
  position: absolute;
  bottom: 10px;
  right:0px;
  background:#fff;
  border-radius:50%;
`
const SmallIcon = styled.img`
  height: 30px;
  width: 30px;
  position: absolute;
  bottom: -2px;
  right:-12px;
  background:#fff;
  border-radius:50%;
`
const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  isCommunityFarm,
  farmImage,
  tokenSymbol,
  amm
}) => {
  return (
    <>
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Shovel>
        <BigIcon src={`/images/farms/${farmImage.split("-")[0]}.png`} />
        <SmallIcon src={`/images/farms/${farmImage.split("-")[1]}.png`} />
      </Shovel>
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="4px">{lpLabel.split(' ')[0]}</Heading>
      </Flex>

    </Wrapper>
          <Flex justifyContent="center" >
          {isCommunityFarm ? <CommunityTag /> : <CoreTag />}

          {(amm && amm.length >0) ? <span style={{marginLeft:6}}><Tag variant="secondary" outline>{amm}</Tag></span> : null }
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
        </Flex>
    </>
  )
}

export default CardHeading
