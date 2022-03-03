/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Button, Flex, Text, Input, InputProps, ChevronDownIcon, useModal } from '@dinoswap/uikit'
import styled from 'styled-components'
import { darken } from 'polished'
import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import TokenList from 'config/tokens/tokenlist.json'
import BridgeModal from 'components/BridgeModal'

interface TokenInputProps extends InputProps {
  max: number | string
  symbol: string
  value: string
  currencyAddress: string
  bridgeToPolygon: boolean
  onSelectMax?: () => void
  account:string
  pending:boolean
  onSelectCurrency?: (address: string, symbol:string) => void
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void
}

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 36px;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
  padding-right:42px;
  :focus,
  :hover {
    background-color: ${({ theme }) => darken(0.05, theme.colors.input)};
  }
`
const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CurrencyLogo = styled.img`
height:36px;
width:auto;
border-radius:10px;
padding:2px;
padding-right:4px;
`

const BridgeInput: React.FC<TokenInputProps> = ({ max, pending, symbol, account, bridgeToPolygon, currencyAddress, onChange, onSelectCurrency, onSelectMax, value }) => {
  const TranslateString = useI18n()
  const disableCurrencySelect = false;
    const { isDark } = useTheme();

    const [modalOpen, setModalOpen] = useState(false)
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])


  const setSource = () => {
      let hasImage = false;
      for (let i=0; i< TokenList.tokens.length; i++ ){
        if (TokenList.tokens[i].address === currencyAddress){
          hasImage=true;
          break;
        }
      }
      let src = `/images/assets/${currencyAddress}/logo.png`;
      if (!hasImage){
        src = "/images/missing.svg"
      }
      if (symbol==="DINO"){
        src = "/images/dino.png"
      }
      console.log("TOKEN IMAGE BRIDGE", src)
      return src;
  }

  const [onPresentModal] = useModal(
    <BridgeModal
      onDismiss={handleDismissSearch}
      onSelect={onSelectCurrency}
    />
  )


  return (
    <Box style={{marginTop:-15, marginBottom:36}}>
      <Flex justifyContent="flex-end" minHeight="21px" mb="8px">
        <Text color="primary" fontSize="13px">
          {(account || pending) ? max.toLocaleString() : "---"} {symbol} {TranslateString(526, 'Available')}
        </Text>
          <div style={{marginLeft:8}}>
            <Button scale="xs" variant="text" style={{padding:"0 !important"}} onClick={onSelectMax}>
              {TranslateString(452, 'Max')}
            </Button>
          </div>
      </Flex>
      <Flex alignItems="center">
        <Input style={{border: ((bridgeToPolygon && isDark) ?  '1px solid #584e41' 
            : (bridgeToPolygon && !isDark) ? '1px solid #ede6de' 
            : (!bridgeToPolygon && isDark) ?  '1px solid #344634' 
            : '1px solid #eff5f1' 
            )}} 
          onChange={onChange} 
          placeholder="0" 
          value={value} 
          disabled={pending} 
          inputMode="decimal" 
          autoComplete="off"
          autoCorrect="off"
          pattern="^[0-9]*[.,]?[0-9]*$"
          maxLength={79}
          spellCheck="false"
        />
        <Flex alignItems="center">
          <div style={{marginLeft:8}}>
            <CurrencySelect
              selected={!!symbol}
              className="open-currency-select-button"
              onClick={() => {
                if (!disableCurrencySelect && !pending) {
                  setModalOpen(true)
                  onPresentModal()
                }
              }}
            >
            <Aligner>
              
                <CurrencyLogo src={setSource()} />

                <Text id="pair">
                  {(symbol && symbol.length > 20
                    ? `${symbol.slice(0, 4)}...${symbol.slice(
                        symbol.length - 5,
                        symbol.length
                      )}`
                    : symbol) || TranslateString(1196, 'Select a currency')}
                </Text>

              <ChevronDownIcon />
            </Aligner>
            </CurrencySelect>
          </div>
        </Flex>
      </Flex>

    </Box>
  )
}

export default BridgeInput
