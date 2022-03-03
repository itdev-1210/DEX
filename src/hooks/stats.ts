import { useEffect, useState } from 'react'
import farms from 'config/constants/farms'
import tokens from 'config/constants/tokens'
import contracts from 'config/constants/contracts'
import { getBep20Contract } from "utils/contractHelpers"
import BigNumber from 'bignumber.js'

const baseUrl = 'https://us-central1-dinoswapanalytics.cloudfunctions.net/app/api'

export interface ApiStatResponse {
  burned?: number
  circulating?: number
  total?: number
}

export const useGetStats = () => {
  const [data, setData] = useState<ApiStatResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/stats`)
        const responsedata: ApiStatResponse = await response.json()
        setData(responsedata)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}