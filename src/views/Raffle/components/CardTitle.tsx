import styled from 'styled-components'

interface StyledTitleProps {
  isFinished?: boolean
}

const CardTitle = styled.div<StyledTitleProps>`
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'text']};
  font-weight: 600;
  font-size: 28px;
  line-height: 1.1;
  text-align:center;
  padding: 7px 12px;
`

export default CardTitle
