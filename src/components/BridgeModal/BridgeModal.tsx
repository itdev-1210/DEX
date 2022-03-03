import BigNumber from 'bignumber.js'
import React, { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Modal, Image } from '@dinoswap/uikit'
import styled from 'styled-components'
import ModalActions from 'components/ModalActions'
import TokenInput from 'components/TokenInput'
import useI18n from 'hooks/useI18n'
import { getFullDisplayBalance } from 'utils/formatBalance'
import TokenList from 'config/tokens/tokenlist.json'
import MappedList from 'config/tokens/mapped.json'

interface BridgeModalProps {
  onSelect: (address: string, symbol: string) => void
  onDismiss?: () => void
}

const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.colors.text};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`

const ResultsContainer = styled.div`
max-height:60vh;
overflow-y:scroll;
overflow-x:hidden;
`

const ResultRow = styled.div`
margin 6px;
width:100%;
max-width:100%;
:hover {
  background-color:#f2f2f2;
}
cursor:pointer;
`
const ResultImage = styled.img`
height:48px;
width:auto;
margin:12px;
display:inline-block;
vertical-align:middle
`
const ResultName = styled.div`
padding:12px;
line-height:24px;
font-size:16px;
display:inline-block;
vertical-align:middle;
max-width:100%;
`
const ResultSymbol = styled.span`
font-weight:bold;
font-size:20px;
`
const BridgeModal: React.FC<BridgeModalProps> = ({
  onSelect,
  onDismiss,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTokens, setFilteredTokens] = useState(MappedList.mapped)
  const TranslateString = useI18n()

  // manage focus on modal show
  // const inputRef = useRef<HTMLInputElement>()

  const setSource = (address) => {
      let hasImage = false;
      for (let i=0; i< TokenList.tokens.length; i++ ){
        if (TokenList.tokens[i].address === address){
          hasImage=true;
          break;
        }
      }
      let src = `/images/assets/${address}/logo.png`;
      if (!hasImage){
        src = "/images/missing.svg"
      }
      if (address==="0x2701E1D67219a49F5691C92468Fe8D8ADc03e609"){
        src = "/images/dino.png"
      }
      // console.log("TOKEN IMAGE BRIDGE", src)
      return src;
  }

  const filterTokens = (search) =>  {
    if (search.length === 0) return MappedList.mapped

    const lowerSearchParts = search
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)

    if (lowerSearchParts.length === 0) {
      return MappedList.mapped
    }

    const matchesSearch = (s) => {
      const sParts = s
        .toLowerCase()
        .split(/\s+/)
        .filter((str) => str.length > 0)

      return lowerSearchParts.every((p) => p.length === 0 || sParts.some((sp) => sp.startsWith(p) || sp.endsWith(p)))
    }

    return MappedList.mapped.filter((token) => {
      const { symbol, name } = token
      return (symbol && matchesSearch(symbol)) || (name && matchesSearch(name))
    })
  }

  const handleCurrencySelect = useCallback(
    (address, symbol) => {
      onSelect(address, symbol)
      onDismiss()
    },
    [onDismiss, onSelect]
  )
/* 
  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])
*/ 
  const handleInput = useCallback((event) => {
    const input = event.target.value
    setSearchQuery(input)
    setFilteredTokens(filterTokens(input))
  }, [setFilteredTokens])




    return (

      <Modal title={`${TranslateString(316, 'Bridge')} Tokens`} onDismiss={onDismiss}>
          <SearchInput
            onChange={handleInput}
            placeholder="Search for a Token"
            value={searchQuery}
            
          />
          <hr/>
          <ResultsContainer>
            {filteredTokens.map((token)=> (token.symbol ? 
              <ResultRow onClick={()=> handleCurrencySelect(token.root_token, token.symbol)} key={token.root_token}>
                <ResultImage src={setSource(token.root_token)}/>

                <ResultName><ResultSymbol>{token.symbol}</ResultSymbol><br/>{token.name}
                </ResultName>

              </ResultRow> : null)
            )}
          </ResultsContainer>
      </Modal>
      
    )
  
  
}

export default BridgeModal
