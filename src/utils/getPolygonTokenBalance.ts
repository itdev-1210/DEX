
import { getWeb3NoAccount } from 'utils/web3'
import { getBep20Contract } from 'utils/contractHelpers'

const getPolygonTokenBalance = async (tokenAddress, account) => {
  try {
    const web3 = getWeb3NoAccount()
    const tokenContract = getBep20Contract(tokenAddress, web3)
    const tokenBalance = await tokenContract.methods.balanceOf(account).call()
    return tokenBalance
  } catch(e){
    return 0
  }
}
export default getPolygonTokenBalance
