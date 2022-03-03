/* eslint-disable no-nested-ternary */
import React, {useState, useEffect, useCallback} from 'react'
import { Card, CardBody, Heading, Text, Button, Flex } from '@dinoswap/uikit'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import {useBridgeApproveFromEth, useBridgeDepositFromEth, useBridgeBurnFromPolygon, useBridgeExitFromPolygon, useBridgeCheckForReceipt} from 'hooks/useBridge'
import getPolygonTokenBalance from 'utils/getPolygonTokenBalance'
import getEthTokenBalance from 'utils/getEthTokenBalance'
import { registerToken } from 'utils/wallet'
import UnlockButton from 'components/UnlockButton'
import BridgeInput from 'components/BridgeInput'
import MappedList from 'config/tokens/mapped.json'
import CardValue from './CardValue'


const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`
/*
polygon card: #eff5f1; #344634
eth card ede6de 584e41
*/

const BridgeCardTop = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  border-radius:12px 12px 0 0 !important;
`

const BridgeCardBottom = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  position:relative;
  overflow:visible !important;
  border-radius:0 0 12px 12px !important;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`
const Actions = styled.div`
  margin-top: 24px;
`
const ArrowIcon = styled.img`
height:24px;
margin:20px;
transform: rotate(90deg);
`
const SwitchBridgeButton = styled.div`
width:64px;
height:64px;
background-color:#94cc76;
border-radius:32px;
cursor:pointer;
margin:0 auto;
z-index:9;
top:-32px;
position:relative;
textAlign:center;

`
const SwitchBridgeButtonContainer = styled.div`
text-align:center;
margin-top:-32px;
margin: 0 auto;
`
const CardBodyNoPaddingTop = styled.div`
padding: 0 14px 14px 14px;
`
const NetworkTag = styled.div`
padding:8px;
margin:12px;
border-radius:6px;
display:inline-block;
`
const AddPolygonAddress = styled.div`

