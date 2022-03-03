import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Image, Heading, RowType, Toggle, Text } from '@dinoswap/uikit'
import styled from 'styled-components'
import FlexLayout from 'components/layout/Flex'
import Page from 'components/layout/Page'
import { useFarms, usePriceCakeBusd, useGetApiPrices } from 'state/hooks'
import useTheme from 'hooks/useTheme'
import useSidebar from 'hooks/useSidebar'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { Farm } from 'state/types'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import { getFarmApy } from 'utils/apy'
import { orderBy } from 'lodash'

import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import Table from './components/FarmTable/FarmTable'
import FarmTabButtons from './components/FarmTabButtons'
import SearchInput from './components/SearchInput'
import { RowProps } from './components/FarmTable/Row'
import ToggleView from './components/ToggleView/ToggleView'
import { DesktopColumnSchema, ViewMode } from './components/types'
import Select, { OptionProps } from './components/Select/Select'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
  }
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

const HeaderLink = styled.a`
text-align:center;
margin-bottom:12px;
color: ${({ theme }) => theme.colors.text};
display:block;
text-decoration:underline;
`

const HeaderCountdownSubtext = styled.div`
text-align:center;
margin-bottom:12px;
font-size:22px;
color: ${({ theme }) => theme.colors.text};
display:block;
`

const HeaderCountdown = styled.div`
text-align:center;
margin-bottom:6px;
font-size:22px;
color: ${({ theme }) => theme.colors.text};
display:block;
`

