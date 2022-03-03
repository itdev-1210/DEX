import { getWeb3NoAccountEth } from 'utils/web3Eth'
import { getBep20Contract } from 'utils/contractHelpers'

const getEthTokenBalance = async (tokenAddress, account) => {
  try {
    const web3 = getWeb3NoAccountEth()
    const tokenContract = getBep20Contract(tokenAddress, web3)
    const tokenBalance = await tokenContract.methods.balanceOf(account).call()
    return tokenBalance
  } catch (e){
    return 0
  }
}

export default getEthTokenBalance
