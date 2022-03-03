import React from 'react'
import styled from 'styled-components'
import { Image, Button } from '@dinoswap/uikit'
import { CommunityTag } from 'components/Tags'
import useI18n from 'hooks/useI18n'
import Card from './Card'
import CardTitle from './CardTitle'

const Balance = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 40px;
  font-weight: 600;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
  margin-bottom: 16px;
`

const DetailPlaceholder = styled.div`
  display: flex;
  font-size: 14px;
`
const Value = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
`

const Footer = styled.div`
  border-top: 1px solid ${({ theme }) => (theme.isDark ? '#524B63' : '#E9EAEB')};
  padding: 24px;
`
const Coming: React.FC = () => {
  const TranslateString = useI18n()

  return (
    <Card>
      <div style={{ padding: '24px' }}>
        <CardTitle>
          {TranslateString(414, 'Your Project?')}{' '}
          <span role="img" aria-label="eyes">
            🦕
          </span>
        </CardTitle>
        <div style={{alignItems:'center', justifyContent:'center', width:"100%", textAlign:"center"}}><img src='/images/coming.png' alt="COMING SOON" style={{maxWidth:250, margin:"10px 0 20px 0"}} /></div>

        <div style={{height:15, width:"100%"}}/>
        <span style={{textAlign:'center'}}><Label>{TranslateString(416, 'Create a jurassic pool for your token:')}</Label></span>
        <div style={{height:15, width:"100%"}}/>
        <Button
          variant="secondary"
          as="a"
          href="https://docs.google.com/forms/d/e/1FAIpQLSc4HMwWWHDJEjiim0G39wA8-2fC2jnSQL1jgpMs7TKl-q7HLw/viewform"
          external
          width="100%"
          mb="16px"
        >
          {TranslateString(418, 'Apply Now')}
        </Button>
      </div>
    </Card>
  )
}

export default Coming
