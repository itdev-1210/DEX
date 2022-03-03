import React from 'react'
import styled from 'styled-components'
import { Image } from '@dinoswap/uikit'
import Page from './layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <img src="/images/arq.png" alt="loading"/>
    </Wrapper>
  )
}

export default PageLoader