`

const BridgeCard = () => {
  const [pendingTx, setPendingTx] = useState(false)
  const [pendingFinalTx, setPendingFinalTx] = useState(false)
  const [bridgeToPolygon, setbridgeToPolygon] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState("DINO")
  const [currencyAddress, setCurrencyAddress] = useState("0x2701E1D67219a49F5691C92468Fe8D8ADc03e609")
  const [approvalSubmitted, setApprovalSubmitted] = useState(true)
  const [bridgeAmount, setBridgeAmount] = useState("")
  const [fullBalance, setFullBalance] = useState(0)
  const [switchingBridge, setSwitchingBridge] = useState(false)

  const TranslateString = useI18n()
  const { isDark } = useTheme();
  const { account } = useWeb3React()


  const { onBridgeApprove } = useBridgeApproveFromEth()
  const { onBridgeDeposit } = useBridgeDepositFromEth()
  const { onBridgeBurn } = useBridgeBurnFromPolygon()
  const { onBridgeExit } = useBridgeExitFromPolygon()
  const { onBridgeCheckForReceipt } = useBridgeCheckForReceipt()

  const getDecimals = (address) => {
    let decimals =18
    for (let i=0; i<MappedList.mapped.length; i++){
      if (MappedList.mapped[i].root_token === address){
        decimals = MappedList.mapped[i].decimals
      }
    }
    return decimals
  }

  const getPolygonTokenAddress = (ethAddress) => {
    let polygonAddress = ""
    for (let i=0; i<MappedList.mapped.length; i++){
      if (MappedList.mapped[i].root_token === ethAddress){
        polygonAddress = MappedList.mapped[i].child_token
      }
    }
    return polygonAddress
  }
  const switchBridge = useCallback(() => {
    if (!switchingBridge && !pendingTx && !pendingFinalTx){
      setSwitchingBridge(true)
      setbridgeToPolygon(!bridgeToPolygon)
      const fetch = async () => {
        if (bridgeToPolygon){
          const balance = await getEthTokenBalance(currencyAddress, account)
          setFullBalance(
            (new BigNumber(balance)).div(new BigNumber(10).pow(getDecimals(currencyAddress))).toNumber()
          )
          setSwitchingBridge(false)
        } else {
          const balance = await getPolygonTokenBalance(getPolygonTokenAddress(currencyAddress), account)
          setFullBalance(
            (new BigNumber(balance)).div(new BigNumber(10).pow(getDecimals(currencyAddress))).toNumber()
          )
          setSwitchingBridge(false)
        }
      } 
      fetch()
    }
  }, [currencyAddress, setFullBalance, account, bridgeToPolygon, setbridgeToPolygon, setSwitchingBridge, switchingBridge, pendingTx, pendingFinalTx])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
      if (e.currentTarget.value === '' || inputRegex.test(e.currentTarget.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
        setBridgeAmount((e.currentTarget.value.length > 0) ? e.currentTarget.value : "")
      }
    },
    [setBridgeAmount],
  )

  const handleSelectMax = useCallback(() => {
    if (!pendingTx && !pendingFinalTx){
      setBridgeAmount(fullBalance.toString())
    }
  }, [fullBalance, pendingTx, pendingFinalTx])

  const handleChangeCurrency = useCallback(async (address, symbol) => {
    // console.log("changed", address, symbol)
    setApprovalSubmitted(false)
    setBridgeAmount("0")
    setCurrencyAddress(address)
    setSelectedCurrency(symbol)
    if (bridgeToPolygon){
      const balance = await getEthTokenBalance(address, account)
      setFullBalance(
        (new BigNumber(balance)).div(new BigNumber(10).pow(getDecimals(address))).toNumber()
      )
    } else {
      const balance = await getPolygonTokenBalance(getPolygonTokenAddress(address), account)
      setFullBalance(
        (new BigNumber(balance)).div(new BigNumber(10).pow(getDecimals(address))).toNumber()
      )
    }
  }, [setCurrencyAddress, setBridgeAmount, setSelectedCurrency, setApprovalSubmitted, account, bridgeToPolygon])

  useEffect(() => {
    const fetch = async () => {
      if (bridgeToPolygon){
        const balance = await getEthTokenBalance(currencyAddress, account)
      setFullBalance(
        (new BigNumber(balance)).div(new BigNumber(10).pow(getDecimals(currencyAddress))).toNumber()
      )
      } else {
        const balance = await getPolygonTokenBalance(getPolygonTokenAddress(currencyAddress), account)
      setFullBalance(
        (new BigNumber(balance)).div(new BigNumber(10).pow(getDecimals(currencyAddress))).toNumber()
      )
      }
    } 
    fetch()
  }, [currencyAddress, setFullBalance, account, bridgeToPolygon]);

  const bridgeTokenApprove = useCallback(async () => {
      
    if (bridgeAmount && bridgeAmount.length >0 && parseFloat(bridgeAmount) > 0){

      setPendingTx(true)

      try {
        if (bridgeToPolygon){
          const bridgeAmountFormatted = (new BigNumber(bridgeAmount)).times(new BigNumber(10).pow(getDecimals(currencyAddress))).toString()
          const approveSuccess = await onBridgeApprove(bridgeAmountFormatted, currencyAddress)
          setPendingTx(false)
          setPendingFinalTx(true)
          if (approveSuccess){
            await onBridgeDeposit(bridgeAmountFormatted, currencyAddress)
          }

        } else {
          const bridgeAmountFormatted = (new BigNumber(bridgeAmount)).times(new BigNumber(10).pow(getDecimals(currencyAddress))).toString()
          const burnSuccess = await onBridgeBurn(bridgeAmountFormatted, getPolygonTokenAddress(currencyAddress))
          setPendingTx(false)
          setPendingFinalTx(true)
          console.log("BURN", burnSuccess)
          if (burnSuccess && burnSuccess.transactionHash){
            const gotreceipt = await onBridgeCheckForReceipt(burnSuccess.transactionHash, burnSuccess.blockNumber, currencyAddress)
            if (gotreceipt){
              await onBridgeExit(burnSuccess.transactionHash)
            }
          }
        }
      } catch (error) {
        // TODO: find a way to handle when the user rejects transaction or it fails
      } finally {
          setPendingTx(false)
          setPendingFinalTx(false)
      }

      const fetch = async () => {
        if (bridgeToPolygon){
          const balance = await getEthTokenBalance(currencyAddress, account)
          setFullBalance(
            (new BigNumber(balance)).div(new BigNumber(10).pow(getDecimals(currencyAddress))).toNumber()
          )
        } else {
          const balance = await getPolygonTokenBalance(getPolygonTokenAddress(currencyAddress), account)
          setFullBalance(
            (new BigNumber(balance)).div(new BigNumber(10).pow(getDecimals(currencyAddress))).toNumber()
          )
        }
      } 
      fetch()
    }

  }, [onBridgeApprove, onBridgeDeposit, onBridgeExit, onBridgeBurn, bridgeAmount, currencyAddress, bridgeToPolygon, account, onBridgeCheckForReceipt])
  return (
    <StyledCakeStats>
      <CardBody>
        <div style={{fontSize:30, fontWeight:600, paddingBottom:24, textAlign:"center"}}>
          DinoSwap Paleo Bridge
        </div>
        <BridgeCardTop style={{ 
          backgroundColor:(
            (bridgeToPolygon && isDark) ?  '#344634' 
            : (bridgeToPolygon && !isDark) ? '#eff5f1'
            : (!bridgeToPolygon && isDark) ?  '#584e41' 
            :  '#ede6de'
          )}}>
          <CardBody style={{padding:14}}>
            From
             <NetworkTag style={{ backgroundColor:(bridgeToPolygon ?  '#a8d68f' : '#6eba45') }}>
               {bridgeToPolygon ? "Ethereum" : "Polygon"}
              </NetworkTag>
      <BridgeInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={bridgeAmount}
        max={fullBalance}
        symbol={selectedCurrency}
        account={account}
        currencyAddress={currencyAddress}
        bridgeToPolygon={bridgeToPolygon}
        onSelectCurrency={handleChangeCurrency}
        pending={pendingTx || pendingFinalTx}
      />

          </CardBody>
        </BridgeCardTop>

        <BridgeCardBottom style={{ 
          backgroundColor: (
            (bridgeToPolygon && isDark) ?  '#584e41' 
            : (bridgeToPolygon && !isDark) ? '#ede6de' 
            : (!bridgeToPolygon && isDark) ?  '#344634' 
            : '#eff5f1' 
            ) }}>
          <>          
            {/* <SwitchBridgeButton onClick={switchBridge}>
              <ArrowIcon src="./images/bridge.png" />
            </SwitchBridgeButton> */ }


            <CardBodyNoPaddingTop style={{ paddingTop:28/* marginTop:-36 */ }}>
              To
              <NetworkTag style={{ marginTop:0, backgroundColor:(bridgeToPolygon ?  '#6eba45' : '#a8d68f') }}>
                {bridgeToPolygon ? "Polygon" : "Ethereum"}
              </NetworkTag>

            <Button scale="xs" variant="text" style={{padding:"0 !important"}} onClick={()=> registerToken(getPolygonTokenAddress(currencyAddress), selectedCurrency, getDecimals(currencyAddress), null)}> Add Polygon {selectedCurrency} to MetaMask
            </Button>

                {/* <Flex justifyContent="flex-end" minHeight="21px" mb="8px" mr="48px" mt="-36px">
                  <Text color="primary" fontSize="13px">
                    {fullBalance} {selectedCurrency} {TranslateString(526, 'Available')}
                  </Text>
                </Flex> */}
            </CardBodyNoPaddingTop>
          </>
        </BridgeCardBottom>
        {((pendingTx || pendingFinalTx) && bridgeToPolygon) ? 
          <Text style={{textAlign:'center', marginTop:20}}>Please do not reload or leave this page. 
          <br/>Confirm transactions in your Wallet Provider.</Text> 
          : ((pendingTx || pendingFinalTx) && !bridgeToPolygon) ? 
          <Text style={{textAlign:'center', marginTop:20}}>Please do not reload or leave this page.
          <br/>Confirm transactions in your Wallet Provider.
          <br/>Bridging to Ethereum takes 45 minutes or more.
          <br/>If you accidentally close this page, you can always <a style={{textDecoration:"underline"}} href="https://polygon-withdraw.matic.network/" rel="noreferrer" target="_blank">claim your burned tokens here</a></Text> 
          :null}
        <Actions>
          {(account || pendingTx || pendingFinalTx) ? (
            <Button
              id="bridge"
              disabled={pendingTx || pendingFinalTx || (fullBalance===0)}
              onClick={bridgeTokenApprove}
              width="100%"
            >
              {(pendingTx && bridgeToPolygon)
                ? TranslateString(548, 'Approving... Please wait')
                : (pendingTx && !bridgeToPolygon) ? TranslateString(548, 'Burning... Please wait') 
                : pendingFinalTx ? TranslateString(548, 'Deposting... Please wait') : TranslateString(532, `Approve & Bridge`)
              }
            </Button>
          ) : (
            <UnlockButton width="100%" />
          )}
        </Actions>
      </CardBody>
    </StyledCakeStats>
  )
}

export default BridgeCard
