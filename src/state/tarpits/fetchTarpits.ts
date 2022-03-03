import tarpitsConfig from 'config/constants/tarpits'
import cakeABI from 'config/abi/cake.json'
import TarpitsABIv2 from 'config/abi/tarpitv2.json'
import wbnbABI from 'config/abi/weth.json'
import multicall from 'utils/multicall'
import { getAddress, getWbnbAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'


const fetchTarpitsTotalStaking = async () => {

	// console.log("FETCHING TARPITS PUBLIC DATA")
  const oldTarpits = tarpitsConfig.filter((p) => !p.versiontwo)
  const newTarpits = tarpitsConfig.filter((p) => p.versiontwo === true)

  console.log("OLD TARPITS", oldTarpits, newTarpits)
  const callsTotalStakingOld = oldTarpits.map((tarpitConfig) => {
    return {
        address: getAddress(tarpitConfig.DINOAddress),
        name: 'balanceOf',
        params: [getAddress(tarpitConfig.contractAddress)],
    }
  })
  const callsTotalStakingNew = newTarpits.map((tarpitConfig) => {
    return {
        address: getAddress(tarpitConfig.contractAddress),
        name: 'stakedDinos',
    }
  })
  /* const callsLockingPeriodsNew = newTarpits.map((tarpitConfig) => {
    return {
        address: getAddress(tarpitConfig.contractAddress),
        name: 'lockingPeriods',
        params: ['0'],
    }
  }) */
  

  console.log("CALS NEW TARPIT", callsTotalStakingNew)

  const totalStakedOld = await multicall(cakeABI, callsTotalStakingOld)
  const totalStakedNew = await multicall(TarpitsABIv2, callsTotalStakingNew)
  // const lockingPeriodsNew = await multicall(TarpitsABIv2, callsLockingPeriodsNew)

  return tarpitsConfig.map((tarpitConfig, index) => {

    return {
      contractAddress: tarpitConfig.contractAddress,
      totalStaked: (tarpitConfig.versiontwo ? 
        (new BigNumber(totalStakedNew[newTarpits.findIndex((p)=> getAddress(p.contractAddress).toString() === getAddress(tarpitConfig.contractAddress).toString())]).div(new BigNumber(10).pow(18))).toNumber()
          : 
        (new BigNumber(totalStakedOld[oldTarpits.findIndex((p)=> getAddress(p.contractAddress).toString() === getAddress(tarpitConfig.contractAddress).toString())]).div(new BigNumber(10).pow(18))).minus(5000002.55).toNumber()
      ),
      // lockingPeriods: (tarpitConfig.versiontwo ? lockingPeriodsNew[newTarpits.findIndex((p)=> getAddress(p.contractAddress).toString() === getAddress(tarpitConfig.contractAddress).toString())] : null)
    }
  })

}

export default fetchTarpitsTotalStaking