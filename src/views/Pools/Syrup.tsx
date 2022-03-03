import React, { useState, useMemo } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Heading } from '@dinoswap/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import useSidebar from 'hooks/useSidebar'
import { usePools, useBlock } from 'state/hooks'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import Coming from './components/Coming'
import PoolCard from './components/PoolCard'
import PoolTabButtons from './components/PoolTabButtons'
import Divider from './components/Divider'




const Farm: React.FC = () => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const pools = usePools(account)
  const { currentBlock } = useBlock()
  const [stackedOnly, setStackedOnly] = useState(false)
  const { isDark } = useTheme();
   const { selectedSidebar } = useSidebar();

  const [finishedPools, openPools] = useMemo(
    () => partition(pools, (pool) => pool.isFinished || currentBlock > pool.endBlock),
    [ currentBlock,  pools],
  )
  const stackedOnlyPools = useMemo(
    () => openPools.filter((pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)),
    [openPools],
  )

  return (
    <BackgroundContainer dark={isDark} bgimage={ isDark ? "/images/bgdarkpools.jpg" : "/images/bglightpools.jpg" } bgPos={ selectedSidebar ? 'calc(50% - 120px) 100px' : 'calc(50% - 23px) 100px'}>
      <Page>
        <PoolTabButtons stackedOnly={stackedOnly} setStackedOnly={setStackedOnly} />
        <FlexLayout>
          <Route exact path={`${path}`}>
            <>
              {stackedOnly
                ? orderBy(stackedOnlyPools, ['sortOrder']).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)
                : orderBy(openPools, ['sortOrder']).map((pool) => <PoolCard key={pool.sousId} pool={pool} />)}
              <Coming />
            </>
          </Route>
          <Route path={`${path}/history`}>
            {orderBy(finishedPools, ['sortOrder']).map((pool) => (
              <PoolCard key={pool.sousId} pool={pool} />
            ))}
          </Route>
        </FlexLayout>
      </Page>
    </BackgroundContainer>
  )
}

const BackgroundContainer = styled.div<{bgimage?: string, dark?: boolean, width?: number, bgPos?: string}>`
  background: ${props => props.bgimage ? `url('${props.bgimage}')` : "none"};
  display:block;
  background-attachment: fixed;
    background-position: ${props => props.bgPos};
    background-repeat: no-repeat;
    background-size: cover;
    padding-top:18vw;
    background-color: ${props => props.dark ? '#192358' : '#92d9df' };
}
`

const Header = styled.img`
  width: 100%;
  height:auto;
    -khtml-user-select: none;
    -o-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    pointer-events: none;
`

const Hero = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  margin-left: auto;
  margin-right: auto;
  max-width: 250px;
  padding: 48px 0;
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-size: 16px;
    li {
      margin-bottom: 4px;
    }
  }
  img {
    height: auto;
    max-width: 100%;
  }
  @media (min-width: 576px) {
    grid-template-columns: 1fr 1fr;
    margin: 0;
    max-width: none;
  }
`

export default Farm
