/* eslint-disable no-await-in-loop */
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

export const approve = async (lpContract, masterChefContract, account) => {
  return lpContract.methods
    .approve(masterChefContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const stake = async (masterChefContract, pid, amount, account) => {
  /* if (pid === 0) {
    return masterChefContract.methods
      .enterStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
      .send({ from: account, gas: 200000 })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  } */

  return masterChefContract.methods
    .deposit(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: 200000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const stakeTarpits = async (tarpitContract, length, amount, account) => {
  console.log("LOCKING WITH: ", new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), length)
  return tarpitContract.methods
    .lock(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), length.toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const stakeTarpitsNew = async (tarpitContract, length, amount, id, account) => {
  console.log("LOCKING WITH: ", new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), id, tarpitContract.methods, length)
  return tarpitContract.methods
    .lock(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(), id.toString())
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const fetchLocksTarpits = async (tarpitContract, account) => {
  const myLocks = [];
  let endOfLocks = false;
  while (!endOfLocks){
    try {
      const currentLock = await tarpitContract.methods.locks(account, myLocks.length).call()
      // console.log("CURRENT LOCK", currentLock)
      myLocks.push({
        amount: new BigNumber(currentLock.amount).div(new BigNumber(10).pow(18)).toString(), 
        reward: new BigNumber(currentLock.reward).div(new BigNumber(10).pow(18)).toString(), 
        claimed: currentLock.claimed, 
        validity: currentLock.validity
      })
    } catch(e){
      endOfLocks= true;
    }
  }

  return myLocks
}

export const sousStake = async (sousChefContract, amount, decimals = 18, account) => {
  return sousChefContract.methods
    .transact(new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString())
    .send({ from: account, gas: 200000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const jurassicStake = async (sousChefContract, amount, decimals = 18, account) => {
  return sousChefContract.methods
    .deposit(new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString())
    .send({ from: account, gas: 200000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}


export const sousStakeBnb = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .transact()
    .send({ from: account, gas: 200000, value: new BigNumber(amount).times(new BigNumber(10).pow(18)).toString() })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const unstake = async (masterChefContract, pid, amount, account) => {
  /* if (pid === 0) {
    return masterChefContract.methods
      .leaveStaking(new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
      .send({ from: account, gas: 200000 })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  } */

  return masterChefContract.methods
    .withdraw(pid, new BigNumber(amount).times(new BigNumber(10).pow(18)).toString())
    .send({ from: account, gas: 200000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousUnstake = async (sousChefContract, amount, decimals = 18, account) => {
  /* // shit code: hard fix for old CTK and BLK
  if (sousChefContract.options.address === '0x3B9B74f48E89Ebd8b45a53444327013a2308A9BC') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  if (sousChefContract.options.address === '0xBb2B66a2c7C2fFFB06EA60BeaD69741b3f5BF831') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  }
  if (sousChefContract.options.address === '0x453a75908fb5a36d482d5f8fe88eca836f32ead5') {
    return sousChefContract.methods
      .emergencyWithdraw()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  } */ 

  return sousChefContract.methods
    .withdraw(new BigNumber(amount).times(new BigNumber(10).pow(decimals)).toString())
    .send({ from: account, gas: 200000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const sousEmegencyUnstake = async (sousChefContract, amount, account) => {
  return sousChefContract.methods
    .emergencyWithdraw()
    .send({ from: account })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const harvest = async (masterChefContract, pid, account) => {
  /* if (pid === 0) {
    return masterChefContract.methods
      .leaveStaking('0')
      .send({ from: account, gas: 200000 })
      .on('transactionHash', (tx) => {
        return tx.transactionHash
      })
  } */

  return masterChefContract.methods
    .deposit(pid, '0')
    .send({ from: account, gas: 200000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const tarpitHarvest = async (tarpitContract, account) => {

  console.log("HARVESTING", account, tarpitContract)
  return tarpitContract.methods
    .unlock(account)
    .send({ from: account, gas: 200000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const soushHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .transact('0')
    .send({ from: account, gas: 200000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const jurassicHarvest = async (sousChefContract, account) => {
  return sousChefContract.methods
    .withdraw('0')
    .send({ from: account, gas: 200000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}


export const soushHarvestBnb = async (sousChefContract, account) => {
  return sousChefContract.methods
    .transact()
    .send({ from: account, gas: 200000, value: new BigNumber(0) })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const buyTicket = async (raffleContract, account, amount) => {
  return raffleContract.methods
    .enter(amount)
    .send({ from: account, gas: 20000000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const pickWinner = async (raffleContract, account) => {
  return raffleContract.methods
    .pickWinner()
    .send({ from: account, gas: 2000000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}

export const disburseWinner = async (raffleContract, account) => {
  return raffleContract.methods
    .disburseWinner()
    .send({ from: account, gas: 2000000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash
    })
}