const BackgroundContainer = styled.div<{bgimage?: string, dark?: boolean, width?: number, bgPos?: string}>`
  background: ${props => props.bgimage ? `url('${props.bgimage}')` : "none"};
  display:block;
  background-attachment: fixed;
    background-position: ${props => props.bgPos};
    background-repeat: no-repeat;
    background-size: cover;
    padding-top:18vw;
    background-color: ${props => props.dark ? '#192358' : '#bff8ff' };
}
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
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

const Farms: React.FC = () => {
  const { path } = useRouteMatch()
  const { pathname } = useLocation()
  const TranslateString = useI18n()
  const farmsLP = useFarms()

  console.log("FARMS FROM STATE", farmsLP)
  const cakePrice = usePriceCakeBusd()
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState(ViewMode.TABLE)
  const { account } = useWeb3React()
  const [sortOption, setSortOption] = useState('hot')
  const prices = useGetApiPrices()
  const { isDark } = useTheme();
  const { selectedSidebar } = useSidebar();

  const dispatch = useDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, slowRefresh])

  const [stackedOnly, setStackedOnly] = useState(false)
  const isActive = !pathname.includes('history')

// WE ARE DISABLING THIS by putting it to 00x instead of 0x. not letting people deposit ahead of time is unfair

  const activeFarms = farmsLP.filter((farm) => farm.finished !== true)
  const inactiveFarms = farmsLP.filter((farm) => farm.finished === true)

  const stackedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const stackedInactiveFarms = inactiveFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
    switch (sortOption) {
      case 'apr':
        return orderBy(farms, (farm: FarmWithStakedValue) => farm.apy, 'desc')
      case 'multiplier':
        return orderBy(
          farms,
          (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
          'desc',
        )
      case 'earned':
        return orderBy(farms, (farm: FarmWithStakedValue) => (farm.userData ? farm.userData.earnings : 0), 'desc')
      case 'liquidity':
        return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
      default:
        return farms
    }
  }

  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {

        // console.log("LP VALUE", farm, prices)

        if (!farm.lpTotalInQuoteToken || !prices) {
          return farm
        }

        const quoteTokenPriceUsd = prices[farm.quoteToken.symbol.toLowerCase().replace("wmatic", "matic")]
        const tokenPriceUsd = prices[farm.token.symbol.toLowerCase().replace("wmatic", "matic")]

        const quoteTokenAmountInUSD = new BigNumber(farm.quoteTokenAmount).times(quoteTokenPriceUsd)
        const tokenAmountInUSD = new BigNumber(farm.tokenAmount).times(tokenPriceUsd)

        const totalLiquidity = quoteTokenAmountInUSD.plus(tokenAmountInUSD)

        console.log("CALC LIQUIDITY", farm.lpTotalInQuoteToken, quoteTokenPriceUsd, farm, prices, farm.quoteToken.symbol.toLowerCase())

        // console.log("TOTAL Liquidity", totalLiquidity.toNumber() );
        const apy = isActive ? getFarmApy(farm.poolWeight, cakePrice, totalLiquidity) : 0

        return { ...farm, apy, liquidity: totalLiquidity }
      })

      if (query) {
        const lowercaseQuery = query.toLowerCase()
        farmsToDisplayWithAPY = farmsToDisplayWithAPY.filter((farm: FarmWithStakedValue) => {
          return farm.lpSymbol.toLowerCase().includes(lowercaseQuery)
        })
      }
      return farmsToDisplayWithAPY
    },
    [cakePrice, prices, query, isActive],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  let farmsStaked = []
  if (isActive) {
    farmsStaked = stackedOnly ? farmsList(stackedOnlyFarms) : farmsList(activeFarms)
  } else {
    farmsStaked = stackedOnly ? farmsList(stackedInactiveFarms) : farmsList(inactiveFarms)
  }

  farmsStaked = sortFarms(farmsStaked)

  const rowData = farmsStaked.map((farm) => {
    const { token, quoteToken, liquidityUrl } = farm
    const tokenAddress = token.address
    const quoteTokenAddress = quoteToken.address
    const lpLabel = farm.lpSymbol && farm.lpSymbol.split(' ')[0].toUpperCase().replace('PANCAKE', '')

    const row: RowProps = {
      apr: {
        value: farm.apy && farm.apy.toLocaleString('en-US', { maximumFractionDigits: 2 }),
        multiplier: farm.multiplier,
        lpLabel,
        tokenAddress,
        quoteTokenAddress,
        cakePrice,
        originalValue: farm.apy,
      },
      farm: {
        image: farm.lpSymbol.split(' ')[0].toLocaleLowerCase(),
        label: lpLabel,
        pid: farm.pid,
      },
      earned: {
        earnings: farm.userData ? getBalanceNumber(new BigNumber(farm.userData.earnings)) : null,
        pid: farm.pid,
      },
      liquidity: {
        liquidity: farm.liquidity,
      },
      multiplier: {
        multiplier: farm.multiplier,
      },
      details: farm,
    }

    return row
  })

  const renderContent = (): JSX.Element => {
    if (viewMode === ViewMode.TABLE && rowData.length) {
      const columnSchema = DesktopColumnSchema

      const columns = columnSchema.map((column) => ({
        id: column.id,
        name: column.name,
        label: column.label,
        sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
          switch (column.name) {
            case 'farm':
              return b.id - a.id
            case 'apr':
              if (a.original.apr.value && b.original.apr.value) {
                return Number(a.original.apr.value) - Number(b.original.apr.value)
              }

              return 0
            case 'earned':
              return a.original.earned.earnings - b.original.earned.earnings
            default:
              return 1
          }
        },
        sortable: column.sortable,
      }))

      return <Table data={rowData} columns={columns} />
    }

    return (
      <div>
        <FlexLayout style={{marginTop:30}}>
          <Route exact path={`${path}`}>
            {farmsStaked.map((farm) => (
              <FarmCard key={farm.pid} farm={farm} cakePrice={cakePrice} account={account} removed={false} />
            ))}
          </Route>
          <Route exact path={`${path}/history`}>
            {farmsStaked.map((farm) => (
              <FarmCard key={farm.pid} farm={farm} cakePrice={cakePrice} account={account} removed />
            ))}
          </Route>
        </FlexLayout>
      </div>
    )
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  return (
    <BackgroundContainer dark={isDark} bgimage={ isDark ? '/images/bgdarkfarms.jpg' : '/images/bglightfarms.jpg'} bgPos={ selectedSidebar ? 'calc(50% - 120px) 100px' : 'calc(50% - 23px) 100px'}>
     <Page>
      
       <HeaderCard>
        <HeaderText>Stake LP tokens to earn DINO</HeaderText>
        {/* <HeaderCountdown>Farming rewards doubled! Ends {moment.utc("Jul-17-2021 03:00:07 AM").add(72, 'hours').fromNow()}</HeaderCountdown> */}
        <HeaderLink href="https://polygonscan.com/address/0x1948abC5400Aa1d72223882958Da3bec643fb4E5" target="_blank">View Contract</HeaderLink>
        <ControlContainer>
          <ViewControls>
            <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />
            <ToggleWrapper>
              <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} scale="sm" />
              <Text> {TranslateString(1116, 'Staked only')}</Text>
            </ToggleWrapper>
            <FarmTabButtons />
          </ViewControls>
          <FilterContainer>
            <LabelWrapper>
              <Text>SORT BY</Text>
              <Select
                options={[
                  {
                    label: 'Hot',
                    value: 'hot',
                  },
                  {
                    label: 'APR',
                    value: 'apr',
                  },
                  {
                    label: 'Multiplier',
                    value: 'multiplier',
                  },
                  {
                    label: 'Earned',
                    value: 'earned',
                  },
                  {
                    label: 'Liquidity',
                    value: 'liquidity',
                  },
                ]}
                onChange={handleSortOptionChange}
              />
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text>SEARCH</Text>
              <SearchInput onChange={handleChangeQuery} value={query} />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        </HeaderCard>
        {renderContent()}
      </Page>
    </BackgroundContainer>
  )
}

export default Farms
