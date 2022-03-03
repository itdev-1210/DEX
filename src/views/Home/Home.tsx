import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '@dinoswap/uikit'
import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import useSidebar from 'hooks/useSidebar'
import Page from 'components/layout/Page'
import FarmStakingCard from 'views/Home/components/FarmStakingCard'
import CakeStats from 'views/Home/components/CakeStats'
import TotalValueLockedCard from 'views/Home/components/TotalValueLockedCard'
import EarnAPYCard from 'views/Home/components/EarnAPYCard'
import EarnAssetCard from 'views/Home/components/EarnAssetCard'
import BridgeCard from 'views/Home/components/BridgeCard'
import RaffleCard from 'views/Home/components/RaffleCard'


const SideCards = styled.div`
@media screen and (min-width: 1200px) {
  width:25%;
  max-width:500px;
  display:inline-flex;
}
`

const BridgeCards = styled.div`
@media screen and (min-width: 1200px) {
  width:40%;
  display:block;
  margin 0 40px;
}
@media screen and (max-width: 1200px) {
  padding 15px 0px;
}
`

const BridgeContainer = styled.div`
@media screen and (min-width: 1200px) {
  flex:1;
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  justify-content:center;
  align-items:center;
  align-content:flex-start;
}
`

const BackgroundContainer = styled.div<{bgimage?: string, dark?: boolean, width?: number, bgPos?: string}>`
  background: ${props => props.bgimage ? `url('${props.bgimage}')` : "none"};
  display:block;
  background-attachment: fixed;
    background-position: ${props => props.bgPos};
    background-repeat: no-repeat;
    background-size: cover;
    padding-top:1vw;
    padding:bottom:1vw;
    background-color: ${props => props.dark ? '#192358' : '#bff8ff' };
}
`

const Home: React.FC = () => {
  const TranslateString = useI18n()
  const { isDark } = useTheme();
  const { selectedSidebar } = useSidebar();


  return (
    <BackgroundContainer dark={isDark} bgimage={ isDark ? '/images/bgdarkbridge.jpg' : '/images/bglightbridge.jpg'} bgPos={ selectedSidebar ? 'calc(50% - 120px) 100px' : 'calc(50% - 23px) 100px'}>
      <Page>
        <div>
        <BridgeContainer>
          <SideCards>
          <div>
              <CakeStats />
              <br/>
              <TotalValueLockedCard /> 
              </div>
          </SideCards>
          <BridgeCards>
            <BridgeCard />
            <RaffleCard/>
          </BridgeCards>
          <SideCards>
          <div>
              <FarmStakingCard />
              <br/>
              <EarnAssetCard />
              </div>
          </SideCards>
        </BridgeContainer>
        </div>
      </Page>
    </BackgroundContainer>
  )
}

export default Home
